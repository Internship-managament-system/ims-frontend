import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getInternshipApplicationDetailById, InternshipApplicationDetail } from '@/services/internshipService';
import { KeenIcon } from '@/components/keenicons';

const InternshipDetailPopup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const applicationId = searchParams.get('id');

  // Detay verilerini getir
  const { data: applicationDetail, isLoading, error } = useQuery({
    queryKey: ['internship-application-detail', applicationId],
    queryFn: () => getInternshipApplicationDetailById(applicationId!),
    enabled: !!applicationId,
  });

  // Sadece Document türündeki gereksinimleri filtrele
  const documentRequirements = applicationDetail?.requirements?.filter(req => req.ruleType === 'DOCUMENT') || [];

  // Durum rengini belirle
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_UPLOAD':
        return 'bg-yellow-100 text-yellow-800';
      case 'WAITING_FOR_APPROVAL':
        return 'bg-blue-100 text-blue-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Durum metnini belirle
  const getStatusText = (status: string) => {
    switch (status) {
      case 'WAITING_FOR_UPLOAD':
        return '📄 Yükleme Bekleniyor';
      case 'WAITING_FOR_APPROVAL':
        return '⏳ Onay Bekleniyor';
      case 'APPROVED':
        return '✅ Onaylandı';
      case 'REJECTED':
        return '❌ Reddedildi';
      default:
        return status;
    }
  };

  useEffect(() => {
    document.title = 'Staj Başvuru Detayları';
  }, []);

  if (!applicationId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <KeenIcon icon="information-2" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Geçersiz Başvuru</h1>
          <p className="text-gray-600">Başvuru ID parametresi bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Başlık */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Staj Başvuru Detayları</h1>
              <p className="text-gray-600 mt-1">Başvuru belgelerini inceleyin</p>
            </div>
            <button
              onClick={() => window.close()}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Pencereyi Kapat"
            >
              <KeenIcon icon="cross" className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13126e]"></div>
              <span className="ml-3 text-gray-600">Detaylar yükleniyor...</span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <KeenIcon icon="information-2" className="w-16 h-16 mx-auto mb-4 text-red-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Hata Oluştu</h2>
              <p className="text-red-600">Başvuru detayları yüklenirken bir hata oluştu.</p>
            </div>
          </div>
        ) : applicationDetail ? (
          <div className="space-y-6">
            {/* Genel Bilgiler */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Genel Bilgiler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Öğrenci:</span>
                  <p className="text-gray-900 font-medium">{applicationDetail.studentName} {applicationDetail.studentSurname}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Şirket:</span>
                  <p className="text-gray-900 font-medium">{applicationDetail.companyName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Staj Türü:</span>
                  <p className="text-gray-900 font-medium">{applicationDetail.internshipName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Başlangıç Tarihi:</span>
                  <p className="text-gray-900 font-medium">
                    {new Date(applicationDetail.startDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Bitiş Tarihi:</span>
                  <p className="text-gray-900 font-medium">
                    {new Date(applicationDetail.endDate).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Durum:</span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(applicationDetail.status)}`}>
                    {getStatusText(applicationDetail.status)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">Tip:</span>
                  <p className="text-gray-900 font-medium">
                    {applicationDetail.type === 'VOLUNTARY' ? 'Gönüllü' : 'Zorunlu'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-1">SGK Kapsamı:</span>
                  <p className="text-gray-900 font-medium">
                    {applicationDetail.hasGeneralHealthInsurance ? 'Evet' : 'Hayır'}
                  </p>
                </div>
              </div>
            </div>

            {/* Belgeler */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Gerekli Belgeler ({documentRequirements.length} belge)
              </h2>
              
              {documentRequirements.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <KeenIcon icon="document" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg">Bu başvuru için belge gereksinimi bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {documentRequirements.map((requirement, index) => (
                    <div key={requirement.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {index + 1}. {requirement.name}
                          </h3>
                          <div 
                            className="text-gray-600 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: requirement.description }} 
                          />
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(requirement.status)} ml-4`}>
                          {getStatusText(requirement.status)}
                        </span>
                      </div>
                      
                      {/* Yüklenen Belgeler */}
                      {requirement.documents && requirement.documents.length > 0 ? (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-3">Yüklenen Belgeler:</h4>
                          <div className="space-y-2">
                            {requirement.documents.map((document) => (
                              <div key={document.id} className="flex items-center p-3 bg-white rounded border border-gray-200">
                                <KeenIcon icon="document" className="w-5 h-5 text-gray-400 mr-3" />
                                <div className="flex-1">
                                  <span className="text-gray-900 font-medium">{document.fileName}</span>
                                  {document.description && (
                                    <p className="text-sm text-gray-500 mt-1">{document.description}</p>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                  {document.documentType}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center">
                            <KeenIcon icon="information" className="w-5 h-5 text-yellow-600 mr-2" />
                            <span className="text-yellow-800 font-medium">
                              Henüz belge yüklenmemiş
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-center">
              <KeenIcon icon="information-2" className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Başvuru Bulunamadı</h2>
              <p className="text-gray-600">Belirtilen ID'ye sahip başvuru detayları bulunamadı.</p>
            </div>
          </div>
        )}

        {/* Pencereyi Kapat Butonu */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.close()}
            className="btn bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <KeenIcon icon="cross" className="w-4 h-4 mr-2" />
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetailPopup; 