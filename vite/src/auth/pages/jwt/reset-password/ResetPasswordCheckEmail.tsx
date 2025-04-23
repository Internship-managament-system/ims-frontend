import { Link } from 'react-router-dom';

import { toAbsoluteUrl } from '@/utils';
import { useLayout } from '@/providers';
import { useEffect, useState } from 'react';
import Header from '@/layouts/eru/Header/Header';

const ResetPasswordCheckEmail = () => {
  const { currentLayout } = useLayout();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    setEmail(new URLSearchParams(window.location.search).get('email'));
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="card max-w-[440px] w-full">
        <div className="card-body p-10">
          <div className="flex flex-col items-center py-10">
            <img
              src={toAbsoluteUrl('/media/eru/webmail.png')}
              className="dark:hidden h-30 w-30 mb-2"
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
              1030510100@erciyes.edu.tr
            </a>
            <br />
            Mail adresinize gönderilen linkten{' '}
            şifrenizi sıfırlayın.
          </div>

          <div className="flex justify-center mb-5">
            <Link
              to={
                currentLayout?.name === 'auth-branded'
                  ? '/auth/reset-password/changed'
                  : '/auth/classic/reset-password/changed'
              }
              className="btn flex justify-center"
              style={{ backgroundColor: '#13126e', color: 'white' }}
            >
              Giriş yapma ekranına dön
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-600">Link almadınız mı?</span>
            <Link
              to={
                currentLayout?.name === 'auth-branded'
                  ? '/auth/reset-password/enter-email'
                  : '/auth/classic/reset-password/enter-email'
              }
              className="text-xs font-medium link"
            >
              Tekrar Gönder
            </Link>
          </div>
        </div>
      </div>
    </>

  );
};

export { ResetPasswordCheckEmail };
