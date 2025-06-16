import React from 'react';
import { KeenIcon } from '@/components/keenicons';
import { InternshipApplicationDetail, InternshipRequirement } from '@/services/internshipService';

interface InternshipApplication {
  id: string;
  studentName: string;
  studentSurname: string;
  internshipName: string;
  companyName: string;
  status: string;
  appliedDate: string;
}

interface InternshipDetailsModalProps {
  open: boolean;
  onClose: () => void;
  application: InternshipApplication | null;
  detail: InternshipApplicationDetail | null;
  loading: boolean;
}

const InternshipDetailsModal: React.FC<InternshipDetailsModalProps> = ({
  open,
  onClose,
  application,
  detail,
  loading
}) => {
  if (!open) return null;

  // Sadece DOCUMENT tipindeki gereksinimleri filtrele
  const documentRequirements = detail?.requirements.filter(req => req.ruleType === 'DOCUMENT') || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'PENDING':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'WAITING_FOR_UPLOAD':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'ASSIGNED':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return '✅ Tamamlandı';
      case 'PENDING':
        return '⏳ Beklemede';
      case 'REJECTED':
        return '❌ Reddedildi';
      case 'WAITING_FOR_UPLOAD':
        return '📄 Yükleme Bekleniyor';
      case 'ASSIGNED':
        return '👤 Atandı';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'check-circle';
      case 'PENDING':
        return 'time';
      case 'REJECTED':
        return 'cross-circle';
      case 'WAITING_FOR_UPLOAD':
        return 'cloud-add';
      case 'ASSIGNED':
        return 'user';
      default:
        return 'information-2';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
                                  <KeenIcon icon="document" className="text-[#13126e] text-lg" />
                                </div>
                                <h5 className="font-bold text-gray-900 text-lg">{requirement.name}</h5>
                              </div>
                              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${getStatusBadge(requirement.status)}`}>
                                <KeenIcon icon={getStatusIcon(requirement.status)} className="text-sm" />
                                {getStatusText(requirement.status)}
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
                                  {requirement.documents.map((document) => (
                                    <div key={document.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                                      <div className="p-2 bg-green-100 rounded-lg">
                                        <KeenIcon icon="document" className="text-green-600 text-sm" />
                                      </div>
                                      <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900">{document.fileName}</span>
                                        <div className="text-xs text-gray-500 mt-1">{document.documentType}</div>
                                      </div>
                                      <div className="p-1 bg-green-100 rounded-full">
                                        <KeenIcon icon="check" className="text-green-600 text-xs" />
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
    </div>
  );
};

export default InternshipDetailsModal; 