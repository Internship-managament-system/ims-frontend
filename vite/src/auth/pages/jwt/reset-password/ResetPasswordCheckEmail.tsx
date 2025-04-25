import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils';
import { useLayout } from '@/providers';
import { useEffect, useState } from 'react';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';

const ResetPasswordCheckEmail = () => {
  const { currentLayout } = useLayout();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // URL'den email parametresini al
    setEmail(new URLSearchParams(window.location.search).get('email'));
    
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
    <div className="reset-password-check-email-container" id="reset-password-check-email-page-root">
      {/* Sayfanın başlangıcında bir işaretçi */}
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="content-container">
        <div className="card max-w-[400px] w-full">
          <div className="card-body p-8">
            <div className="flex flex-col items-center py-10">
              <img
                src={toAbsoluteUrl('/media/eru/webmail.png')}
                className="dark:hidden h-24 w-30 mb-2"
                alt="logo"
              />
              <p
                className="text-[#13126e] text-3xl uppercase mb-3"
                style={{ fontFamily: "Impact, sans-serif" }}
              >
                ERU WEBMAIL
              </p>
              <img
                src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
                className="light:hidden max-h-[130px]"
                alt=""
              />
            </div>

            <h3 className="text-lg font-medium text-gray-900 text-center mb-3">Mail adresinizi kontrol edin</h3>
            <div className="text-2sm text-center text-gray-700 mb-7.5">
              <a href="#" className="text-2sm text-gray-800 font-medium hover:text-primary-active">
                {email || '1030510100@erciyes.edu.tr'}
              </a>
              <br />
              Mail adresinize gönderilen linkten{' '}
              şifrenizi sıfırlayın.
            </div>

            <div className="flex justify-center mb-5">
              <Link
                to={'/auth/login'}
                className="btn flex justify-center custom-primary-button"
                style={{ backgroundColor: '#13126e', color: 'white' }}
              >
                Giriş yapma ekranına dön
              </Link>
            </div>

            <div className="flex items-center justify-center gap-1">
              <span className="text-xs text-gray-600">Link almadınız mı?</span>
              <Link
                to={'/auth/reset-password/enter-email'}
                className="text-xs font-medium link"
              >
                Tekrar Gönder
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

export { ResetPasswordCheckEmail };