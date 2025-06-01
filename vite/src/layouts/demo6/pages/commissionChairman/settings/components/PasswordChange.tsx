import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert, KeenIcon } from '@/components';
import { useAuthContext } from '@/auth';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useLayout } from '@/providers';
import { AxiosError } from 'axios';
import axios from 'axios';
import * as authHelper from '@/auth/_helpers';

const passwordChangeSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('Mevcut şifrenizi girmelisiniz'),
  newPassword: Yup.string()
    .min(8, 'Şifreniz en az 8 karakterden oluşmalı')
    .required('Lütfen yeni bir şifre girin'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Şifreler eşleşmiyor')
    .required('Lütfen şifrenizi tekrar girin')
});

const PasswordChange = () => {
  const { currentLayout } = useLayout();
  // Burada gerçek API çağrısını yapacak fonksiyon kullanılmalı
  const { changePassword } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [success, setSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Şifre değiştirme API çağrısı için özel fonksiyon
  const updatePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    // Göreceli URL kullanıyoruz - böylece tarayıcı kendi kaynağından istek yapar
    // ve CORS hatasını önler
    // Bu URL'i kendi projenize göre düzenlemelisiniz
    const UPDATE_PASSWORD_URL = `/api/v1/users/password/update`;

    // Önce frontend'de şifrelerin eşleştiğini kontrol edelim
    if (newPassword !== confirmPassword) {
      throw new Error('Şifreler eşleşmiyor');
    }

    try {
      const response = await axios.put(
        UPDATE_PASSWORD_URL,
        {
          oldPassword,
          newPassword,
          confirmPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authHelper.getAuth()?.access_token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: passwordChangeSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      setLoading(true);
      setHasErrors(undefined);
      setSuccess(false);

      try {
        // Gerçek API çağrısı - backend'e değiştirilecek şifre bilgilerini gönderiyoruz
        await updatePassword(
          values.oldPassword,
          values.newPassword,
          values.confirmPassword
        );

        setHasErrors(false);
        setSuccess(true);
        resetForm();
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          // API'den dönen hata mesajını göster
          setStatus(error.response.data.message || 'Şifre değiştirme işlemi başarısız oldu.');
        } else {
          setStatus('Şifre değiştirme işlemi başarısız oldu. Lütfen tekrar deneyin.');
        }
        setHasErrors(true);
        // Form değerlerini sıfırlama, kullanıcının düzeltmesine izin ver
        formik.setFieldValue('oldPassword', '');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Şifre Değiştir</h2>

      <form
        className="flex flex-col gap-5"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {hasErrors && <Alert variant="danger">{formik.status}</Alert>}
        {success && (
          <Alert variant="success">
            Şifreniz başarıyla değiştirildi.
          </Alert>
        )}

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Mevcut Şifre</label>
          <label className="input flex border rounded relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              placeholder="Mevcut şifrenizi girin"
              autoComplete="current-password"
              {...formik.getFieldProps('oldPassword')}
              className={clsx(
                'form-control bg-transparent flex-grow border-0 p-2 outline-none',
                { 'border-red-300': formik.touched.oldPassword && formik.errors.oldPassword }
              )}
            />
            <button
              type="button"
              className="btn btn-icon absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              <KeenIcon icon={showOldPassword ? "eye-slash" : "eye"} className="text-gray-500" />
            </button>
          </label>
          {formik.touched.oldPassword && formik.errors.oldPassword && (
            <span role="alert" className="text-red-500 text-xs mt-1">
              {formik.errors.oldPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Yeni Şifre</label>
          <label className="input flex border rounded relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Yeni şifrenizi girin"
              autoComplete="new-password"
              {...formik.getFieldProps('newPassword')}
              className={clsx(
                'form-control bg-transparent flex-grow border-0 p-2 outline-none',
                { 'border-red-300': formik.touched.newPassword && formik.errors.newPassword }
              )}
            />
            <button
              type="button"
              className="btn btn-icon absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <KeenIcon icon={showNewPassword ? "eye-slash" : "eye"} className="text-gray-500" />
            </button>
          </label>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <span role="alert" className="text-red-500 text-xs mt-1">
              {formik.errors.newPassword}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="form-label text-gray-900">Yeni Şifre (Tekrar)</label>
          <label className="input flex border rounded relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Yeni şifrenizi tekrar girin"
              autoComplete="new-password"
              {...formik.getFieldProps('confirmPassword')}
              className={clsx(
                'form-control bg-transparent flex-grow border-0 p-2 outline-none',
                { 'border-red-300': formik.touched.confirmPassword && formik.errors.confirmPassword }
              )}
            />
            <button
              type="button"
              className="btn btn-icon absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <KeenIcon icon={showConfirmPassword ? "eye-slash" : "eye"} className="text-gray-500" />
            </button>
          </label>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <span role="alert" className="text-red-500 text-xs mt-1">
              {formik.errors.confirmPassword}
            </span>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            className="btn flex justify-center items-center px-6 py-2 rounded"
            disabled={loading || formik.isSubmitting}
            style={{ backgroundColor: '#13126e', color: 'white' }}
          >
            {loading ? 'İşlem yapılıyor...' : 'Şifreyi Değiştir'}
          </button>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <KeenIcon icon="warning" className="text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Güvenliğiniz için güçlü bir şifre kullanın. En az 8 karakter uzunluğunda, büyük-küçük harf, rakam ve özel karakter içeren bir şifre seçin.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordChange;