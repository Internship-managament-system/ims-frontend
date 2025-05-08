import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthContext } from '../../useAuthContext';
import { toAbsoluteUrl } from '@/utils';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';
import './Signup.css';

const initialValues = {
  email: '',
  name: '',
  surname: '',
  acceptTerms: false
};

const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Geçersiz email formatı')
    .min(3, 'En az 3 karakter olmalı')
    .max(50, 'En fazla 50 karakter olabilir')
    .required('E-posta zorunludur'),
  name: Yup.string()
    .min(2, 'En az 2 karakter olmalı')
    .max(50, 'En fazla 50 karakter olabilir')
    .required('Ad zorunludur'),
  surname: Yup.string()
    .min(2, 'En az 2 karakter olmalı')
    .max(50, 'En fazla 50 karakter olabilir')
    .required('Soyad zorunludur'),
  acceptTerms: Yup.bool()
    .oneOf([true], 'Kullanım koşullarını kabul etmelisiniz')
    .required('Kullanım koşullarını kabul etmelisiniz')
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
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

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!register) {
          throw new Error('JWTProvider is required for this form.');
        }
        // Yeni kayıt işlevi - email, ad ve soyad kullanarak
        await register(values.email, values.name, values.surname);
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        setStatus('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  return (
    <div className="signup-container">
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="content-container">
        <div className="card max-w-[370px] w-full">
          <form
            className="card-body flex flex-col gap-5 p-10"
            noValidate
            onSubmit={formik.handleSubmit}
          >
            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Email</label>
              <label className="input">
                <input
                  placeholder="1030510100@erciyes.edu.tr"
                  type="email"
                  autoComplete="off"
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.email && formik.errors.email },
                    {
                      'is-valid': formik.touched.email && !formik.errors.email
                    }
                  )}
                />
              </label>
              {formik.touched.email && formik.errors.email && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Ad</label>
              <label className="input">
                <input
                  placeholder="Adınız"
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps('name')}
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid': formik.touched.name && formik.errors.name
                    },
                    {
                      'is-valid': formik.touched.name && !formik.errors.name
                    }
                  )}
                />
              </label>
              {formik.touched.name && formik.errors.name && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.name}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Soyad</label>
              <label className="input">
                <input
                  placeholder="Soyadınız"
                  type="text"
                  autoComplete="off"
                  {...formik.getFieldProps('surname')}
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid': formik.touched.surname && formik.errors.surname
                    },
                    {
                      'is-valid': formik.touched.surname && !formik.errors.surname
                    }
                  )}
                />
              </label>
              {formik.touched.surname && formik.errors.surname && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.surname}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                className="checkbox"
                type="checkbox"
                {...formik.getFieldProps('acceptTerms')}
              />
              <span className="checkbox-label">
                <a href="#" className="text-primary">
                  Kullanım koşullarını
                </a>
                {' '}okudum ve kabul ediyorum
              </span>
            </div>

            {formik.touched.acceptTerms && formik.errors.acceptTerms && (
              <span role="alert" className="text-danger text-xs mt-1">
                {formik.errors.acceptTerms}
              </span>
            )}

            <button
              type="submit"
              className="btn flex justify-center grow mt-2 signup-button"
              disabled={loading || formik.isSubmitting}
              style={{ backgroundColor: '#13126e', color: 'white' }}
            >
              {loading ? 'Lütfen bekleyin...' : 'Kayıt Ol'}
            </button>
            
            <div className="text-center mt-3">
              <span className="text-gray-600">Zaten hesabınız var mı?</span>{' '}
              <Link to="/auth/login" className="text-primary font-medium">
                Giriş Yap
              </Link>
            </div>
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

export { Signup };