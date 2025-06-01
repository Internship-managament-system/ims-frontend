import React from 'react';
import { Link, useParams } from 'react-router-dom';
import LandingPageHeader from '../../components/LandingPageHeader/LandingPageHeader';
import Footer from '../../layouts/eru/Footer/Footer';
import { KeenIcon } from '../../components';

interface NewsItem {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: 'general' | 'internship';
  content: string;
}

const AnnouncementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Örnek duyuru verileri (normalde API'den gelecek)
  const allNews: NewsItem[] = [
    {
      id: 1,
      title: "2024 Bahar Dönemi Staj Başvuruları",
      summary: "2024 Bahar dönemi staj başvuruları 15 Şubat'ta başlayacaktır...",
      date: "15 Şubat 2024",
      category: "internship",
      content: `
        <h3>2024 Bahar Dönemi Staj Başvuruları</h3>
        
        <p>Sayın Öğrenciler,</p>
        
        <p>2024 Bahar dönemi staj başvuruları <strong>15 Şubat 2024</strong> tarihinde başlayacaktır. Başvuru süreci <strong>28 Şubat 2024</strong> tarihine kadar devam edecektir.</p>
        
        <h4>Başvuru Koşulları:</h4>
        <ul>
          <li>En az 120 kredi tamamlamış olmak</li>
          <li>Genel not ortalaması en az 2.00 olmak</li>
          <li>Disiplin cezası bulunmamak</li>
          <li>Zorunlu derslerin tamamlanmış olması</li>
        </ul>
        
        <h4>Gerekli Belgeler:</h4>
        <ul>
          <li>Staj başvuru formu</li>
          <li>Transkript</li>
          <li>Staj yapılacak kurum onay belgesi</li>
          <li>Sigorta belgesi</li>
        </ul>
        
        <h4>Önemli Tarihler:</h4>
        <ul>
          <li><strong>Başvuru Başlangıç:</strong> 15 Şubat 2024</li>
          <li><strong>Başvuru Bitiş:</strong> 28 Şubat 2024</li>
          <li><strong>Sonuç Açıklama:</strong> 5 Mart 2024</li>
          <li><strong>Staj Başlangıç:</strong> 15 Mart 2024</li>
        </ul>
        
        <p>Detaylı bilgi için staj komisyonu ile iletişime geçebilirsiniz.</p>
        
        <p><strong>Staj Komisyonu</strong><br/>
        Telefon: (0352) 207 66 66<br/>
        E-posta: staj@erciyes.edu.tr</p>
      `
    },
    {
      id: 2,
      title: "Akademik Takvim Güncellendi",
      summary: "2023-2024 eğitim öğretim yılı akademik takvimi güncellendi...",
      date: "10 Şubat 2024",
      category: "general",
      content: `
        <h3>Akademik Takvim Güncellenmesi</h3>
        
        <p>Sayın Öğrenciler,</p>
        
        <p>2023-2024 eğitim öğretim yılı akademik takvimi güncellenmiştir.</p>
        
        <h4>Güncellemeler:</h4>
        <ul>
          <li>Final sınavları 1 hafta ertelenmiştir</li>
          <li>Bütünleme sınavları yeniden planlanmıştır</li>
          <li>Yaz okulu kayıt tarihleri değişmiştir</li>
        </ul>
        
        <p>Detaylar için öğrenci işleri dairesine başvurabilirsiniz.</p>
        
        <p><strong>Öğrenci İşleri Dairesi</strong><br/>
        Telefon: (0352) 207 66 66<br/>
        E-posta: ogrenci@erciyes.edu.tr</p>
      `
    },
    {
      id: 3,
      title: "Staj Değerlendirme Kriterleri",
      summary: "Staj değerlendirme kriterleri ve puanlama sistemi açıklandı...",
      date: "8 Şubat 2024",
      category: "internship",
      content: `
        <h3>Staj Değerlendirme Kriterleri Güncellendi</h3>
        
        <p>Sayın Öğrenciler,</p>
        
        <p>Staj değerlendirme kriterleri ve puanlama sistemi yeniden düzenlenmiştir.</p>
        
        <h4>Yeni Değerlendirme Kriterleri:</h4>
        <ul>
          <li><strong>Staj Defteri (40%):</strong> Günlük çalışmaların detaylı kaydı</li>
          <li><strong>Kurum Değerlendirme Formu (30%):</strong> Staj yapılan kurumun değerlendirmesi</li>
          <li><strong>Sunum (20%):</strong> Staj sonrası yapılacak sunum</li>
          <li><strong>Rapor (10%):</strong> Staj sonunda hazırlanacak rapor</li>
        </ul>
        
        <h4>Başarı Kriteri:</h4>
        <p>Stajdan başarılı sayılmak için toplam puanın en az <strong>60</strong> olması gerekmektedir.</p>
        
        <p>Sorularınız için staj komisyonu ile iletişime geçebilirsiniz.</p>
      `
    },
    {
      id: 4,
      title: "Yeni Ders Kayıt Sistemi",
      summary: "Yeni ders kayıt sistemi devreye alındı...",
      date: "5 Şubat 2024",
      category: "general",
      content: `
        <h3>Yeni Ders Kayıt Sistemi</h3>
        
        <p>Sayın Öğrenciler,</p>
        
        <p>Yeni ders kayıt sistemi devreye alınmıştır. Öğrenciler artık daha kolay şekilde ders kaydı yapabileceklerdir.</p>
        
        <h4>Yeni Özellikler:</h4>
        <ul>
          <li>Daha hızlı kayıt işlemi</li>
          <li>Anlık kontenjan kontrolü</li>
          <li>Çakışma kontrolü</li>
          <li>Mobil uyumlu arayüz</li>
        </ul>
        
        <p>Sisteme öğrenci numaranız ve şifrenizle giriş yapabilirsiniz.</p>
      `
    },
    {
      id: 5,
      title: "Online Staj Sunumları",
      summary: "Staj sunumları online olarak gerçekleştirilecektir...",
      date: "2 Şubat 2024",
      category: "internship",
      content: `
        <h3>Online Staj Sunumları</h3>
        
        <p>Sayın Öğrenciler,</p>
        
        <p>Bu dönem staj sunumları online olarak gerçekleştirilecektir.</p>
        
        <h4>Sunum Detayları:</h4>
        <ul>
          <li><strong>Platform:</strong> Microsoft Teams</li>
          <li><strong>Süre:</strong> 15 dakika sunum + 5 dakika soru-cevap</li>
          <li><strong>Format:</strong> PowerPoint sunumu</li>
          <li><strong>Katılımcılar:</strong> Staj komisyonu üyeleri</li>
        </ul>
        
        <p>Sunum tarihleri ve detayları yakında duyurulacaktır.</p>
      `
    },
    {
      id: 6,
      title: "Kütüphane Çalışma Saatleri",
      summary: "Kütüphane çalışma saatleri değişti...",
      date: "30 Ocak 2024",
      category: "general",
      content: `
        <h3>Kütüphane Çalışma Saatleri Güncellendi</h3>
        
        <p>Sayın Öğrenciler,</p>
        
        <p>Kütüphane çalışma saatleri güncellenmiştir.</p>
        
        <h4>Yeni Çalışma Saatleri:</h4>
        <ul>
          <li><strong>Pazartesi - Cuma:</strong> 08:00 - 22:00</li>
          <li><strong>Cumartesi:</strong> 09:00 - 18:00</li>
          <li><strong>Pazar:</strong> 10:00 - 18:00</li>
        </ul>
        
        <p>Sınav dönemlerinde çalışma saatleri uzatılabilir.</p>
        
        <p><strong>Kütüphane</strong><br/>
        Telefon: (0352) 207 66 66<br/>
        E-posta: kutuphane@erciyes.edu.tr</p>
      `
    }
  ];

  const announcement = allNews.find(news => news.id === parseInt(id || '0'));

  // Kategori bazlı yönlendirme URL'lerini belirle
  const getBackUrl = (category: string) => {
    return category === 'general' ? '/general-announcements' : '/internship-announcements';
  };

  const getCategoryDisplayName = (category: string) => {
    return category === 'general' ? 'Genel Duyurular' : 'Staj Duyuruları';
  };

  if (!announcement) {
    return (
      <div className="flex flex-col min-h-screen">
        <LandingPageHeader />
        
        {/* Hero Section for 404 */}
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
                DUYURU BULUNAMADI
              </h1>
            </div>
          </div>
        </div>
        
        <main className="flex-1 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <KeenIcon icon="note" className="text-gray-400 text-6xl mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Duyuru Bulunamadı</h2>
            <p className="text-gray-600 mb-6">Aradığınız duyuru mevcut değil veya kaldırılmış olabilir.</p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <KeenIcon icon="left" className="mr-2" />
              Ana Sayfaya Dön
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <LandingPageHeader />
      
      {/* Hero Section */}
      <div 
        className="relative h-[700px] min-h-[500px] bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url('/media/eru/${announcement.category === 'general' ? 'duyurularfoto2.jpg' : 'duyurularfoto3.jpg'}')`
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-white text-5xl font-bold drop-shadow-lg">
              {announcement.category === 'general' ? 'GENEL DUYURULAR' : 'STAJ DUYURULARI'}
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
                  <KeenIcon 
                    icon={announcement.category === 'general' ? 'notification' : 'briefcase'} 
                    className="text-gray-600 text-sm" 
                  />
                  <Link 
                    to={getBackUrl(announcement.category)} 
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  >
                    {getCategoryDisplayName(announcement.category)}
                  </Link>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <KeenIcon icon="right" className="text-gray-400 text-xs" />
                <span className="text-gray-700 font-medium truncate max-w-md">{announcement.title}</span>
              </div>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6">
              <Link 
                to={getBackUrl(announcement.category)}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                <KeenIcon icon="left" className="mr-2" />
                {getCategoryDisplayName(announcement.category)} Sayfasına Dön
              </Link>
            </div>

            {/* Article Header */}
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-8">
                <header className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                    {announcement.title}
                  </h1>
                  <div className={`h-1 w-full rounded-full ${announcement.category === 'general' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                </header>

                {/* Article Content */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 mb-6"
                  dangerouslySetInnerHTML={{ __html: announcement.content }}
                />
                
                {/* Date */}
                <div className="text-gray-500 text-sm border-t border-gray-200 pt-4">
                  <span className="flex items-center">
                    <KeenIcon icon="calendar" className="mr-2" />
                    {announcement.date}
                  </span>
                </div>
              </div>
            </article>

            {/* Related Announcements */}
            <div className="mt-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">İlgili Duyurular</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {allNews
                  .filter(news => news.id !== announcement.id && news.category === announcement.category)
                  .slice(0, 2)
                  .map((relatedNews) => (
                    <Link 
                      key={relatedNews.id}
                      to={`/announcement/${relatedNews.id}`}
                      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-gray-500">{relatedNews.date}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                        {relatedNews.title}
                      </h4>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedNews.summary}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnnouncementDetail; 