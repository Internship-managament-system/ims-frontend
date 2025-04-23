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
  password: '',
  changepassword: '',
  acceptTerms: false
};

const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  changepassword: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions')
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        await register(values.email, values.password, values.changepassword);
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        setStatus('The sign up details are incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };

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
              <label className="form-label text-gray-900">Şifre</label>
              <label className="input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifre"
                  autoComplete="off"
                  {...formik.getFieldProps('password')}
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid': formik.touched.password && formik.errors.password
                    },
                    {
                      'is-valid': formik.touched.password && !formik.errors.password
                    }
                  )}
                />
                <button className="btn btn-icon" onClick={togglePassword}>
                  <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
                  <KeenIcon
                    icon="eye-slash"
                    className={clsx('text-gray-500', { hidden: !showPassword })}
                  />
                </button>
              </label>
              {formik.touched.password && formik.errors.password && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.password}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Şifreyi Onaylayın</label>
              <label className="input">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Şifre Tekrarı"
                  autoComplete="off"
                  {...formik.getFieldProps('changepassword')}
                  className={clsx(
                    'form-control bg-transparent',
                    {
                      'is-invalid': formik.touched.changepassword && formik.errors.changepassword
                    },
                    {
                      'is-valid': formik.touched.changepassword && !formik.errors.changepassword
                    }
                  )}
                />
                <button className="btn btn-icon" onClick={toggleConfirmPassword}>
                  <KeenIcon
                    icon="eye"
                    className={clsx('text-gray-500', { hidden: showConfirmPassword })}
                  />
                  <KeenIcon
                    icon="eye-slash"
                    className={clsx('text-gray-500', { hidden: !showConfirmPassword })}
                  />
                </button>
              </label>
              {formik.touched.changepassword && formik.errors.changepassword && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.changepassword}
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
            >
              {loading ? 'Lütfen bekleyin...' : 'Kayıt Ol'}
            </button>
            
            <div className="text-center mt-3">
              <span className="text-gray-600">Zaten hesabınız var mı?</span>{' '}
              <Link to="/auth/classic/login" className="text-primary font-medium">
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