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

const InternshipAnnouncements: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);

  const allNews: NewsItem[] = [
    {
      id: 1,
      title: "2024 Bahar Dönemi Staj Başvuruları",
      summary: "2024 Bahar dönemi staj başvuruları 15 Şubat'ta başlayacaktır...",
      date: "2024-02-15",
      category: "internship",
      content: "2024 Bahar dönemi staj başvuruları 15 Şubat 2024 tarihinde başlayacaktır. Başvuru süreci 28 Şubat 2024 tarihine kadar devam edecektir."
    },
    {
      id: 3,
      title: "Staj Değerlendirme Kriterleri",
      summary: "Staj değerlendirme kriterleri ve puanlama sistemi açıklandı...",
      date: "2024-02-08",
      category: "internship",
      content: "Staj değerlendirme kriterleri ve puanlama sistemi yeniden düzenlenmiştir. Yeni kriterler hakkında detaylı bilgi için duyuru metnini okuyunuz."
    },
    {
      id: 5,
      title: "Online Staj Sunumları",
      summary: "Staj sunumları online olarak gerçekleştirilecektir...",
      date: "2024-02-02",
      category: "internship",
      content: "Bu dönem staj sunumları online olarak gerçekleştirilecektir. Sunum tarihleri ve detayları yakında duyurulacaktır."
    },
    {
      id: 9,
      title: "Staj Defteri Teslim Tarihleri",
      summary: "Staj defterlerinin teslim tarihleri ve şekli hakkında duyuru...",
      date: "2024-02-01",
      category: "internship",
      content: "Staj defterlerinin teslim edilme tarihi ve şekli hakkında önemli bilgiler duyurulmuştur."
    },
    {
      id: 10,
      title: "Staj Yeri Değişiklik İşlemleri",
      summary: "Staj yeri değişiklik başvuruları için son tarih açıklandı...",
      date: "2024-01-29",
      category: "internship",
      content: "Staj yeri değişiklik başvuruları için belirlenen son tarih ve gerekli işlemler duyurulmuştur."
    },
    {
      id: 11,
      title: "Zorunlu Staj Dönemi Uyarıları",
      summary: "Zorunlu staj dönemi ile ilgili önemli uyarılar ve kurallar...",
      date: "2024-01-26",
      category: "internship",
      content: "Zorunlu staj dönemi ile ilgili önemli uyarılar ve uyulması gereken kurallar açıklanmıştır."
    }
  ];

  // Sadece staj duyurularını filtrele
  const internshipNews = allNews.filter(news => news.category === 'internship');

  const handleDateFilter = () => {
    if (!startDate && !endDate) {
      setFilteredNews([]);
      setIsFiltered(false);
      return;
    }

    const filtered = internshipNews.filter(news => {
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

  const displayNews = isFiltered ? filteredNews : internshipNews;

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader />
      
      {/* Hero Section */}
      <div 
        className="relative h-[700px] min-h-[500px] bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/media/eru/duyurularfoto3.jpg')"
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold drop-shadow-lg">
              STAJ DUYURULARI
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
                  <KeenIcon icon="briefcase" className="text-gray-600 text-sm" />
                  <span className="text-gray-700 font-medium">Staj Duyuruları</span>
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
                {isFiltered ? 'Belirtilen tarih aralığında duyuru bulunamadı' : 'Henüz staj duyurusu bulunmuyor'}
              </h3>
              <p className="text-gray-500">
                {isFiltered ? 'Farklı tarih aralığı seçerek tekrar deneyebilirsiniz.' : 'Staj duyurusu bulunamadı.'}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default InternshipAnnouncements; 