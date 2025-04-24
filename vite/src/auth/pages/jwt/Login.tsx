import { type MouseEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { Alert } from '@/components';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';

// CSS dosyasını import ediyoruz
import './Login.css';

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  remember: Yup.boolean()
});

const initialValues = {
  email: '',
  password: '',
  remember: false
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();
  
  // Header sorunu çözümü için özel state
  const [isHeaderFixed, setIsHeaderFixed] = useState(false);

  // Sayfa yüklendiğinde gerekli düzenlemeleri yap
  useEffect(() => {
    // Document yapısını düzelt
    document.documentElement.style.height = '100%';
    document.documentElement.style.overflowX = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
    
    document.body.style.height = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    
    // Sayfayı en üste kaydır
    window.scrollTo(0, 0);
    
    // Header görünürlüğünü zorla
    const fixHeader = () => {
      const headerElement = document.getElementById('header-container');
      if (headerElement) {
        headerElement.style.display = 'block';
        headerElement.style.visibility = 'visible';
        headerElement.style.position = 'relative';
        headerElement.style.top = '0';
        headerElement.style.zIndex = '1000';
        headerElement.style.opacity = '1';
        setIsHeaderFixed(true);
      } else {
        setIsHeaderFixed(false);
      }
    };
    
    // Hemen çalıştır
    fixHeader();
    
    // İçeriğin yüklenmesi için 100ms bekle ve tekrar dene
    const timeoutId = setTimeout(fixHeader, 100);
    
    // Pencere boyutu değiştiğinde tekrar uygula
    window.addEventListener('resize', fixHeader);
    
    // Temizleme fonksiyonu
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', fixHeader);
    };
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        if (!login) {
          throw new Error('JWTProvider is required for this form.');
        }

        await login(values.email, values.password);

        if (values.remember) {
          localStorage.setItem('email', values.email);
        } else {
          localStorage.removeItem('email');
        }

        navigate(from, { replace: true });
        
      } catch {
        setStatus('Kullanıcı adı veya şifre hatalı.');
        setSubmitting(false);
      }
      setLoading(false);
    }
  });

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" id="login-page-root">
      {/* Sayfanın başlangıcında bir işaretçi */}
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>
      
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="content-container">
        <div className="card max-w-[390px] w-full">
          <form
            className="card-body flex flex-col gap-5 p-10"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            {formik.status && <Alert variant="danger">{formik.status}</Alert>}

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">Email</label>
              <label className="input">
                <input
                  placeholder="Emailinizi girin"
                  autoComplete="off"
                  {...formik.getFieldProps('email')}
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.email && formik.errors.email
                  })}
                />
              </label>
              {formik.touched.email && formik.errors.email && (
                <span role="alert" className="text-danger text-xs mt-1">
                  {formik.errors.email}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-1">
                <label className="form-label text-gray-900">Şifre</label>
                <Link
                  to="/auth/reset-password"
                  className="text-2sm link shrink-0"
                >
                  Şifreni mi unuttun?
                </Link>
              </div>
              <label className="input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifrenizi girin"
                  autoComplete="off"
                  {...formik.getFieldProps('password')}
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.password && formik.errors.password
                  })}
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

            <label className="checkbox-group">
              <input
                className="checkbox checkbox-sm"
                type="checkbox"
                {...formik.getFieldProps('remember')}
              />
              <span className="checkbox-label">Beni hatırla</span>
            </label>

            <button
              type="submit"
              className="btn btn-primary flex justify-center grow login-button"
              disabled={loading || formik.isSubmitting}
            >
              {loading ? 'Lütfen bekleyin...' : 'Giriş Yap'}
            </button>

            <button
              type="button"
              className="btn flex justify-center grow mt-2 register-button"
              onClick={() => navigate('/auth/signup')}
            >
              Kayıt Ol
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

export { Login };