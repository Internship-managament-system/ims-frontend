import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LandingPageHeader from '../../components/LandingPageHeader/LandingPageHeader';
import Footer from '../../layouts/eru/Footer/Footer';
import { KeenIcon } from '../../components';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: 'general' | 'internship';
  content?: string;
}

const GeneralAnnouncements: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const allNews: NewsItem[] = [
    {
      id: 2,
      title: "Akademik Takvim Güncellendi",
      summary: "2023-2024 eğitim öğretim yılı akademik takvimi güncellendi...",
      date: "2024-02-10",
      category: "general",
      content: "2023-2024 eğitim öğretim yılı akademik takvimi güncellenmiştir. Detaylar için öğrenci işleri dairesine başvurabilirsiniz."
    },
    {
      id: 4,
      title: "Yeni Ders Kayıt Sistemi",
      summary: "Yeni ders kayıt sistemi devreye alındı...",
      date: "2024-02-05",
      category: "general",
      content: "Yeni ders kayıt sistemi devreye alınmıştır. Öğrenciler artık daha kolay şekilde ders kaydı yapabileceklerdir."
    },
    {
      id: 6,
      title: "Kütüphane Çalışma Saatleri",
      summary: "Kütüphane çalışma saatleri değişti...",
      date: "2024-01-30",
      category: "general",
      content: "Kütüphane çalışma saatleri güncellenmiştir. Yeni çalışma saatleri: Pazartesi-Cuma 08:00-22:00, Hafta sonu 09:00-18:00"
    },
    {
      id: 7,
      title: "Mezuniyet Töreni Duyurusu",
      summary: "2024 Bahar Dönemi mezuniyet töreni tarih ve detayları açıklandı...",
      date: "2024-01-28",
      category: "general",
      content: "2024 Bahar Dönemi mezuniyet töreni 15 Haziran 2024 tarihinde gerçekleştirilecektir."
    },
    {
      id: 8,
      title: "Öğrenci Konseyi Seçimleri",
      summary: "Öğrenci konseyi seçimleri için başvuru süreci başladı...",
      date: "2024-01-25",
      category: "general",
      content: "Öğrenci konseyi seçimleri için başvuru süreci 1 Şubat tarihinde başlayacaktır."
    },
    {
      id: 12,
      title: "Rektörlük Makam Duyurusu",
      summary: "Üniversitemiz Rektörlük makamından önemli açıklama yapıldı...",
      date: "2024-02-15",
      category: "general",
      content: "Üniversitemiz Rektörlük makamından yapılan açıklamada önemli kararlar duyurulmuştur."
    }
  ];

  // Sadece genel duyuruları filtrele
  const generalNews = allNews.filter(news => news.category === 'general');

  const handleDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredNews([]);
      setIsFiltered(false);
      return;
    }

    const filtered = generalNews.filter(news => {
      const newsDate = new Date(news.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && end) {
        return newsDate >= start && newsDate <= end;
      } else if (start) {
        return newsDate >= start;
      } else if (end) {
        return newsDate <= end;
      }
      return true;
    });

    setFilteredNews(filtered);
    setIsFiltered(true);
  };

  const clearFilter = () => {
    setStartDate('');
    setEndDate('');
    setFilteredNews([]);
    setIsFiltered(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const displayNews = isFiltered ? filteredNews : generalNews;

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader />
      
      {/* Hero Section */}
      <div 
        className="relative h-[700px] min-h-[500px] bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/media/eru/duyurularfoto2.jpg')"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold drop-shadow-lg">
              GENEL DUYURULAR
            </h1>
          </div>
        </div>
      </div>
      
      <main className="flex-1 bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-6">
            <nav className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <KeenIcon icon="home-2" className="text-blue-600 text-sm" />
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                  Ana Sayfa
                </Link>
              </div>
              
              <div className="flex items-center space-x-2">
                <KeenIcon icon="right" className="text-gray-400 text-xs" />
                <div className="flex items-center space-x-2">
                  <KeenIcon icon="notification" className="text-gray-600 text-sm" />
                  <span className="text-gray-700 font-medium">Genel Duyurular</span>
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Date Filter */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tarihe Göre Filtrele</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlangıç tarihi
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bitiş tarihi
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <button
                  onClick={handleDateFilter}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Listele
                </button>
              </div>
              {isFiltered && (
                <div>
                  <button
                    onClick={clearFilter}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Temizle
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* News List */}
          <div className="space-y-4">
            {displayNews.map((news) => (
              <div key={news.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm text-gray-500">{formatDate(news.date)}</span>
                      </div>
                      
                      <Link 
                        to={`/announcement/${news.id}`}
                        className="block group"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 mb-2">
                          {news.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {news.summary}
                        </p>
                      </Link>
                    </div>
                    
                    <Link 
                      to={`/announcement/${news.id}`}
                      className="ml-4 flex-shrink-0"
                    >
                      <KeenIcon 
                        icon="right" 
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {displayNews.length === 0 && (
            <div className="text-center py-12">
              <KeenIcon icon="note" className="text-gray-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {isFiltered ? 'Belirtilen tarih aralığında duyuru bulunamadı' : 'Henüz genel duyuru bulunmuyor'}
              </h3>
              <p className="text-gray-500">
                {isFiltered ? 'Farklı tarih aralığı seçerek tekrar deneyebilirsiniz.' : 'Genel duyuru bulunamadı.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GeneralAnnouncements;