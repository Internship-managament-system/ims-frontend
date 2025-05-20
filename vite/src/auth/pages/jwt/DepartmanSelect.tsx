import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/auth/useAuthContext';
import { KeenIcon } from '@/components';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';
import axios from 'axios';
import * as authHelper from '@/auth/_helpers';

// Backend'den dinamik olarak alınabilir
const departments = [
  { value: '', label: 'Bölüm Seçiniz' },
  { value: '3fa85f64-5717-4562-b3fc-2c963f66afa6', label: 'Bilgisayar Mühendisliği' },
  { value: '4fa85f64-5717-4562-b3fc-2c963f66afa7', label: 'Elektrik-Elektronik Mühendisliği' },
  { value: '5fa85f64-5717-4562-b3fc-2c963f66afa8', label: 'İnşaat Mühendisliği' },
  { value: '6fa85f64-5717-4562-b3fc-2c963f66afa9', label: 'Makine Mühendisliği' },
  { value: '7fa85f64-5717-4562-b3fc-2c963f66afaa', label: 'Endüstri Mühendisliği' },
  { value: '8fa85f64-5717-4562-b3fc-2c963f66afab', label: 'Kimya Mühendisliği' },
  { value: '9fa85f64-5717-4562-b3fc-2c963f66afac', label: 'Çevre Mühendisliği' }
];

const DepartmentSelect: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, updateUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
    if (!currentUser) {
      navigate('/auth/login');
      return;
    }
    
    // Kullanıcının zaten departmanı varsa rolüne göre dashboard'a yönlendir
    if (currentUser.departmentId) {
      if (currentUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (currentUser.role === 'COMMISSION_MEMBER') {
        navigate('/commission/dashboard', { replace: true });
      } else if (currentUser.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
      return;
    }
    
    // Sayfa yüklendiğinde header düzenlemelerini yap
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
    
    fixHeader();
    const timeoutId = setTimeout(fixHeader, 100);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, [currentUser, navigate]);

  // Axios interceptor'ı ekleyerek yetkilendirme hatalarını global olarak yakalayalım
  useEffect(() => {
    // Response interceptor
    const interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        // 401 veya 403 hatası alırsak, hatayı göster ama otomatik yönlendirmeyi engelle
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.error('Yetkilendirme hatası:', error.response.data);
          // Hata durumunda yapılacak işlem burada tanımlanabilir
          // Örneğin token yenileme gibi
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );
    
    // Cleanup
    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDepartment) {
      setError('Lütfen bir bölüm seçiniz');
      return;
    }
    
    if (!currentUser || !currentUser.id) {
      setError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapınız.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Departman bilgisini güncelle
      await updateDepartment(currentUser.id, selectedDepartment);
      
      // Kullanıcı bilgilerini güncelle - updateUser fonksiyonunu düzgün şekilde çağırıyoruz
      if (updateUser) {
        try {
          // Güncellenen bilgileri içeren nesneyi gönder
          await updateUser(currentUser.id, { departmentId: selectedDepartment });
        } catch (updateError) {
          console.error('Kullanıcı bilgileri güncellenirken hata:', updateError);
          // Bu hata kullanıcıya engel olmaz, sadece log edilir
        }
      }
      
      // Başarılı ise ana sayfaya yönlendir
      navigate('/');
    } catch (error) {
      console.error('Department update error:', error);
      
      // Axios hatasını daha detaylı işle
      if (axios.isAxiosError(error) && error.response) {
        // Sunucu yanıtı varsa, detayları göster
        const errorMessage = error.response.data?.message || 
                            error.response.data?.error || 
                            `Hata kodu: ${error.response.status} - ${error.response.statusText}`;
        setError(errorMessage);
      } else {
        // Genel hata
        setError('Bölüm bilgisi güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Departman güncelleme fonksiyonu
  const updateDepartment = async (userId: string, departmentId: string) => {
    try {
      // JWT token'ı al
      const token = authHelper.getAuth()?.access_token;
      
      if (!token) {
        throw new Error('Kimlik doğrulama bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      }
      
      // UUID formatında userId gönderildiğinden emin olalım
      await axios.put(`/api/v1/users/${userId}/update`, 
        { departmentId }, 
        { 
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      console.log('Departman başarıyla güncellendi.');
      return true;
    } catch (error) {
      console.error('Error updating department:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Content */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <KeenIcon icon="building" className="text-[#13126e] text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Bölüm Seçimi</h2>
            <p className="text-gray-600 mt-2">
              Staj başvurularınızı yönetebilmek için lütfen bölümünüzü seçin.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                Bölümünüz
              </label>
              <div className="relative">
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="appearance-none block w-full bg-white border border-gray-300 rounded py-3 px-4 pr-8 leading-tight focus:outline-none focus:border-[#13126e]"
                  required
                >
                  {departments.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <KeenIcon icon="down" className="fill-current h-4 w-4" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="w-full bg-[#13126e] text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 hover:bg-opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    İşleniyor...
                  </span>
                ) : (
                  "Devam Et"
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Sonrasında profilinizden bölüm bilginizi değiştirebilirsiniz.
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DepartmentSelect;