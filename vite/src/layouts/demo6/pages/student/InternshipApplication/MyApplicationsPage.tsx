import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { 
  getMyInternshipApplicationsList, 
  getInternshipApplicationDetailById,
  uploadInternshipDocument,
  InternshipApplicationListItem,
  InternshipApplicationDetail,
  getInternshipDetail,
  InternshipDetail
} from '@/services/internshipService';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '@/api/axiosClient';

// Mesaj interface'i
interface Comment {
  fromUserId: string;
  fromUserName: string;
  comment: string;
  createdAt: string;
}

// Topic açıklamalarını düzgün formatta render eden component
const TopicDescriptionRenderer: React.FC<{ description: string }> = ({ description }) => {
  // HTML taglerini parse et ve düzgün formatta göster
  const parseHTMLContent = (content: string) => {
    if (!content) return null

    // Basit HTML temizleme ve dönüştürme
    let cleanContent = content
      .replace(/<\/?(p|div|span)[^>]*>/gi, '') // p, div, span taglerini kaldır
      .replace(/<br\s*\/?>/gi, '\n') // br taglerini yeni satır yap
      .replace(/&nbsp;/gi, ' ') // Non-breaking space'leri normal space yap
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&amp;/gi, '&')
      .trim()

    // Liste öğelerini yakala
    const listItems = cleanContent.match(/<li[^>]*>(.*?)<\/li>/gi)
    const hasOrderedList = /<ol[^>]*>/i.test(content)
    const hasUnorderedList = /<ul[^>]*>/i.test(content)

    if (listItems) {
      // Liste öğelerini temizle
      const items = listItems.map(item => 
        item.replace(/<\/?li[^>]*>/gi, '').trim()
      )

      return (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className={`inline-block w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center mt-0.5 ${
                hasOrderedList ? 'bg-blue-600' : 'bg-indigo-600'
              }`}>
                {hasOrderedList ? index + 1 : '•'}
              </span>
              <span className="flex-1 leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      )
    }

    // Eğer liste yoksa normal paragraf olarak göster ama satır sonlarını koru
    const paragraphs = cleanContent.split('\n').filter(p => p.trim())
    
    return (
      <div className="space-y-2">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="leading-relaxed">{paragraph}</p>
        ))}
      </div>
    )
  }

  return <div>{parseHTMLContent(description)}</div>
}

// Yeni başvuru durumu için renk ve etiket bilgileri
const statusConfig: Record<string, { label: string; color: string; description: string }> = {
  PENDING: { 
    label: 'Beklemede', 
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Başvurunuz sistem tarafından alındı'
  },
  READY_FOR_ASSIGNMENT: { 
    label: '📄 Belgelerinizi Yükleyebilirsiniz', 
    color: 'bg-purple-100 text-purple-800',
    description: 'Gerekli belgeleri yükleyerek başvurunuzu tamamlayın'
  },
  ASSIGNED: { 
    label: '⏳ Başvurunuz İnceleniyor', 
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Belgeleriniz komisyon üyesi tarafından değerlendiriliyor'
  },
  APPLICATION_APPROVED: { 
    label: 'Başvurunuz Onaylandı! 🎉', 
    color: 'bg-green-100 text-green-800',
    description: 'Tebrikler! Staj başvurunuz kabul edildi'
  },
  REJECTED: { 
    label: 'Başvuru Reddedildi', 
    color: 'bg-red-100 text-red-800',
    description: 'Maalesef başvurunuz kabul edilmedi'
  },
  IN_PROGRESS: { 
    label: 'Staj Devam Ediyor', 
    color: 'bg-orange-100 text-orange-800',
    description: 'Stajınız şu anda devam etmekte'
  },
  COMPLETED: { 
    label: 'Staj Tamamlandı', 
    color: 'bg-blue-100 text-blue-800',
    description: 'Staj süreciniz başarıyla tamamlandı'
  },
  // Eski APPROVED enum'u için backward compatibility
  APPROVED: { 
    label: 'Başvurunuz Onaylandı! 🎉', 
    color: 'bg-green-100 text-green-800',
    description: 'Tebrikler! Staj başvurunuz kabul edildi'
  },
};

const MyApplicationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplicationDetail | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState<Set<string>>(new Set());
  
  // InternshipType detayı state'leri
  const [internshipDetail, setInternshipDetail] = useState<InternshipDetail | null>(null);
  const [internshipDetailLoading, setInternshipDetailLoading] = useState(false);
  
  // Mesajlaşma state'leri
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [sendingComment, setSendingComment] = useState(false);
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Mesajları yükle
  const loadComments = useCallback(async () => {
    if (!selectedApplication?.id) return;
    
    setCommentsLoading(true);
    try {
      console.log('🔄 Mesajlar yükleniyor, applicationId:', selectedApplication.id);
      
      const response = await axiosClient.get(`/api/v1/internship-applications/${selectedApplication.id}/comments`) as any;
      
      console.log('📡 Ham API Response:', response);
      console.log('📦 Response Data:', response.data);
      
      // API response'u kontrol et - doğrudan array mi yoksa result içinde mi?
      let commentsData: Comment[] = [];
      
      if (Array.isArray(response)) {
        // Eğer response doğrudan array ise
        commentsData = response;
      } else if (response.data && Array.isArray(response.data.result)) {
        // Eğer response.data.result array ise
        commentsData = response.data.result;
      } else if (response.data && Array.isArray(response.data)) {
        // Eğer response.data doğrudan array ise
        commentsData = response.data;
      } else {
        console.warn('⚠️ Beklenmeyen API response formatı:', response);
        commentsData = [];
      }
      
      console.log('📩 İşlenmiş mesajlar:', commentsData);
      console.log('📊 Mesaj sayısı:', commentsData.length);
      
      setComments(commentsData);
    } catch (error) {
      console.error('❌ Mesajlar yüklenirken hata:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [selectedApplication?.id]);

  // Yeni mesaj gönder
  const sendComment = async () => {
    if (!selectedApplication?.id || !newComment.trim()) return;
    
    setSendingComment(true);
    try {
      await axiosClient.post(`/api/v1/internship-applications/${selectedApplication.id}/comments`, {
        comment: newComment.trim()
      });
      
      setNewComment('');
      // Mesajları yeniden yükle
      await loadComments();
      
      toast.success('Mesajınız gönderildi!');
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      toast.error('Mesaj gönderilirken bir hata oluştu');
    } finally {
      setSendingComment(false);
    }
  };

  // Başvuru listesini çek
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['my-internship-applications'],
    queryFn: getMyInternshipApplicationsList,
  });

  // InternshipType detayını yükle
  const loadInternshipDetail = useCallback(async (internshipId: string) => {
    setInternshipDetailLoading(true);
    try {
      console.log('🔄 MyApplicationsPage - InternshipDetail yükleniyor, internshipId:', internshipId);
      
      const response = await getInternshipDetail(internshipId);
      
      console.log('📦 MyApplicationsPage - InternshipDetail Response:', response);
      console.log('📋 MyApplicationsPage - Rules Array:', response.rules);
      
      setInternshipDetail(response);
    } catch (error) {
      console.error('❌ MyApplicationsPage - InternshipDetail yüklenirken hata:', error);
      setInternshipDetail(null);
    } finally {
      setInternshipDetailLoading(false);
    }
  }, []);

  // Modal açma ve detay yükleme
  const openDetailsModal = async (application: InternshipApplicationListItem) => {
    try {
      console.log('🔍 Modal açılıyor, application ID:', application.id);
      const detail = await getInternshipApplicationDetailById(application.id);
      console.log('📋 Yüklenen detay:', detail);
      setSelectedApplication(detail);
      
      // InternshipType detayını da yükle
      if (detail.internshipId) {
        await loadInternshipDetail(detail.internshipId);
      }
      
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Detay yükleme hatası:', error);
      toast.error('Başvuru detayı yüklenirken bir hata oluştu');
    }
  };

  // Modal kapama
  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedApplication(null);
    setInternshipDetail(null); // InternshipDetail'ı da temizle
    setComments([]);
    setNewComment('');
  };

  // Modal açıldığında mesajları yükle
  useEffect(() => {
    if (selectedApplication?.id) {
      loadComments();
    }
  }, [selectedApplication?.id, loadComments]);

  // Arama filtreleme
  const filteredApplications = applications.filter((app) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      app.companyName.toLowerCase().includes(searchLower) ||
      app.internshipName.toLowerCase().includes(searchLower) ||
      app.status.toLowerCase().includes(searchLower) ||
      (statusConfig[app.status]?.label || '').toLowerCase().includes(searchLower)
    );
  });

  // Belge filtreleme - useMemo ile optimize et
  const documentDisplayData = useMemo(() => {
    if (!selectedApplication) return { documentsToShow: [], submissionDocuments: [], shouldShowSubmissionDocuments: false };
    
    // InternshipApplicationDetail'dan gelen requirements array'ini kullan (UPLOAD İÇİN DOĞRU ID'LER)
    const requirementsArray = selectedApplication.requirements || [];
    
    // MyApplicationsPage'de sadece APPLICATION belgelerini göster
    // SUBMISSION belgeleri (staj defteri) ayrı sayfada gösterilecek
    const shouldShowSubmissionDocuments = false; // Her zaman false

    console.log('🔍 MyApplicationsPage DocumentDisplayData Debug:', {
      applicationStatus: selectedApplication.status,
      shouldShowSubmissionDocuments,
      requirementsArrayLength: requirementsArray.length,
      requirementsArray: requirementsArray,
      applicationDetailLoaded: !!selectedApplication
    });

    // Sadece APPLICATION belgeleri (ruleType === 'DOCUMENT' ve submissionType yok veya APPLICATION)
    const applicationDocuments = requirementsArray.filter(req => {
      // DOCUMENT tipinde olmalı
      if (req.ruleType !== 'DOCUMENT') return false;
      
      // SUBMISSION tipindeki belgeleri hariç tut
      if (req.submissionType === 'SUBMISSION') return false;
      
      // DEFTER isimli belgeleri hariç tut (staj defteri belgeleri)
      if (req.name && req.name.toUpperCase().includes('DEFTER')) return false;
      
      // APPLICATION belgelerini veya submissionType'ı olmayan belgeleri dahil et
      return !req.submissionType || req.submissionType === 'APPLICATION';
    });

    // SUBMISSION belgeleri (bilgi için tutuyoruz ama göstermiyoruz)
    const submissionDocuments = requirementsArray.filter(req => 
      req.ruleType === 'DOCUMENT' && 
      (req.submissionType === 'SUBMISSION' || (req.name && req.name.toUpperCase().includes('DEFTER')))
    );

    console.log('📄 MyApplicationsPage Belge Filtreleme Sonuçları:', {
      applicationDocuments: applicationDocuments.length,
      submissionDocuments: submissionDocuments.length,
      applicationDocumentsList: applicationDocuments.map(doc => ({ id: doc.id, name: doc.name, ruleType: doc.ruleType })),
      submissionDocumentsList: submissionDocuments.map(doc => ({ id: doc.id, name: doc.name, ruleType: doc.ruleType })),
      note: 'SUBMISSION belgeleri MyApplicationsPage\'de gösterilmiyor - ayrı sayfada olacak'
    });

    // Sadece APPLICATION belgelerini göster (SUBMISSION belgeler dahil edilmiyor)
    const documentsToShow = applicationDocuments;

    console.log('📋 MyApplicationsPage Final DocumentsToShow:', documentsToShow.length, 'belge gösterilecek');
    console.log('🆔 DocumentsToShow ID\'leri:', documentsToShow.map(doc => ({ id: doc.id, name: doc.name })));

    return { documentsToShow, submissionDocuments, shouldShowSubmissionDocuments };
  }, [selectedApplication]);

  // Document yükleme fonksiyonu
  const handleDocumentUpload = async (requirementId: string, file: File) => {
    if (!selectedApplication) return;

    console.log('🔍 Upload Debug - Gönderilen parametreler:', {
      applicationId: selectedApplication.id,
      requirementId: requirementId,
      fileName: file.name,
      documentDisplayData: documentDisplayData.documentsToShow.map(doc => ({
        id: doc.id,
        name: doc.name,
        submissionType: doc.submissionType
      }))
    });

    const uploadKey = `${selectedApplication.id}-${requirementId}`;
    setUploadingDocuments(prev => new Set([...prev, uploadKey]));

    try {
      await uploadInternshipDocument(
        selectedApplication.id,
        requirementId,
        file,
        file.name
      );

      toast.success('Belge başarıyla yüklendi!');
      
      // Detay verisini yenile
      queryClient.invalidateQueries({ 
        queryKey: ['internship-application-detail', selectedApplication.id] 
      });
      
      // Modal'ı yeniden aç (güncel veriyle)
      const updatedDetail = await getInternshipApplicationDetailById(selectedApplication.id);
      setSelectedApplication(updatedDetail);

    } catch (error: any) {
      console.error('Document upload error:', error);
      
      // Backend'den gelen spesifik hataları kontrol et
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;
        
        switch (status) {
          case 400:
            toast.error('Geçersiz dosya veya parametreler. Lütfen dosyanızı kontrol edin.');
            break;
          case 401:
            toast.error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
            break;
          case 403:
            toast.error('Bu işlem için yetkiniz bulunmuyor.');
            break;
          case 404:
            toast.error('Başvuru veya belge gereksinimi bulunamadı.');
            break;
          case 413:
            toast.error('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsiniz.');
            break;
          case 415:
            toast.error('Desteklenmeyen dosya formatı. Lütfen PDF, DOC, DOCX, JPG veya PNG yükleyin.');
            break;
          case 500:
            toast.error('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
            break;
          default:
            toast.error(`Belge yüklenirken hata oluştu (${status}): ${errorData?.message || error.message}`);
        }
      } else if (error.message && error.message.includes('backend\'de tanımlanmamış')) {
        toast.error(
          'Backend document upload endpoint\'i henüz hazır değil. ' +
          'Lütfen backend ekibinden endpoint\'in hazırlanmasını bekleyiniz.',
          { duration: 6000 }
        );
      } else {
        toast.error('Belge yüklenirken bir hata oluştu: ' + (error.message || 'Bilinmeyen hata'));
      }
    } finally {
      setUploadingDocuments(prev => {
        const newSet = new Set(prev);
        newSet.delete(uploadKey);
        return newSet;
      });
    }
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Staj Başvurularım</h2>
            <Link to="/student/internship-application">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Yeni Başvuru
              </button>
            </Link>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Başvuru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Başvurularınız yükleniyor...</span>
            </div>
          )}

          {/* Başvuru Listesi */}
          {!isLoading && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Türü</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Başlangıç Tarihi</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                    <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {searchTerm ? 'Arama kriterlerinize uygun başvuru bulunamadı.' : 'Henüz başvuru yapmamışsınız.'}
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
                      <tr key={application.id} className="border-b border-gray-200">
                        <td className="px-4 py-3 text-sm text-gray-700">{application.companyName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{application.internshipName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {new Date(application.appliedDate).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                              statusConfig[application.status]?.color || 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {statusConfig[application.status]?.label || application.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm flex gap-2">
                          <button
                            className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600"
                            onClick={() => openDetailsModal(application)}
                          >
                            Detay
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detay Modalı - YENİ API İLE */}
        {showDetailsModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-[#13126e] to-[#1f1e7e]">
                <div className="flex items-center gap-3">
                  <KeenIcon icon="briefcase" className="text-white text-2xl" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Staj Başvurusu Detayı</h3>
                    <p className="text-blue-100 text-sm">{selectedApplication.companyName}</p>
                  </div>
                </div>
                <button className="text-white hover:text-blue-200 transition-colors" onClick={closeModal}>
                  <KeenIcon icon="cross" className="text-2xl" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-6">
                  {/* Başvuru Durumu */}
                  <div>
                    <h4 className="text-md font-medium mb-2">Başvuru Durumu</h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex flex-col gap-2">
                        <span
                          className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                            statusConfig[selectedApplication.status]?.color || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {statusConfig[selectedApplication.status]?.label || selectedApplication.status}
                        </span>
                        {statusConfig[selectedApplication.status]?.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {statusConfig[selectedApplication.status].description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Genel Bilgiler */}
                  <div>
                    <h4 className="text-md font-medium mb-2">Genel Bilgiler</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Staj Adı</p>
                        <p>{selectedApplication.internshipName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Şirket</p>
                        <p>{selectedApplication.companyName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Başlangıç Tarihi</p>
                        <p>{selectedApplication.startDate ? new Date(selectedApplication.startDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bitiş Tarihi</p>
                        <p>{selectedApplication.endDate ? new Date(selectedApplication.endDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Staj Türü</p>
                        <p>{selectedApplication.type === 'VOLUNTARY' ? 'Gönüllü' : 'Zorunlu'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sağlık Sigortası</p>
                        <p>{selectedApplication.hasGeneralHealthInsurance ? 'Var' : 'Yok'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Öğrenci Bilgileri */}
                  <div>
                    <h4 className="text-md font-medium mb-2">Öğrenci Bilgileri</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
                        <p>{selectedApplication.studentName} {selectedApplication.studentSurname}</p>
                      </div>
                    </div>
                  </div>

                  {/* Document Requirements */}
                  {documentDisplayData.documentsToShow.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <KeenIcon icon="folder" className="text-[#13126e] text-xl" />
                        <h4 className="text-lg font-semibold text-gray-900">
                          Belge Gereksinimleri
                          {documentDisplayData.shouldShowSubmissionDocuments && documentDisplayData.submissionDocuments.length > 0 && (
                            <span className="text-sm text-orange-600 ml-2 bg-orange-100 px-2 py-1 rounded-full">
                              📖 {documentDisplayData.submissionDocuments.length} staj defteri belgesi dahil
                            </span>
                          )}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {documentDisplayData.documentsToShow.map((requirement) => (
                          <div key={requirement.id} className="bg-white border-2 border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`p-2 rounded-xl ${
                                  requirement.submissionType === 'SUBMISSION' 
                                    ? 'bg-orange-100' 
                                    : 'bg-[#13126e]/10'
                                }`}>
                                  <KeenIcon 
                                    icon={requirement.submissionType === 'SUBMISSION' ? 'notebook' : 'document'} 
                                    className={`text-lg ${
                                      requirement.submissionType === 'SUBMISSION' 
                                        ? 'text-orange-600' 
                                        : 'text-[#13126e]'
                                    }`} 
                                  />
                                </div>
                                <div>
                                  <h5 className="font-semibold text-gray-900">{requirement.name}</h5>
                                  {requirement.submissionType === 'SUBMISSION' && (
                                    <div className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full w-fit mt-1">
                                      📖 Staj Defteri Belgesi
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  requirement.status === 'APPROVED'
                                    ? 'bg-green-100 text-green-800'
                                    : requirement.status === 'DENIED'
                                    ? 'bg-red-100 text-red-800'
                                    : requirement.status === 'WAITING_FOR_UPLOAD'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : requirement.status === 'WAITING_FOR_APPROVAL'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {requirement.status === 'WAITING_FOR_UPLOAD' ? '📤 Belge Yükleme Bekleniyor' :
                                 requirement.status === 'WAITING_FOR_APPROVAL' ? '⏳ İnceleme Bekleniyor' :
                                 requirement.status === 'APPROVED' ? '✅ Onaylandı' :
                                 requirement.status === 'DENIED' ? '❌ Yeniden Yükleme Gerekli' : requirement.status}
                              </span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{requirement.description}</p>
                            
                            {/* Upload Section */}
                            <div className="border-t border-gray-100 pt-4">
                              <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium text-gray-700">
                                  📤 Belge Yükle:
                                </label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        handleDocumentUpload(requirement.id, file);
                                      }
                                    }}
                                    className="flex-1 text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-[#13126e] file:text-white hover:file:bg-[#1f1e7e] file:transition-colors file:cursor-pointer"
                                    disabled={uploadingDocuments.has(`${selectedApplication.id}-${requirement.id}`)}
                                  />
                                  {uploadingDocuments.has(`${selectedApplication.id}-${requirement.id}`) && (
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500"></div>
                                      Yükleniyor...
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Uploaded Documents */}
                              {requirement.documents && requirement.documents.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-100">
                                  <p className="text-sm font-medium text-gray-700 mb-2">📋 Yüklenen Belgeler:</p>
                                  <div className="space-y-2">
                                    {requirement.documents.map((doc: any) => (
                                      <div key={doc.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                                        <KeenIcon icon="document" className="text-blue-600" />
                                        <span className="text-sm text-blue-800 font-medium">{doc.fileName}</span>
                                        <div className="ml-auto">
                                          <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                            Yüklendi
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* İlgili Konular (Topics) */}
                  {selectedApplication && 
                   (selectedApplication.rules || selectedApplication.requirements || [])
                     .filter(req => req.type === 'TOPIC' || req.ruleType === 'TOPIC')
                     .length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <KeenIcon icon="star" className="text-blue-600 text-xl" />
                        <h4 className="text-lg font-semibold text-gray-900">İlgili Konular</h4>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {(selectedApplication.rules || selectedApplication.requirements || [])
                            .filter(req => req.type === 'TOPIC' || req.ruleType === 'TOPIC').length} konu
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200">
                        <div className="space-y-4">
                          {(selectedApplication.rules || selectedApplication.requirements || [])
                            .filter(req => req.type === 'TOPIC' || req.ruleType === 'TOPIC')
                            .map((requirement, index) => (
                            <div key={requirement.id} className="flex gap-4">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h5 className="font-semibold text-blue-900">{requirement.name}</h5>

                                </div>
                                <div className="text-sm text-blue-800 leading-relaxed mb-3">
                                  <TopicDescriptionRenderer description={requirement.description} />
                                </div>
                                <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded-lg">
                                  💡 Bu konu başlığı ile ilgili herhangi bir belge yüklemenize gerek yoktur.
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
                              console.log(`💬 Render edilen mesaj ${index}:`, {
                                fromUserId: comment.fromUserId,
                                studentId: selectedApplication?.studentId,
                                fromUserName: comment.fromUserName,
                                comment: comment.comment
                              });
                              
                              // Öğrenci olarak bakarken: ben yazdıysam sağda, komisyon yazdıysa solda
                              const isMyMessage = comment.fromUserId === selectedApplication?.studentId;
                              
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
                                      icon={isMyMessage ? 'user' : 'teacher'} 
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
                </div>
              </div>

              {/* Modal Footer */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Başvuru Tarihi:</span> {new Date(selectedApplication.appliedDate).toLocaleDateString('tr-TR')}
                  </div>
                  <button
                    className="btn bg-gradient-to-r from-[#13126e] to-[#1f1e7e] text-white py-2 px-6 rounded-lg hover:from-[#1f1e7e] hover:to-[#13126e] transition-all duration-200 font-medium"
                    onClick={closeModal}
                  >
                    <KeenIcon icon="cross" className="mr-2" />
                    Kapat
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export default MyApplicationsPage; 