import React, { useState } from 'react';
import { KeenIcon } from '@/components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Alert } from '@/components';
import clsx from 'clsx';
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

const AccountManagement: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [success, setSuccess] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Şifre değiştirme API çağrısı
  const updatePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    const UPDATE_PASSWORD_URL = `/api/v1/users/password/update`;

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
          setStatus(error.response.data.message || 'Şifre değiştirme işlemi başarısız oldu.');
        } else {
          setStatus('Şifre değiştirme işlemi başarısız oldu. Lütfen tekrar deneyin.');
        }
        setHasErrors(true);
        formik.setFieldValue('oldPassword', '');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  return (
    <div className="container-fixed">
      <div className="flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5">
        <div className="flex flex-col justify-center gap-2">
          <h1 className="text-xl font-semibold leading-none text-gray-900">
            Şifre Değiştir
          </h1>
          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            Hesap güvenliğiniz için şifrenizi güncelleme sayfası
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-7.5">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Şifre Bilgilerinizi Güncelleyin</h3>
            </div>
            <div className="card-body">
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
                  <label className="input">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      placeholder="Mevcut şifrenizi girin"
                      autoComplete="current-password"
                      {...formik.getFieldProps('oldPassword')}
                      className={clsx(
                        'form-control',
                        { 'border-red-300': formik.touched.oldPassword && formik.errors.oldPassword }
                      )}
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      <KeenIcon icon={showOldPassword ? "eye-slash" : "eye"} />
                    </button>
                  </label>
                  {formik.touched.oldPassword && formik.errors.oldPassword && (
                    <span role="alert" className="text-danger text-2xs mt-1">
                      {formik.errors.oldPassword}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="form-label text-gray-900">Yeni Şifre</label>
                  <label className="input">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Yeni şifrenizi girin"
                      autoComplete="new-password"
                      {...formik.getFieldProps('newPassword')}
                      className={clsx(
                        'form-control',
                        { 'border-red-300': formik.touched.newPassword && formik.errors.newPassword }
                      )}
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      <KeenIcon icon={showNewPassword ? "eye-slash" : "eye"} />
                    </button>
                  </label>
                  {formik.touched.newPassword && formik.errors.newPassword && (
                    <span role="alert" className="text-danger text-2xs mt-1">
                      {formik.errors.newPassword}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="form-label text-gray-900">Yeni Şifre (Tekrar)</label>
                  <label className="input">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Yeni şifrenizi tekrar girin"
                      autoComplete="new-password"
                      {...formik.getFieldProps('confirmPassword')}
                      className={clsx(
                        'form-control',
                        { 'border-red-300': formik.touched.confirmPassword && formik.errors.confirmPassword }
                      )}
                    />
                    <button
                      type="button"
                      className="btn btn-icon"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      <KeenIcon icon={showConfirmPassword ? "eye-slash" : "eye"} />
                    </button>
                  </label>
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <span role="alert" className="text-danger text-2xs mt-1">
                      {formik.errors.confirmPassword}
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || formik.isSubmitting}
                  >
                    {loading ? 'İşlem yapılıyor...' : 'Şifreyi Değiştir'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Güvenlik Önerileri</h3>
            </div>
            <div className="card-body">
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <KeenIcon icon="shield-check" className="text-success mt-0.5" />
                  <div>
                    <div className="text-2sm font-medium text-gray-900">Güçlü Şifre</div>
                    <div className="text-2xs text-gray-600">En az 8 karakter uzunluğunda</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <KeenIcon icon="key" className="text-primary mt-0.5" />
                  <div>
                    <div className="text-2sm font-medium text-gray-900">Karmaşık Yapı</div>
                    <div className="text-2xs text-gray-600">Büyük-küçük harf, rakam ve özel karakter</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <KeenIcon icon="time" className="text-warning mt-0.5" />
                  <div>
                    <div className="text-2sm font-medium text-gray-900">Düzenli Güncelleme</div>
                    <div className="text-2xs text-gray-600">Şifrenizi düzenli olarak değiştirin</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <KeenIcon icon="lock" className="text-danger mt-0.5" />
                  <div>
                    <div className="text-2sm font-medium text-gray-900">Gizli Tutun</div>
                    <div className="text-2xs text-gray-600">Şifrenizi kimseyle paylaşmayın</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement; 