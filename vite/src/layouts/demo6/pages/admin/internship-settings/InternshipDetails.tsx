// /src/layouts/demo6/pages/admin/internship-settings/InternshipDetails.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface Internship {
  id: number;
  studentName: string;
  studentId: string;
  company: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'rejected' | 'partially' | 'pending';
  reviewerName: string | null;
  points: number;
  rejectionReason: string | null;
  notebookUrl: string | null;
}

const InternshipDetails: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  
  // Sample data for demonstration
  const internships: Internship[] = [
    {
      id: 1,
      studentName: "Ahmet Yılmaz",
      studentId: "20190101023",
      company: "ABC Teknoloji A.Ş.",
      startDate: "2024-06-15",
      endDate: "2024-07-15",
      status: 'approved',
      reviewerName: "Prof. Dr. Ali Demir",
      points: 0,
      rejectionReason: null,
      notebookUrl: "/documents/staj-defterleri/20190101023.pdf",
    },
    {
      id: 2,
      studentName: "Ayşe Demir",
      studentId: "20190101045",
      company: "XYZ Yazılım Ltd.",
      startDate: "2024-06-01",
      endDate: "2024-07-15",
      status: 'partially',
      reviewerName: "Dr. Mehmet Kaya",
      points: 4,
      rejectionReason: "Staj defteri formatı uygun değil, bazı bölümler eksik",
      notebookUrl: "/documents/staj-defterleri/20190101045.pdf",
    },
    {
      id: 3,
      studentName: "Mehmet Öz",
      studentId: "20190101067",
      company: "Tech Solutions Inc.",
      startDate: "2024-07-01",
      endDate: "2024-08-15",
      status: 'rejected',
      reviewerName: "Prof. Dr. Ayşe Yıldız",
      points: 12,
      rejectionReason: "Yetersiz içerik, eksik günler, staj yeri uygun değil",
      notebookUrl: "/documents/staj-defterleri/20190101067.pdf",
    },
    {
      id: 4,
      studentName: "Zeynep Kaya",
      studentId: "20190101089",
      company: "Bilişim Sistemleri A.Ş.",
      startDate: "2024-08-01",
      endDate: "2024-09-15",
      status: 'pending',
      reviewerName: null,
      points: 0,
      rejectionReason: null,
      notebookUrl: null,
    },
  ];
  
  const filteredInternships = internships.filter(internship => 
    internship.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: Internship['status']) => {
    switch (status) {
      case 'approved':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Onaylandı</span>;
      case 'rejected':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Reddedildi</span>;
      case 'partially':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Kısmen Kabul</span>;
      case 'pending':
        return <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">Beklemede</span>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Staj Detayları</h2>
          
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeenIcon icon="search" className="text-gray-400" />
              </div>
              <input 
                type="text" 
                className="border border-gray-300 rounded-md p-2 pl-10 w-full"
                placeholder="Öğrenci adı, öğrenci numarası veya şirkete göre ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mb-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-500">Tarih</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((internship) => (
                  <tr key={internship.id} className="border-b border-gray-200">
                    <td className="px-4 py-3 text-sm text-gray-700">{internship.studentId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{internship.studentName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{internship.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {getStatusBadge(internship.status)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <button 
                        className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded"
                        onClick={() => setSelectedInternship(internship)}
                      >
                        Detaylar
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredInternships.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                      Aramanızla eşleşen staj bulunamadı.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {selectedInternship && (
            <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Staj Detayları - {selectedInternship.studentName}
                </h3>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => setSelectedInternship(null)}
                >
                  <KeenIcon icon="cross" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Öğrenci Bilgileri</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-xs text-gray-500">Ad Soyad</span>
                      <span className="font-medium">{selectedInternship.studentName}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Öğrenci No</span>
                      <span className="font-medium">{selectedInternship.studentId}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Şirket</span>
                      <span className="font-medium">{selectedInternship.company}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Staj Tarihleri</span>
                      <span className="font-medium">
                        {formatDate(selectedInternship.startDate)} - {formatDate(selectedInternship.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Değerlendirme Bilgileri</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="block text-xs text-gray-500">Durum</span>
                      <div className="font-medium">{getStatusBadge(selectedInternship.status)}</div>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Değerlendiren</span>
                      <span className="font-medium">
                        {selectedInternship.reviewerName || 'Henüz atanmadı'}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs text-gray-500">Eksiklik Puanı</span>
                      <span className={`font-medium ${
                        selectedInternship.points > 0 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {selectedInternship.points}
                      </span>
                    </div>
                    
                    {selectedInternship.rejectionReason && (
                      <div>
                        <span className="block text-xs text-gray-500">Red/Kabul Gerekçesi</span>
                        <span className="font-medium text-red-600">
                          {selectedInternship.rejectionReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Dökümanlar</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.notebookUrl ? (
                    <a 
                      href={selectedInternship.notebookUrl} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                    >
                      <KeenIcon icon="document" />
                      <span>Staj Defteri</span>
                    </a>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-500 rounded-md">
                      <KeenIcon icon="document" />
                      <span>Defter Yüklenmemiş</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button className="btn bg-blue-500 text-white px-4 py-2 rounded">
                  Tüm Detayları Görüntüle
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default InternshipDetails;