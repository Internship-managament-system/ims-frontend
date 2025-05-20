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

// Pagination için gerekli arayüz
interface Pagination {
  currentPage: number;
  perPage: number;
  totalPages: number;
}

const InternshipDetails: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  
  // Pagination durumu
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    perPage: 5,
    totalPages: 1
  });
  
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
    // Test için daha fazla örnek veri
    {
      id: 5,
      studentName: "Ali Veli",
      studentId: "20190101090",
      company: "Tech Solutions Inc.",
      startDate: "2024-06-01",
      endDate: "2024-07-15",
      status: 'approved',
      reviewerName: "Prof. Dr. Ali Demir",
      points: 0,
      rejectionReason: null,
      notebookUrl: "/documents/staj-defterleri/20190101090.pdf",
    },
    {
      id: 6,
      studentName: "Fatma Yılmaz",
      studentId: "20190101091",
      company: "ABC Teknoloji A.Ş.",
      startDate: "2024-07-01",
      endDate: "2024-08-15",
      status: 'partially',
      reviewerName: "Dr. Mehmet Kaya",
      points: 3,
      rejectionReason: "Staj içeriği yetersiz",
      notebookUrl: "/documents/staj-defterleri/20190101091.pdf",
    },
    {
      id: 7,
      studentName: "Can Demir",
      studentId: "20190101092",
      company: "Yazılım Ltd.",
      startDate: "2024-06-15",
      endDate: "2024-07-30",
      status: 'rejected',
      reviewerName: "Prof. Dr. Ayşe Yıldız",
      points: 8,
      rejectionReason: "Staj yeri uygun değil",
      notebookUrl: "/documents/staj-defterleri/20190101092.pdf",
    },
    {
      id: 8,
      studentName: "Deniz Aydın",
      studentId: "20190101093",
      company: "Bilişim Sistemleri A.Ş.",
      startDate: "2024-08-01",
      endDate: "2024-09-01",
      status: 'pending',
      reviewerName: null,
      points: 0,
      rejectionReason: null,
      notebookUrl: null,
    },
    {
      id: 9,
      studentName: "Ece Kara",
      studentId: "20190101094",
      company: "Tech Innovations LLC",
      startDate: "2024-07-15",
      endDate: "2024-08-15",
      status: 'approved',
      reviewerName: "Prof. Dr. Ali Demir",
      points: 1,
      rejectionReason: null,
      notebookUrl: "/documents/staj-defterleri/20190101094.pdf",
    },
    {
      id: 10,
      studentName: "Burak Şahin",
      studentId: "20190101095",
      company: "Software Solutions",
      startDate: "2024-06-01",
      endDate: "2024-07-15",
      status: 'partially',
      reviewerName: "Dr. Mehmet Kaya",
      points: 5,
      rejectionReason: "Bazı günler eksik",
      notebookUrl: "/documents/staj-defterleri/20190101095.pdf",
    },
    {
      id: 11,
      studentName: "Melis Yıldız",
      studentId: "20190101096",
      company: "Data Corp.",
      startDate: "2024-07-01",
      endDate: "2024-08-01",
      status: 'rejected',
      reviewerName: "Prof. Dr. Ayşe Yıldız",
      points: 10,
      rejectionReason: "Staj içeriği ve raporlama yetersiz",
      notebookUrl: "/documents/staj-defterleri/20190101096.pdf",
    },
    {
      id: 12,
      studentName: "Onur Kılıç",
      studentId: "20190101097",
      company: "Web Technologies",
      startDate: "2024-08-15",
      endDate: "2024-09-15",
      status: 'pending',
      reviewerName: null,
      points: 0,
      rejectionReason: null,
      notebookUrl: null,
    },
  ];
  
  // Arama ve filtreleme işlemi
  const filteredInternships = internships.filter(internship => 
    internship.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    internship.company.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toplam sayfa sayısını hesapla
  const totalPages = Math.ceil(filteredInternships.length / pagination.perPage);
  
  // Sayfalanmış veri
  const paginatedInternships = filteredInternships.slice(
    (pagination.currentPage - 1) * pagination.perPage,
    pagination.currentPage * pagination.perPage
  );
  
  // Sayfa değiştirme işlemi
  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      currentPage: page
    });
  };
  
  // Her sayfada gösterilecek öğe sayısını değiştirme
  const handlePerPageChange = (perPage: number) => {
    setPagination({
      ...pagination,
      perPage,
      currentPage: 1 // Sayfa sayısı değiştiğinde ilk sayfaya dön
    });
  };
  
  // Durum badge'i
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
  
  // Tarihi formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };
  
  // Sayfalama için sayfa numaralarını oluştur
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // En fazla gösterilecek buton sayısı
    
    // Önceki sayfa butonu
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
        disabled={pagination.currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          pagination.currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-[#13126e] hover:bg-[#13126e] hover:text-white'
        }`}
      >
        <KeenIcon icon="arrow-left" className="size-4" />
      </button>
    );
    
    // Sayfa numaralarını ekle
    if (totalPages <= maxButtons) {
      // Toplam sayfa sayısı az ise tüm sayfaları göster
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md ${
              pagination.currentPage === i
                ? 'bg-[#13126e] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Sayfa sayısı çok ise akıllı sayfalama göster
      let startPage = Math.max(1, pagination.currentPage - Math.floor(maxButtons / 2));
      let endPage = Math.min(totalPages, startPage + maxButtons - 1);
      
      // Başta veya sonda çok fazla sayfa gösterilmiyorsa düzelt
      if (endPage - startPage + 1 < maxButtons) {
        startPage = Math.max(1, endPage - maxButtons + 1);
      }
      
      // İlk sayfa
      if (startPage > 1) {
        buttons.push(
          <button
            key={1}
            onClick={() => handlePageChange(1)}
            className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
          >
            1
          </button>
        );
        
        // Ara boşluk
        if (startPage > 2) {
          buttons.push(
            <span key="ellipsis1" className="px-3 py-1">
              ...
            </span>
          );
        }
      }
      
      // Ortadaki sayfa numaraları
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={`px-3 py-1 rounded-md ${
              pagination.currentPage === i
                ? 'bg-[#13126e] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {i}
          </button>
        );
      }
      
      // Son sayfa
      if (endPage < totalPages) {
        // Ara boşluk
        if (endPage < totalPages - 1) {
          buttons.push(
            <span key="ellipsis2" className="px-3 py-1">
              ...
            </span>
          );
        }
        
        buttons.push(
          <button
            key={totalPages}
            onClick={() => handlePageChange(totalPages)}
            className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {totalPages}
          </button>
        );
      }
    }
    
    // Sonraki sayfa butonu
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(totalPages, pagination.currentPage + 1))}
        disabled={pagination.currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          pagination.currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-[#13126e] hover:bg-[#13126e] hover:text-white'
        }`}
      >
        <KeenIcon icon="arrow-right" className="size-4" />
      </button>
    );
    
    return buttons;
  };

  // Modal bileşeni - Staj detaylarını gösterecek
  const InternshipDetailsModal = ({ internship, onClose }: { internship: Internship, onClose: () => void }) => {
    if (!internship) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">
              Staj Detayları - {internship.studentName}
            </h3>
            <button 
              className="text-gray-400 hover:text-gray-600 p-2"
              onClick={onClose}
            >
              <KeenIcon icon="cross" className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Öğrenci Bilgileri
                </h4>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Ad Soyad</span>
                    <span className="font-medium text-gray-900">{internship.studentName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Öğrenci No</span>
                    <span className="font-medium text-gray-900">{internship.studentId}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Şirket</span>
                    <span className="font-medium text-gray-900">{internship.company}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Staj Tarihleri</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(internship.startDate)} - {formatDate(internship.endDate)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  Değerlendirme Bilgileri
                </h4>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Durum</span>
                    <div className="mt-1">{getStatusBadge(internship.status)}</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Değerlendiren</span>
                    <span className="font-medium text-gray-900">
                      {internship.reviewerName || 'Henüz atanmadı'}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-500">Eksiklik Puanı</span>
                    <span className={`font-medium ${
                      internship.points > 0 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {internship.points}
                    </span>
                  </div>
                  
                  {internship.rejectionReason && (
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Red/Kabul Gerekçesi</span>
                      <span className="font-medium text-red-600 p-2 bg-red-50 rounded mt-1">
                        {internship.rejectionReason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Dökümanlar
              </h4>
              <div className="flex flex-wrap gap-2">
                {internship.notebookUrl ? (
                  <a 
                    href={internship.notebookUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors border border-blue-200"
                  >
                    <KeenIcon icon="document" className="h-5 w-5" />
                    <span>Staj Defteri</span>
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-md border border-gray-200">
                    <KeenIcon icon="document" className="h-5 w-5" />
                    <span>Defter Yüklenmemiş</span>
                  </div>
                )}
                
                {/* Diğer dökümanlar burada listelenebilir */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-md border border-gray-200">
                  <KeenIcon icon="folder" className="h-5 w-5" />
                  <span>Diğer Belgeler</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 mt-6 pt-4 border-t border-gray-200">
              <div className="md:flex-1">
                <button className="w-full btn bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200">
                  <KeenIcon icon="printer" className="mr-2" />
                  Yazdır
                </button>
              </div>
              <div className="md:flex-1">
                <button className="w-full btn bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                  <KeenIcon icon="note" className="mr-2" />
                  Not Ekle
                </button>
              </div>
              <div className="md:flex-1">
                <button className="w-full btn bg-[#13126e] text-white px-4 py-2 rounded hover:opacity-90">
                  <KeenIcon icon="eye" className="mr-2" />
                  Tüm Detayları Görüntüle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination({ ...pagination, currentPage: 1 }); // Aramada ilk sayfaya dön
                }}
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
                {paginatedInternships.map((internship) => (
                  <tr key={internship.id} className="border-b border-gray-200 hover:bg-gray-50">
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
                        className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded hover:bg-blue-600 transition-colors"
                        onClick={() => setSelectedInternship(internship)}
                      >
                        <KeenIcon icon="eye" className="mr-1" />
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
          
          {/* Pagination */}
          {filteredInternships.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
              <div className="flex items-center text-sm text-gray-500">
                <span>
                  Toplam {filteredInternships.length} kayıttan{' '}
                  {(pagination.currentPage - 1) * pagination.perPage + 1}-
                  {Math.min(pagination.currentPage * pagination.perPage, filteredInternships.length)}{' '}
                  arası gösteriliyor
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-4">
                  <span className="text-sm text-gray-500">Sayfa başına:</span>
                  <select
                    className="border border-gray-300 rounded p-1 text-sm"
                    value={pagination.perPage}
                    onChange={(e) => handlePerPageChange(Number(e.target.value))}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  {renderPaginationButtons()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Seçilen staj detayları */}
      {selectedInternship && (
        <InternshipDetailsModal
          internship={selectedInternship}
          onClose={() => setSelectedInternship(null)}
        />
      )}
    </Container>
  );
};

export default InternshipDetails;