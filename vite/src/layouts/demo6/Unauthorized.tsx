import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components';

const Unauthorized: React.FC = () => {
  useEffect(() => {
    document.title = `Yetkisiz Erişim | Staj Yönetim Sistemi`;
  }, []);

  return (
    <Container>
      <div className="min-h-[calc(100vh-240px)] flex items-center justify-center py-12">
        <div className="text-center max-w-md px-4">
          <div className="text-[120px] leading-none font-bold text-gray-200 mb-4">401</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Yetkisiz Erişim</h1>
          <p className="text-gray-600 mb-8">
            Bu sayfaya erişim yetkiniz bulunmamaktadır. Lütfen giriş yapın veya yetkili olduğunuz bir
            sayfaya dönün.
          </p>
          <Link to="/" className="btn bg-[#13126e] text-white py-2 px-6 rounded inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default Unauthorized;