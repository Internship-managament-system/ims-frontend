import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface Application {
  id: string;
  companyName: string;
  internshipType: 'SOFTWARE' | 'HARDWARE';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applicationDate: string;
  startDate: string;
  endDate: string;
}

export default function Applications() {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = React.useState<Application | null>(null);

  // Mock data - daha detaylı
  const mockApplications: Application[] = [
    {
      id: '1',
      companyName: 'ABC Teknoloji A.Ş.',
      internshipType: 'SOFTWARE',
      status: 'PENDING',
      applicationDate: '2024-01-15',
      startDate: '2024-06-01',
      endDate: '2024-07-30'
    },
    {
      id: '2',
      companyName: 'XYZ Bilişim Ltd.',
      internshipType: 'SOFTWARE',
      status: 'APPROVED',
      applicationDate: '2024-01-10',
      startDate: '2024-05-15',
      endDate: '2024-07-15'
    },
    {
      id: '3',
      companyName: 'DEF Yazılım A.Ş.',
      internshipType: 'HARDWARE',
      status: 'REJECTED',
      applicationDate: '2024-01-05',
      startDate: '2024-05-01',
      endDate: '2024-06-30'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'APPROVED':
        return 'Onaylandı';
      case 'REJECTED':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
  };

  return (
    <Container>
      <div className="flex flex-col gap-5 lg:gap-7.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold text-gray-900">Yapılan Başvurular</h1>
            <p className="text-sm text-gray-600">
              Staj başvurularınızı görüntüleyin ve durumlarını takip edin.
            </p>
          </div>
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <KeenIcon icon="arrow-left" className="text-sm" />
            Geri Dön
          </button>
        </div>

        {/* Applications List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6">
            <div className="space-y-4">
              {mockApplications.map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{app.companyName}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                          {getStatusText(app.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{app.internshipType === 'SOFTWARE' ? 'Yazılım' : 'Donanım'}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        <span>Başvuru: {new Date(app.applicationDate).toLocaleDateString('tr-TR')}</span>
                        <span>Başlangıç: {new Date(app.startDate).toLocaleDateString('tr-TR')}</span>
                        <span>Bitiş: {new Date(app.endDate).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(app)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-[#13126e] hover:bg-[#13126e] hover:text-white border border-[#13126e] rounded transition-colors"
                    >
                      <KeenIcon icon="eye" className="text-xs" />
                      Detay
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {mockApplications.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 mb-2">
                  <KeenIcon icon="document" className="text-4xl mx-auto" />
                </div>
                <p className="text-gray-500">Henüz başvuru yapılmamış.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Başvuru Detayları</h2>
                <button 
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <KeenIcon icon="cross" className="text-xl" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Şirket Bilgileri</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Şirket:</span> {selectedApplication.companyName}</p>
                    <p><span className="font-medium">Staj Türü:</span> {selectedApplication.internshipType === 'SOFTWARE' ? 'Yazılım' : 'Donanım'}</p>
                    <p><span className="font-medium">Durum:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApplication.status)}`}>
                        {getStatusText(selectedApplication.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Tarih Bilgileri</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <p><span className="font-medium">Başvuru Tarihi:</span> {new Date(selectedApplication.applicationDate).toLocaleDateString('tr-TR')}</p>
                    <p><span className="font-medium">Staj Başlangıç:</span> {new Date(selectedApplication.startDate).toLocaleDateString('tr-TR')}</p>
                    <p><span className="font-medium">Staj Bitiş:</span> {new Date(selectedApplication.endDate).toLocaleDateString('tr-TR')}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
} 