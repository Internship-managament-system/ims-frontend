import { type MouseEvent, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useLayout } from '@/providers';
import { Alert } from '@/components';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';
import { useLanguage } from '../../../contexts/languageContext';

// CSS dosyasını import ediyoruz
import './Login.css';

const loginSchema = Yup.object().shape({ 
  email: Yup.string()
    .email('Geçersiz email formatı')
    .min(3, 'En az 3 karakter olmalı')
    .max(50, 'En fazla 50 karakter olabilir')
    .required('E-posta zorunludur'),
  password: Yup.string()
    .min(3, 'En az 3 karakter olmalı')
    .max(50, 'En fazla 50 karakter olabilir')
    .required('Şifre zorunludur'),
  remember: Yup.boolean()
});

// localStorage'dan kaydedilmiş bilgileri oku
const getInitialValues = () => {
  const savedEmail = localStorage.getItem('rememberedEmail');
  const savedPassword = localStorage.getItem('rememberedPassword');
  const wasRemembered = localStorage.getItem('rememberMe') === 'true';

  return {
    email: wasRemembered && savedEmail ? savedEmail : '',
    password: wasRemembered && savedPassword ? savedPassword : '',
    remember: wasRemembered
  };
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [departmentUpdateStatus, setDepartmentUpdateStatus] = useState<'pending' | 'success' | 'error' | null>(null);
  const { login, currentUser, isAdmin, isStudent, isCommissionMember } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPassword, setShowPassword] = useState(false);
  const { currentLayout } = useLayout();
  const { t } = useLanguage();

  const [isHeaderFixed, setIsHeaderFixed] = useState(false);
  
  // Kayıt sonrası success mesajı gösterme
  const [registrationSuccess, setRegistrationSuccess] = useState<string | null>(
    location.state?.successMessage || null
  );
  
  // Kayıt sonrası email otomatik doldurma
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(
    location.state?.registeredEmail || null
  );

  // // Departman güncelleme işlemi
  // const updateDepartment = async (userId: string) => {
  //   const pendingDepartment = localStorage.getItem('pendingDepartment');
  //   if (!pendingDepartment) return;

  //   try {
  //     setDepartmentUpdateStatus('pending');
      
  //     // Departman bilgisini güncelle
  //     await axios.put(`/api/v1/users/${userId}/update`, {
  //       departmentId: pendingDepartment
  //     });
      
  //     // Başarılı güncelleme
  //     console.log('Departman bilgisi güncellendi:', pendingDepartment);
  //     setDepartmentUpdateStatus('success');
      
  //     // localStorage'dan temizle
  //     localStorage.removeItem('pendingDepartment');
  //   } catch (error) {
  //     console.error('Departman güncelleme hatası:', error);
  //     setDepartmentUpdateStatus('error');
  //   }
  // };

  useEffect(() => {
  if (currentUser) {
    if (isAdmin()) {
      navigate('/admin/dashboard', { replace: true });
    } else if (isCommissionMember()) {
      navigate('/commission/dashboard', { replace: true });
    } else if (isStudent()) {
      navigate('/student/dashboard', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }
}, [currentUser, isAdmin, isStudent, isCommissionMember, navigate]);


  useEffect(() => {
    // Kayıt sonrası otomatik email doldurma
    if (registeredEmail && formik) {
      formik.setFieldValue('email', registeredEmail);
    }
  }, [registeredEmail]);



  useEffect(() => {
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

    window.scrollTo(0, 0);

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

    fixHeader();
    const timeoutId = setTimeout(fixHeader, 100);
    window.addEventListener('resize', fixHeader);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', fixHeader);
    };
  }, []);

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);

      try {
        if (!login) {
          throw new Error('JWTProvider is required for this form.');
        }

        await login(values.email, values.password);

        if (values.remember) {
          // Beni hatırla seçiliyse email ve şifreyi kaydet
          localStorage.setItem('rememberedEmail', values.email);
          localStorage.setItem('rememberedPassword', values.password);
          localStorage.setItem('rememberMe', 'true');
        } else {
          // Beni hatırla seçili değilse kaydedilmiş bilgileri temizle
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('email'); // Eski email kaydını da temizle
        }

        // Login başarılı - useEffect içinde currentUser ile yönlendirme yapılacak
        // useEffect, kullanıcıyı rolüne göre yönlendirecek ve varsa departman güncellemesi yapacak
        console.log('Login successful!');

      } catch (error) {
        console.error('Login error:', error);
        setStatus(t('loginError') || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        setSubmitting(false);
        setLoading(false);
      }
    }
  });

  const togglePassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container" id="login-page-root">
      <div id="page-top-anchor" style={{ position: 'absolute', top: 0, left: 0, height: 0, width: '100%' }}></div>

      <Header />

      <div className="content-container">
        <div className="card max-w-[390px] w-full">
          <form
            className="card-body flex flex-col gap-5 p-10"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            {/* Başarı mesajı - signup sonrası */}
            {registrationSuccess && (
              <Alert variant="success" className="mb-2">
                {registrationSuccess}
              </Alert>
            )}

            {/* Departman update durumu */}
            {departmentUpdateStatus === 'success' && (
              <Alert variant="success" className="mb-2">
                Departman bilginiz başarıyla güncellendi!
              </Alert>
            )}
            
            {departmentUpdateStatus === 'error' && (
              <Alert variant="warning" className="mb-2">
                Departman bilginiz güncellenemedi. Profil sayfasından tekrar deneyebilirsiniz.
              </Alert>
            )}

            {formik.status && <Alert variant="danger">{formik.status}</Alert>}

            <div className="flex flex-col gap-1">
              <label className="form-label text-gray-900">{t('email')}</label>
              <label className="input">
                <input
                  placeholder={t('enterEmail')}
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
                <label className="form-label text-gray-900">{t('password')}</label>
                <Link to="/auth/reset-password" className="text-2sm link shrink-0">
                  {t('forgotPassword')}
                </Link>
              </div>
              <label className="input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('enterPassword')}
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  {...formik.getFieldProps('password')}
                  className={clsx('form-control', {
                    'is-invalid': formik.touched.password && formik.errors.password
                  })}
                />
                {formik.values.password && (
                  <button className="btn btn-icon" onClick={togglePassword}>
                    <KeenIcon icon="eye" className={clsx('text-gray-500', { hidden: showPassword })} />
                    <KeenIcon
                      icon="eye-slash"
                      className={clsx('text-gray-500', { hidden: !showPassword })}
                    />
                  </button>
                )}
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
              <span className="checkbox-label">{t('rememberMe')}</span>
            </label>

            <button
              type="submit"
              className="btn flex justify-center grow login-button"
              style={{ backgroundColor: '#13126e', color: 'white' }}
              disabled={loading || formik.isSubmitting}
            >
              {loading ? t('pleaseWait') : t('login')}
            </button>

            <button
              type="button"
              className="btn flex justify-center grow mt-2 register-button"
              onClick={() => navigate('/auth/signup')}
            >
              {t('register')}
            </button>
          </form>
        </div>
      </div>

      <div className="footer-container">
        <Footer />
      </div>
    </div>
  );
};

export { Login };