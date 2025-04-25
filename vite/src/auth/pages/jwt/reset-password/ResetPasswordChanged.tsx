import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { useLayout } from '@/providers';
import { useEffect } from 'react';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';

const ResetPasswordChanged = () => {
  const { currentLayout } = useLayout();

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
    <div className="reset-password-changed-container" id="reset-password-changed-page-root">
      {/* Sayfanın başlangıcında bir işaretçi */}
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="content-container">
        <div className="card max-w-[440px] w-full">
          <div className="card-body p-10">
            <div className="flex justify-center mb-5">
              <img
                src={toAbsoluteUrl('/media/illustrations/32.svg')}
                className="dark:hidden max-h-[180px]"
                alt=""
              />
              <img
                src={toAbsoluteUrl('/media/illustrations/32-dark.svg')}
                className="light:hidden max-h-[180px]"
                alt=""
              />
            </div>

            <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
              Şifreniz Değiştirildi
            </h3>
            <div className="text-2sm text-center text-gray-700 mb-7.5">
              Şifreniz başarıyla değiştirildi.
            </div>

            <div className="flex justify-center">
              <Link
                to={'/auth/login'}
                className="btn custom-primary-button"
                style={{ backgroundColor: '#13126e', color: 'white' }}
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export { ResetPasswordChanged };