import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';

const passwordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Şifreniz en az 8 karakterden oluşmalı')
    .required('Lütfen bir şifre girin'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
    .required('Lütfen şifrenizi tekrar girin')
});

const ResetPasswordChange = () => {
  const { currentLayout } = useLayout();
  const { changePassword } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirmation, setShowNewPasswordConfirmation] = useState(false);

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
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);

      const token = new URLSearchParams(window.location.search).get('token');
      const email = new URLSearchParams(window.location.search).get('email');

      if (!token || !email) {
        setHasErrors(true);
        setStatus('Token and email properties are required');
        setLoading(false);
        setSubmitting(false);
        return;
      }

      try {
        await changePassword(email, token, values.newPassword, values.confirmPassword);
        setHasErrors(false);
        navigate('/auth/reset-password/changed');
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          setStatus(error.response.data.message);
        } else {
          setStatus('Password reset failed. Please try again.');
        }
        setHasErrors(true);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="reset-password-change-container" id="reset-password-change-page-root">
      {/* Sayfanın başlangıcında bir işaretçi */}
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="content-container">
        <div className="card max-w-[370px] w-full">
          <form
            className="card-body flex flex-col gap-5 p-10"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Şifrenizi Sıfırlayın</h3>
              <span className="text-2sm text-gray-700">Yeni bir şifre girin</span>
            </div>

            {hasErrors && <Alert variant="danger">{formik.status}</Alert>}

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Yeni Şifre</label>
              <label className="input">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder="Yeni bir şifre girin"
                  autoComplete="off"
                  {...formik.getFieldProps('newPassword')}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.newPassword && formik.errors.newPassword },
                    { 'is-valid': formik.touched.newPassword && !formik.errors.newPassword }
                  )}
                />
                <button
                  className="btn btn-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNewPassword(!showNewPassword);
                  }}
                >
                  <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showNewPassword })} />
                  <KeenIcon
                    icon="eye-slash"
                    className={clsx('text-gray-500', { hidden: !showNewPassword })}
                  />
                </button>
              </label>
              {formik.touched.newPassword && formik.errors.newPassword && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.newPassword}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label font-normal text-gray-900">Şifrenizi onaylayın</label>
              <label className="input">
                <input
                  type={showNewPasswordConfirmation ? 'text' : 'password'}
                  placeholder="Yeni şifrenizi tekrar girin"
                  autoComplete="off"
                  {...formik.getFieldProps('confirmPassword')}
                  className={clsx(
                    'form-control bg-transparent',
                    { 'is-invalid': formik.touched.confirmPassword && formik.errors.confirmPassword },
                    { 'is-valid': formik.touched.confirmPassword && !formik.errors.confirmPassword }
                  )}
                />
                <button
                  className="btn btn-icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowNewPasswordConfirmation(!showNewPasswordConfirmation);
                  }}
                >
                  <KeenIcon
                    icon="eye"
                    className={clsx('text-gray-500', { hidden: showNewPasswordConfirmation })}
                  />
                  <KeenIcon
                    icon="eye-slash"
                    className={clsx('text-gray-500', { hidden: !showNewPasswordConfirmation })}
                  />
                </button>
              </label>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.confirmPassword}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn flex justify-center grow custom-primary-button"
              disabled={loading}
              style={{ backgroundColor: '#13126e', color: 'white' }}
            >
              {loading ? 'Lütfen bekleyin...' : 'Şifreyi Değiştir'}
            </button>
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

export { ResetPasswordChange };