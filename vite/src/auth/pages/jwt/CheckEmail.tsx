import { Link } from 'react-router-dom';

import { toAbsoluteUrl } from '@/utils';
import Header from '@/layouts/eru/Header/Header';

const CheckEmail = () => {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      <div className="card max-w-[440px] w-full">
        <div className="card-body p-10">
          <div className="flex justify-center py-10">
            <img
              src={toAbsoluteUrl('/media/eru/webmail.png')}
              className="dark:hidden max-h-[130px]"
              alt=""
            />
            <img
              src={toAbsoluteUrl('/media/illustrations/30-dark.svg')}
              className="light:hidden max-h-[130px]"
              alt=""
            />
          </div>

          <h3 className="text-lg font-medium text-gray-900 text-center mb-3">Email adresinizi kontrol ediniz</h3>
          <div className="text-2sm text-center text-gray-700 mb-7.5">
            Hesabınızı doğrulamak için lütfen &nbsp;
            <a href="#" className="text-2sm text-gray-900 font-medium hover:text-primary-active">
              1030510100@erciyes.edu.tr
            </a>
            <br />
            adresinize gönderilen bağlantıya tıklayın.
          </div>

          <div className="flex justify-center mb-5">
            <Link
              to="/"
              className="btn flex justify-center"
              style={{ backgroundColor: '#13126e', color: 'white' }}
            >
              Giriş yap sayfası
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-gray-700">Didn’t receive an email?</span>
            <Link to="/auth/classic/login" className="text-xs font-medium link">
              Resend
            </Link>
          </div>
        </div>
      </div>
    </>

  );
};

export { CheckEmail };
