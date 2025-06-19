import React, { useState, useEffect, useCallback } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { InternshipApplicationDetail, InternshipRequirement, InternshipDocument } from '@/services/internshipService';
import axiosClient from '@/api/axiosClient';
import { toast } from 'react-hot-toast';

interface InternshipApplication {
  id: string;
  studentName: string;
  studentSurname: string;
  internshipName: string;
  companyName: string;
  status: string;
  appliedDate: string;
}

interface Comment {
  fromUserId: string;
  fromUserName: string;
  comment: string;
  createdAt: string;
}

interface InternshipDetailsModalProps {
  open: boolean;
  onClose: () => void;
  application: InternshipApplication | null;
  detail: InternshipApplicationDetail | null;
  loading: boolean;
  isCommissionMember?: boolean; // Komisyon üyesi mi kontrolü
  onRequirementUpdate?: () => void; // Requirement güncellendiğinde tetiklenir
  onMessageSent?: () => void; // Mesaj gönderildiğinde bildirimleri yenile
}

const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({
  open,
  onClose,
  application,
  detail,
  loading,
  isCommissionMember = false,
  onRequirementUpdate,
  onMessageSent
}) => {
  // Early return BEFORE any hooks
  if (!open) return null;

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<InternshipRequirement | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [updateCounter, setUpdateCounter] = useState(0); // Force re-render için
  
  // Mesajlaşma state'leri
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  


  // Debug: API response'ını kontrol et
  console.log('🔍 InternshipDetailsModal - detail object:', detail);
  console.log('🔍 InternshipDetailsModal - detail requirements:', detail?.requirements);
  
  // ApplicationDetail'dan gelen requirements array'ini kullan (KOMISYON ÜYESİ İÇİN DOĞRU VERİ)
  const requirementsArray = detail?.requirements || [];
  
  // Belge gereksinimleri - DOCUMENT tipindeki gereksinimleri filtrele ve DEFTER'i hariç tut
  const documentRequirements = requirementsArray.filter(req => {
    // DOCUMENT tipinde olmalı
    if (req.ruleType !== 'DOCUMENT') return false;
    
    // SUBMISSION tipindeki belgeleri hariç tut (staj defteri)
    if (req.submissionType === 'SUBMISSION') return false;
    
    // DEFTER isimli belgeleri hariç tut (staj defteri belgeleri)
    if (req.name && req.name.toUpperCase().includes('DEFTER')) return false;
    
    return true;
  });
  
  // Topic gereksinimleri - TOPIC tipindeki gereksinimleri filtrele (otomatik approved)
  // SUBMISSION tipindeki topic'leri hariç tut, geri kalanını onayla
  const topicRequirements = requirementsArray.filter(req => 
    req.ruleType === 'TOPIC' && req.submissionType !== 'SUBMISSION'
  );
  
  console.log('🔍 InternshipDetailsModal - filtered documentRequirements:', documentRequirements);
  console.log('🔍 InternshipDetailsModal - filtered topicRequirements (SUBMISSION hariç):', topicRequirements);
  
  // SUBMISSION tipindeki topic'leri ayrı olarak göster (onaylanmayacak)
  const submissionTopicRequirements = requirementsArray.filter(req => 
    req.ruleType === 'TOPIC' && req.submissionType === 'SUBMISSION'
  );
  console.log('🔍 InternshipDetailsModal - SUBMISSION tipindeki topic\'ler (onaylanmayacak):', submissionTopicRequirements);



  // Mesajları yükle
  const loadComments = useCallback(async () => {
    if (!detail?.id) return;
    
    setCommentsLoading(true);
    try {
      const response = await axiosClient.get(`/api/v1/internship-applications/${detail.id}/comments`) as any;
      
      // API response doğrudan array olarak geliyor
      const commentsData = Array.isArray(response) ? response : (response.data || []);
      
      setComments(commentsData);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [detail?.id]);

  // Yeni mesaj gönder
  const sendComment = async () => {
    if (!detail?.id || !newComment.trim()) return;
    
    setSendingComment(true);
    try {
      await axiosClient.post(`/api/v1/internship-applications/${detail.id}/comments`, {
        comment: newComment.trim()
      });
      
      setNewComment('');
      // Mesajları yeniden yükle
      await loadComments();
      
      // Parent component'i bilgilendir (bildirimler yenilensin)
      if (onMessageSent) {
        onMessageSent();
      }
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error);
      alert('Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setSendingComment(false);
    }
  };

  // Topic'leri otomatik olarak onayla
  const autoApproveTopics = useCallback(async () => {
    if (!detail?.id || !topicRequirements.length) return;
    
    console.log('🎯 Topic auto-approval başlatılıyor (SUBMISSION hariç tüm topic\'ler)...', {
      applicationId: detail.id,
      topicCount: topicRequirements.length,
      topics: topicRequirements.map(t => ({ id: t.id, name: t.name, status: t.status, submissionType: t.submissionType }))
    });

    // Sadece henüz approved olmamış topic'leri onayla
    const unapprovedTopics = topicRequirements.filter(topic => topic.status !== 'APPROVED');
    
    if (unapprovedTopics.length === 0) {
      console.log('✅ Tüm topic\'ler zaten onaylanmış');
      return;
    }

    try {
      // Her topic için onaylama API'sini çağır
      const approvalPromises = unapprovedTopics.map(async (topic) => {
        try {
          const response = await axiosClient.put(`/api/v1/internship-applications/${detail.id}/requirement/${topic.id}/approve`);
          console.log(`✅ Topic otomatik onaylandı: ${topic.name}`, response);
          return { success: true, topicId: topic.id, topicName: topic.name };
        } catch (error: any) {
          console.error(`❌ Topic onaylanamadı: ${topic.name}`, error);
          return { success: false, topicId: topic.id, topicName: topic.name, error };
        }
      });

      const results = await Promise.allSettled(approvalPromises);
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
      
      console.log(`🎯 Topic otomatik onaylama tamamlandı: ${successCount}/${unapprovedTopics.length}`);
      
      // Topic'ler otomatik onaylandığında parent component'i güncelleme
      // Modal sürekli yenilenmemesi için bu kaldırıldı
      console.log('ℹ️ Topic otomatik onaylandi ama modal yenilenmeyecek');
    } catch (error) {
      console.error('❌ Topic otomatik onaylama genel hatası:', error);
    }
  }, [detail?.id, topicRequirements, onRequirementUpdate]);

  // Modal açıldığında verileri yükle
  useEffect(() => {
    if (open && detail?.id) {
      // Mesajları yükle
      loadComments();
    }
  }, [open, detail?.id, loadComments]);

  // Topic'leri otomatik onayla (ApplicationDetail yüklendikten sonra)
  useEffect(() => {
    if (open && detail?.id && topicRequirements.length > 0) {
      // Topic'leri otomatik onayla (sadece komisyon üyesi olarak)
      if (isCommissionMember) {
        // Kısa bir delay ile topic'leri onayla (UI render edildikten sonra)
        setTimeout(() => {
          autoApproveTopics();
        }, 500);
      }
    }
  }, [open, detail?.id, topicRequirements.length, isCommissionMember, autoApproveTopics]);

  // Onaylama fonksiyonu
  const handleApprove = async (requirementId: string) => {
    if (!detail?.id) return;
    
    setActionLoading(true);
    try {
      const response = await axiosClient.put(`/api/v1/internship-applications/${detail.id}/requirement/${requirementId}/approve`);
      
      console.log('✅ Onaylama başarılı!', {
        applicationId: detail.id,
        requirementId,
        response: response
      });
      
      // Güzel toast mesajı
      toast.success('🎉 Belge başarıyla onaylandı!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px'
        }
      });
      
      // Local state'i güncelle - requirement status'unu APPROVED yap
      if (detail.requirements) {
        const updatedRequirements = detail.requirements.map(req => 
          req.id === requirementId 
            ? { ...req, status: 'APPROVED' }
            : req
        );
        // Detail object'ini güncelle (re-render için)
        Object.assign(detail, { ...detail, requirements: updatedRequirements });
        // Force re-render
        setUpdateCounter(prev => prev + 1);
      }
      
    } catch (error: any) {
      console.error('❌ Onaylama hatası:', {
        applicationId: detail.id,
        requirementId,
        error: error.response?.data || error.message
      });
      
      toast.error('❌ Belge onaylanırken hata oluştu!', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Reddetme modalı açma
  const handleRejectClick = (requirement: InternshipRequirement) => {
    setSelectedRequirement(requirement);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  // Reddetme fonksiyonu
  const handleReject = async () => {
    if (!detail?.id || !selectedRequirement || !rejectReason.trim()) return;
    
    setActionLoading(true);
    try {
      const response = await axiosClient.put(`/api/v1/internship-applications/${detail.id}/requirement/${selectedRequirement.id}/reject`, {
        reason: rejectReason.trim()
      });
      
      console.log('✅ Reddetme başarılı!', {
        applicationId: detail.id,
        requirementId: selectedRequirement.id,
        reason: rejectReason.trim(),
        response: response
      });
      
      // Güzel toast mesajı
      toast.success('✅ Belge başarıyla reddedildi!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#EF4444',
          color: 'white',
          fontWeight: '600',
          padding: '16px',
          borderRadius: '12px'
        }
      });
      
      // Local state'i güncelle - requirement status'unu REJECTED yap
      if (detail.requirements) {
        const updatedRequirements = detail.requirements.map(req => 
          req.id === selectedRequirement.id 
            ? { ...req, status: 'REJECTED' }
            : req
        );
        // Detail object'ini güncelle (re-render için)
        Object.assign(detail, { ...detail, requirements: updatedRequirements });
        // Force re-render
        setUpdateCounter(prev => prev + 1);
      }
      
      // Modal'ı kapat
      setRejectModalOpen(false);
      setSelectedRequirement(null);
      setRejectReason('');
    } catch (error: any) {
      console.error('❌ Reddetme hatası:', {
        applicationId: detail.id,
        requirementId: selectedRequirement?.id,
        reason: rejectReason.trim(),
        error: error.response?.data || error.message
      });
      
      toast.error('❌ Belge reddedilirken hata oluştu!', {
        duration: 4000,
        position: 'top-center',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      // RequirementStatus enum'ları
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'WAITING_FOR_APPROVAL':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'WAITING_FOR_UPLOAD':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      
      // Application status'ları (backward compatibility)
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'READY_FOR_ASSIGNMENT':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'ASSIGNED':
        return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
      case 'APPLICATION_APPROVED':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      // RequirementStatus enum'ları
      case 'APPROVED':
        return '✅ Belgeniz Onaylandı';
      case 'WAITING_FOR_APPROVAL':
        return '⏳ İnceleniyor';
      case 'REJECTED':
        return '❌ Belge Reddedildi';
      case 'WAITING_FOR_UPLOAD':
        return '📄 Belge Yükleme Bekleniyor';
      
      // Application status'ları (backward compatibility)
      case 'PENDING':
        return 'Beklemede';
      case 'READY_FOR_ASSIGNMENT':
        return '📄 Belgelerinizi Yükleyebilirsiniz';
      case 'ASSIGNED':
        return '⏳ Başvurunuz İnceleniyor';
      case 'APPLICATION_APPROVED':
        return 'Başvurunuz Onaylandı! 🎉';
      case 'IN_PROGRESS':
        return 'Staj Devam Ediyor';
      case 'COMPLETED':
        return 'Staj Tamamlandı';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      // RequirementStatus enum'ları
      case 'APPROVED':
        return 'check-circle';
      case 'WAITING_FOR_APPROVAL':
        return 'time';
      case 'REJECTED':
        return 'cross-circle';
      case 'WAITING_FOR_UPLOAD':
        return 'cloud-add';
      
      // Application status'ları (backward compatibility)
      case 'PENDING':
        return 'time';
      case 'READY_FOR_ASSIGNMENT':
        return 'cloud-add';
      case 'ASSIGNED':
        return 'user';
      case 'APPLICATION_APPROVED':
        return 'check-circle';
      case 'IN_PROGRESS':
        return 'briefcase';
      case 'COMPLETED':
        return 'medal-star';
      default:
        return 'information-2';
    }
  };

  // Dosya açma fonksiyonu
  const openDocument = (document: InternshipDocument) => {
    if (!document.fileAddress) {
      toast.error('Dosya adresi bulunamadı');
      return;
    }

    try {
      // fileAddress'den sadece dosya adını al
      const fileName = document.fileAddress.split('/').pop() || document.fileName;
      
      // Sabit Downloads klasörü yolu
      const localFilePath = `file:///C:/Users/Mikdat%20Can%20Simsek/Downloads/${fileName}`;
      
      console.log('📁 Dosya açılıyor:', {
        originalPath: document.fileAddress,
        fileName: fileName,
        localPath: localFilePath
      });

      // Önce doğrudan açmayı dene
      window.open(localFilePath, '_blank');

      // Kullanıcıya bilgi ver
      toast.success(
        <div>
          <div className="font-semibold">📄 {fileName}</div>
          <div className="text-sm mt-1">Downloads klasöründe aranıyor...</div>
          <div className="text-xs mt-1 opacity-75">
            Dosya bulunamazsa manuel olarak Downloads klasörünü kontrol edin
          </div>
        </div>,
        {
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#3B82F6',
            color: 'white',
            fontWeight: '500',
            padding: '16px',
            borderRadius: '12px',
            maxWidth: '400px'
          }
        }
      );
    } catch (error) {
      console.error('Dosya açma hatası:', error);
      toast.error(
        <div>
          <div className="font-semibold">❌ Dosya açılamadı</div>
          <div className="text-sm mt-1">Downloads klasörünü manuel kontrol edin</div>
        </div>,
        {
          duration: 4000,
          position: 'top-center',
        }
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full relative border-2 border-[#13126e] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <KeenIcon icon="document" className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Staj Başvuru Detayları</h2>
                <p className="text-blue-100 text-sm mt-1">Başvuru belgelerini inceleyin</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <KeenIcon icon="cross" className="text-2xl" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-60">
              <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#13126e]/20"></div>
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-[#13126e] absolute top-0 left-0"></div>
              </div>
              <span className="text-gray-600 mt-4 font-medium">Detaylar yükleniyor...</span>
            </div>
          ) : detail ? (
            <>
              {/* Genel Bilgiler */}
              <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#13126e] to-[#1f1e7e] p-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeenIcon icon="profile-circle" className="text-white text-xl" />
                    Genel Bilgiler
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="user" className="text-[#13126e] text-lg" />
                        <span className="text-sm font-semibold text-[#13126e]">Öğrenci</span>
                      </div>
                      <p className="text-gray-800 font-bold text-lg">{detail.studentName} {detail.studentSurname}</p>
                      {detail.studentEmail && (
                        <p className="text-gray-600 text-sm">📧 {detail.studentEmail}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="office-bag" className="text-[#13126e] text-lg" />
                        <span className="text-sm font-semibold text-[#13126e]">Şirket</span>
                      </div>
                      <p className="text-gray-800 font-bold text-lg">{detail.companyName}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="briefcase" className="text-[#13126e] text-lg" />
                        <span className="text-sm font-semibold text-[#13126e]">Staj Türü</span>
                      </div>
                      <p className="text-gray-800 font-bold text-lg">{detail.internshipName}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="calendar" className="text-[#13126e] text-lg" />
                        <span className="text-sm font-semibold text-[#13126e]">Başlangıç Tarihi</span>
                      </div>
                      <p className="text-gray-700 font-medium">{new Date(detail.startDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="calendar" className="text-[#13126e] text-lg" />
                        <span className="text-sm font-semibold text-[#13126e]">Bitiş Tarihi</span>
                      </div>
                      <p className="text-gray-700 font-medium">{new Date(detail.endDate).toLocaleDateString('tr-TR')}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <KeenIcon icon="tag" className="text-[#13126e] text-lg" />
                        <span className="text-sm font-semibold text-[#13126e]">Tip</span>
                      </div>
                      <p className="text-gray-700 font-medium">{detail.type === 'VOLUNTARY' ? '🎯 Gönüllü' : '📋 Zorunlu'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-[#13126e]">Durum:</span>
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusBadge(detail.status)}`}>
                        <KeenIcon icon={getStatusIcon(detail.status)} className="text-sm" />
                        {getStatusText(detail.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gerekli Belgeler */}
              {documentRequirements.length > 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#13126e] to-[#1f1e7e] p-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <KeenIcon icon="document" className="text-white text-xl" />
                      Gerekli Belgeler
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        {documentRequirements.length} belge
                      </span>
                    </h4>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-6">
                      {documentRequirements.map((requirement, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50/30">
                          <div className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-[#13126e]/10 rounded-xl">
                                  <KeenIcon icon="document" className="text-lg text-[#13126e]" />
                                </div>
                                <div>
                                  <h5 className="font-bold text-gray-900 text-lg">{requirement.name}</h5>
                                </div>
                              </div>
                              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusBadge(requirement.status || 'WAITING_FOR_UPLOAD')}`}>
                                <KeenIcon icon={getStatusIcon(requirement.status || 'WAITING_FOR_UPLOAD')} className="text-sm" />
                                {getStatusText(requirement.status || 'WAITING_FOR_UPLOAD')}
                              </span>
                            </div>
                            
                            {requirement.description && requirement.description !== requirement.name && (
                              <div className="text-gray-600 text-sm mb-4 bg-white/70 p-4 rounded-xl border-l-4 border-[#13126e]" 
                                   dangerouslySetInnerHTML={{ __html: requirement.description }}>
                              </div>
                            )}
                            
                            {/* Yüklenen Belgeler */}
                            {requirement.documents && requirement.documents.length > 0 && (
                              <div className="bg-white rounded-xl p-4 border border-gray-200">
                                <h6 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                  <KeenIcon icon="cloud-upload" className="text-green-600 text-sm" />
                                  Yüklenen Belgeler ({requirement.documents.length})
                                </h6>
                                <div className="space-y-2">
                                  {requirement.documents.map((document: InternshipDocument) => (
                                    <div 
                                      key={document.id} 
                                      onClick={() => openDocument(document)}
                                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
                                      title={`${document.fileName} dosyasını aç`}
                                    >
                                      <div className="p-2 bg-green-100 group-hover:bg-blue-100 rounded-lg transition-colors">
                                        <KeenIcon icon="document" className="text-green-600 group-hover:text-blue-600 text-sm transition-colors" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">{document.fileName}</span>
                                        <div className="text-xs text-gray-500 mt-1">{document.documentType}</div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="p-1 bg-green-100 group-hover:bg-blue-100 rounded-full transition-colors">
                                          <KeenIcon icon="check" className="text-green-600 group-hover:text-blue-600 text-xs transition-colors" />
                                        </div>
                                        <div className="p-1 bg-gray-100 group-hover:bg-blue-100 rounded-full transition-colors opacity-70 group-hover:opacity-100">
                                          <KeenIcon icon="eye" className="text-gray-600 group-hover:text-blue-600 text-xs transition-colors" />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Komisyon Üyesi Onaylama/Reddetme Butonları */}
                            {isCommissionMember && requirement.documents && requirement.documents.length > 0 && (
                              <div className="mt-4">
                                {/* Belge Durumu Bilgi Mesajı */}
                                {(requirement.status === 'APPROVED' || requirement.status === 'REJECTED') && (
                                  <div className={`p-4 rounded-xl border-l-4 mb-4 ${
                                    requirement.status === 'APPROVED' 
                                      ? 'bg-green-50 border-green-400 text-green-800' 
                                      : 'bg-red-50 border-red-400 text-red-800'
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      <KeenIcon 
                                        icon={requirement.status === 'APPROVED' ? 'check-circle' : 'cross-circle'} 
                                        className="text-lg" 
                                      />
                                      <span className="font-semibold">
                                        {requirement.status === 'APPROVED' 
                                          ? 'Bu belge zaten onaylanmış' 
                                          : 'Bu belge zaten reddedilmiş'
                                        }
                                      </span>
                                    </div>
                                    <p className="text-sm mt-1 opacity-80">
                                      {requirement.status === 'APPROVED' 
                                        ? 'Belge komisyon tarafından onaylandı. Başka işlem yapmanıza gerek yok.' 
                                        : 'Belge komisyon tarafından reddedildi. Öğrenci yeni belge yüklemesi gerekiyor.'
                                      }
                                    </p>
                                  </div>
                                )}

                                {/* Aktif Butonlar - Sadece WAITING_FOR_APPROVAL durumunda göster */}
                                {requirement.status === 'WAITING_FOR_APPROVAL' && (
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => handleApprove(requirement.id)}
                                      disabled={actionLoading}
                                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                      {actionLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                      ) : (
                                        <KeenIcon icon="check" className="text-sm" />
                                      )}
                                      Onayla
                                    </button>
                                    <button
                                      onClick={() => handleRejectClick(requirement)}
                                      disabled={actionLoading}
                                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                      {actionLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                      ) : (
                                        <KeenIcon icon="cross" className="text-sm" />
                                      )}
                                      Reddet
                                    </button>
                                  </div>
                                )}

                                {/* Soluk Butonlar - APPROVED/REJECTED durumlarında */}
                                {(requirement.status === 'APPROVED' || requirement.status === 'REJECTED') && (
                                  <div className="flex gap-3">
                                    <button
                                      disabled
                                      className={`flex-1 px-4 py-3 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2 opacity-40 ${
                                        requirement.status === 'APPROVED' 
                                          ? 'bg-green-200 text-green-700' 
                                          : 'bg-gray-200 text-gray-500'
                                      }`}
                                    >
                                      <KeenIcon icon="check" className="text-sm" />
                                      {requirement.status === 'APPROVED' ? 'Onaylandı' : 'Onayla'}
                                    </button>
                                    <button
                                      disabled
                                      className={`flex-1 px-4 py-3 rounded-xl font-medium cursor-not-allowed flex items-center justify-center gap-2 opacity-40 ${
                                        requirement.status === 'REJECTED' 
                                          ? 'bg-red-200 text-red-700' 
                                          : 'bg-gray-200 text-gray-500'
                                      }`}
                                    >
                                      <KeenIcon icon="cross" className="text-sm" />
                                      {requirement.status === 'REJECTED' ? 'Reddedildi' : 'Reddet'}
                                    </button>
                                  </div>
                                )}

                                {/* Belge Yüklenmemiş Durumu */}
                                {requirement.status === 'WAITING_FOR_UPLOAD' && (
                                  <div className="p-4 rounded-xl bg-purple-50 border-l-4 border-purple-400 text-purple-800">
                                    <div className="flex items-center gap-2">
                                      <KeenIcon icon="cloud-add" className="text-lg" />
                                      <span className="font-semibold">Belge Yüklenmemiş</span>
                                    </div>
                                    <p className="text-sm mt-1 opacity-80">
                                      Öğrenci henüz bu belgeyi yüklemedi. Belge yüklendikten sonra onaylama işlemi yapabilirsiniz.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="p-12 text-center">
                    <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                      <KeenIcon icon="document" className="text-4xl text-gray-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">Belge Gereksinimi Yok</h4>
                    <p className="text-gray-500">Bu başvuru için gerekli belge bulunmuyor.</p>
                  </div>
                </div>
              )}

              {/* İlgili Konular (Topics) - Gizlendi */}
              {false && topicRequirements.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <KeenIcon icon="star" className="text-white text-xl" />
                      İlgili Konular
                      <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                        {topicRequirements.length} konu
                      </span>
                    </h4>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {topicRequirements.map((topic, idx) => (
                        <div key={idx} className="border border-green-200 rounded-2xl overflow-hidden bg-gradient-to-r from-green-50 to-green-100/30">
                          <div className="p-5">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-600/10 rounded-xl">
                                  <KeenIcon icon="star" className="text-green-600 text-lg" />
                                </div>
                                <h5 className="font-bold text-gray-900 text-lg">{topic.name}</h5>
                              </div>
                              {/* Topic'ler her zaman APPROVED */}
                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                                <KeenIcon icon="check-circle" className="text-sm" />
                                ✅ Otomatik Onaylandı
                              </span>
                            </div>
                            
                            {topic.description && topic.description !== topic.name && (
                              <div className="text-gray-600 text-sm bg-white/70 p-4 rounded-xl border-l-4 border-green-600" 
                                   dangerouslySetInnerHTML={{ __html: topic.description }}>
                              </div>
                            )}

                            {/* Topic bilgi mesajı */}
                            <div className="mt-4 p-4 rounded-xl bg-green-50 border-l-4 border-green-400 text-green-800">
                              <div className="flex items-center gap-2">
                                <KeenIcon icon="information-2" className="text-lg" />
                                <span className="font-semibold">Bilgi</span>
                              </div>
                              <p className="text-sm mt-1 opacity-80">
                                Bu konu başlığı otomatik olarak onaylanmıştır. Herhangi bir belge yüklemenize gerek yoktur.
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Mesajlaşma Bölümü */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#13126e] to-[#1f1e7e] p-4">
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    <KeenIcon icon="message-text" className="text-white text-xl" />
                    Mesajlaşma
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
                      {comments.length} mesaj
                    </span>
                  </h4>
                </div>
                
                <div className="p-6">
                  {/* Mesaj Listesi */}
                  <div className="mb-6 max-h-80 overflow-y-auto">
                    {commentsLoading ? (
                      <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#13126e]"></div>
                        <span className="ml-3 text-gray-600">Mesajlar yükleniyor...</span>
                      </div>
                    ) : comments.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-xl">
                        <KeenIcon icon="message-text" className="text-4xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">Henüz mesaj bulunmuyor.</p>
                        <p className="text-gray-400 text-sm">İlk mesajı göndererek konuşmaya başlayın.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment, index) => {
                          // Komisyon üyesi olarak bakarken: ben yazdıysam sağda, öğrenci yazdıysa solda
                          const isMyMessage = isCommissionMember 
                            ? comment.fromUserId !== detail?.studentId  // Komisyon üyesi: öğrenci değilse benim mesajım
                            : comment.fromUserId === detail?.studentId; // Öğrenci: benim ID'imse benim mesajım
                          
                          return (
                          <div
                            key={index}
                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                                isMyMessage
                                  ? 'bg-[#13126e] text-white rounded-br-sm'
                                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <KeenIcon 
                                  icon={isMyMessage ? (isCommissionMember ? 'teacher' : 'user') : (isCommissionMember ? 'user' : 'teacher')} 
                                  className="text-sm" 
                                />
                                <span className="text-xs font-semibold opacity-80">
                                  {comment.fromUserName}
                                </span>
                              </div>
                              <p className="text-sm leading-relaxed">{comment.comment}</p>
                              <p className={`text-xs mt-2 opacity-60 ${
                                isMyMessage ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {new Date(comment.createdAt).toLocaleDateString('tr-TR', {
                                  day: '2-digit',
                                  month: '2-digit',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Mesaj Gönderme Formu */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Mesajınızı yazın..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-transparent resize-none"
                          rows={3}
                          disabled={sendingComment}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              sendComment();
                            }
                          }}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Enter ile gönder, Shift+Enter ile yeni satır
                        </div>
                      </div>
                      <button
                        onClick={sendComment}
                        disabled={sendingComment || !newComment.trim()}
                        className="px-6 py-3 bg-[#13126e] hover:bg-[#1f1e7e] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 self-start"
                      >
                        {sendingComment ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <KeenIcon icon="send" className="text-sm" />
                        )}
                        Gönder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-12 text-center">
                <div className="p-4 bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <KeenIcon icon="warning" className="text-4xl text-red-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-700 mb-2">Detaylar Yüklenemedi</h4>
                <p className="text-gray-500">Başvuru detayları yüklenirken bir hata oluştu.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reddetme Modal'ı */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 border-red-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <KeenIcon icon="cross-circle" className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Belgeyi Reddet</h3>
                    <p className="text-red-100 text-sm">Reddetme sebebini belirtin</p>
                  </div>
                </div>
                <button 
                  onClick={() => setRejectModalOpen(false)}
                  disabled={actionLoading}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  <KeenIcon icon="cross" className="text-lg" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {selectedRequirement?.name}
                </h4>
                <p className="text-gray-600 text-sm">
                  Bu belgeyi reddetme sebebinizi açıklayın. Bu mesaj öğrenciye iletilecektir.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reddetme Gerekçesi *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Örn: Belge okunaksız, eksik bilgi içeriyor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  disabled={actionLoading}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {rejectReason.length}/500 karakter
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setRejectModalOpen(false)}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-4 py-3 rounded-xl font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !rejectReason.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Reddediliyor...
                    </>
                  ) : (
                    <>
                      <KeenIcon icon="cross-circle" className="text-sm" />
                      Reddet
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipDetailsModal; 