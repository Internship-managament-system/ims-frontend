import clsx from 'clsx';
import { useFormik } from 'formik';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '@/auth/useAuthContext';
import { Alert, KeenIcon } from '@/components';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';

const initialValues = {
  email: ''
};

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required')
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const { requestPasswordResetLink } = useAuthContext();
  const { currentLayout } = useLayout();
  const navigate = useNavigate();

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
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);
      try {
        if (!requestPasswordResetLink) {
          throw new Error('JWTProvider is required for this form.');
        }
        await requestPasswordResetLink(values.email);
        setHasErrors(false);
        setLoading(false);
        const params = new URLSearchParams();
        params.append('email', values.email);
        navigate({
          pathname:'/auth/reset-password/check-email',
          search: params.toString()
        });
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setStatus(error.response.data.message);
        } else {
          setStatus('Şifre değiştirilirken bir hata meydana geldi. Lütfen Yeniden Deneyiniz.');
        }
        setHasErrors(true);
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="reset-password-container" id="reset-password-page-root">
      {/* Sayfanın başlangıcında bir işaretçi */}
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>

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
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">E-Mail Adresinizi Giriniz</h3>
              <span className="text-2sm text-gray-600 font-medium">
                Şifrenizi değiştirmek için E-Mail adresinizi giriniz.
              </span>
            </div>

            {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

            {hasErrors === false && (
              <Alert variant="success">
                Şifre değiştirme linki gönderildi. Lütfen E-Mail adresinizi kontrol ediniz.
              </Alert>
            )}

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Email</label>
              <label className="input">
                <input
                  type="email"
                  placeholder="email@email.com"
                  autoComplete="off"
                  {...formik.getFieldProps('email')}
                  className={clsx(
                    'form-control',
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

            <div className="flex flex-col gap-5 items-stretch">
              <button
                type="submit"
                className="btn flex justify-center grow"
                style={{ backgroundColor: '#13126e', color: 'white' }}
                disabled={loading || formik.isSubmitting}
              >
                {loading ? 'Lütfen Bekleyin...' : 'Devam Et'}
              </button>

              <Link
                to={'/auth/login'}
                className="flex items-center justify-center text-sm gap-2 text-gray-700 hover:text-primary"
              >
                <KeenIcon icon="black-left" />
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

export { ResetPassword };