import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeenIcon } from '../../components';
import LandingPageHeader from '../../components/LandingPageHeader/LandingPageHeader';
import Footer from '../../layouts/eru/Footer/Footer';

// Slider fotoğraflarını import et
import slider1 from '/src/public/media/eru/slider1.jpg';
import slider2 from '/src/public/media/eru/slider2.jpg';
import slider3 from '/src/public/media/eru/slider3.jpg';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
  category: 'news' | 'internship';
}

interface SliderItem {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonText?: string;
  buttonLink?: string;
}

const LandingPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Debug: Component mount kontrolü
  useEffect(() => {
    console.log('LandingPage component mounted!');
    console.log('Current slide:', currentSlide);
    console.log('Slider items:', sliderItems);
  }, [currentSlide]);

  // Slider fotoğrafları
  const sliderItems = [
    { id: 1, image: '/media/eru/slider1.jpg' },
    { id: 2, image: '/media/eru/slider2.jpg' },
    { id: 3, image: '/media/eru/slider3.jpg' }
  ];

  // Örnek haberler
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: "Bilgisayar Mühendisliği Bölümü Kariyer Günleri",
      excerpt: "Sektörün önde gelen firmalarının katılacağı kariyer günleri 25-26 Mart tarihlerinde düzenlenecek.",
      date: "2024-03-10",
      category: "news"
    },
    {
      id: 2,
      title: "Yazılım Geliştirme Stajları İçin Başvurular",
      excerpt: "Önde gelen teknoloji şirketlerinde yazılım geliştirme stajları için başvuru süreci başladı.",
      date: "2024-03-08",
      category: "internship"
    },
    {
      id: 3,
      title: "Akademik Başarı Ödülleri Töreni",
      excerpt: "2023-2024 akademik yılı başarı ödülleri töreni 30 Mart'ta düzenlenecek.",
      date: "2024-03-05",
      category: "news"
    },
    {
      id: 4,
      title: "Endüstri 4.0 ve Staj Fırsatları",
      excerpt: "Endüstri 4.0 teknolojileri alanında staj yapacak öğrenciler için özel program başlatıldı.",
      date: "2024-03-03",
      category: "internship"
    }
  ];

  // Slider otomatik geçiş
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderItems.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  return (
    <div className="min-h-screen w-full flex flex-col">
      {/* Header */}
      <LandingPageHeader />

      {/* Hero Slider */}
      <div className="relative w-full text-white overflow-hidden" style={{ minHeight: '720px' }}>
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Slide 1 - slider1.jpg */}
          <div 
            className="w-full flex-shrink-0 cursor-pointer relative" 
            style={{ minHeight: '720px' }}
            onClick={() => {
              // İleride endpoint eklenecek
              console.log('Slider 1 tıklandı');
            }}
          >
            <img 
              src={slider1} 
              alt="Slider 1"
              className="w-full h-full object-cover"
              style={{ minHeight: '720px' }}
            />
          </div>

          {/* Slide 2 - slider2.jpg */}
          <div 
            className="w-full flex-shrink-0 cursor-pointer relative" 
            style={{ minHeight: '720px' }}
            onClick={() => {
              // İleride endpoint eklenecek
              console.log('Slider 2 tıklandı');
            }}
          >
            <img 
              src={slider2} 
              alt="Slider 2"
              className="w-full h-full object-cover"
              style={{ minHeight: '720px' }}
            />
          </div>

          {/* Slide 3 - slider3.jpg */}
          <div 
            className="w-full flex-shrink-0 cursor-pointer relative" 
            style={{ minHeight: '720px' }}
            onClick={() => {
              // İleride endpoint eklenecek
              console.log('Slider 3 tıklandı');
            }}
          >
            <img 
              src={slider3} 
              alt="Slider 3"
              className="w-full h-full object-cover"
              style={{ minHeight: '720px' }}
            />
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all z-10"
        >
          <KeenIcon icon="arrow-left" className="text-xl" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all z-10"
        >
          <KeenIcon icon="arrow-right" className="text-xl" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
        {/* News Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Haberler ve Duyurular
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mx-auto">
            {/* Genel Duyurular */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#1e3a8a] text-white px-6 py-4">
                <h3 className="text-lg font-semibold">GENEL DUYURULAR</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {newsItems
                    .filter(item => item.category === 'news')
                    .map(item => (
                      <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                            {new Date(item.date).toLocaleDateString('tr-TR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm leading-relaxed">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to="/general-announcements"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <KeenIcon icon="menu" className="text-sm" />
                    Tüm Genel Duyurular
                  </Link>
                </div>
              </div>
            </div>

            {/* Staj Duyuruları */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#1e3a8a] text-white px-6 py-4">
                <h3 className="text-lg font-semibold">STAJ DUYURULARI</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {newsItems
                    .filter(item => item.category === 'internship')
                    .map(item => (
                      <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-medium">
                            {new Date(item.date).toLocaleDateString('tr-TR', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            })}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2 text-sm leading-relaxed">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to="/internship-announcements"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <KeenIcon icon="menu" className="text-sm" />
                    Tüm Staj Duyuruları
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage; 