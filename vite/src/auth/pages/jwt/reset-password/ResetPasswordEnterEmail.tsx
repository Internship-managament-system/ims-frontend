import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import Header from '@/layouts/eru/Header/Header';

const ResetPasswordEnterEmail = () => {
  const { currentLayout } = useLayout();
  const [searchInput, setSearchInput] = useState('');

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="card max-w-[370px] w-full">
        <form className="card-body flex flex-col gap-5 p-10">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Email Adresiniz</h3>
            <span className="text-2sm text-gray-700">Şifrenizi sıfırlamak için mail adresinizi girin</span>
          </div>

          <div className="flex flex-col gap-1">
            <label className="form-label font-normal text-gray-900">Email</label>
            <input
              className="input"
              type="text"
              placeholder="1030510100@erciyes.edu.tr"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Link
            to={
              currentLayout?.name === 'auth-branded'
                ? '/auth/reset-password/check-email'
                : '/auth/classic/reset-password/check-email'
            }
            className="btn flex justify-center grow"
            style={{ backgroundColor: '#13126e', color: 'white' }}
          >
            Devam et
            <KeenIcon icon="black-right" />
          </Link>
        </form>
      </div>
    </>

  );
};

export { ResetPasswordEnterEmail };
