import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';

const ResetPasswordEnterEmail = () => {
  const { currentLayout } = useLayout();
  const [searchInput, setSearchInput] = useState('');

  // Sayfa yüklendiğinde gerekli düzenlemeleri yap
  useEffect(() => {
    // Sayfayı en üste kaydır
    window.scrollTo(0, 0);
    
    // Header görünürlüğünü zorla
    const fixHeader = () => {
      const headerElement = document.querySelector('header') || document.querySelector('.header-wrapper');
      if (headerElement) {
        headerElement.style.display = 'block';
        headerElement.style.visibility = 'visible';
        headerElement.style.position = 'relative';
        headerElement.style.top = '0';
        headerElement.style.zIndex = '1000';
      }
    };
    
    // Sayfa yüklendiğinde header'ı düzelt
    fixHeader();
    
    // 100ms gecikmeli olarak tekrar dene
    const timeoutId = setTimeout(fixHeader, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="reset-password-enter-email-container" id="reset-password-enter-email-page-root">
      {/* Sayfanın başlangıcında bir işaretçi */}
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="content-container">
        <div className="card max-w-[370px] w-full">
          <form className="card-body flex flex-col gap-5 p-10">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Email Adresiniz</h3>
              <span className="text-2sm text-gray-700">Şifrenizi sıfırlamak için mail adresinizi girin</span>
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label font-normal text-gray-900">Email</label>
              <input
                className="input form-control"
                type="text"
                placeholder="1030510100@erciyes.edu.tr"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <Link
              to={'/auth/reset-password/check-email'}
              className="btn flex justify-center grow custom-primary-button"
              style={{ backgroundColor: '#13126e', color: 'white' }}
            >
              Devam et
              <KeenIcon icon="black-right" />
            </Link>
          </form>
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export { ResetPasswordEnterEmail };