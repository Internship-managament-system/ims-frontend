import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { KeenIcon } from '@/components/keenicons';
import Header from '@/layouts/eru/Header/Header';
import Footer from '@/layouts/eru/Footer/Footer';
import axios from 'axios';

interface Faculty {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  facultyId: string;
}

const ProfileSetup: React.FC = () => {
  const { currentUser, updateUser } = useAuthContext();
  const navigate = useNavigate();
  
  const [selectedFaculty, setSelectedFaculty] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [availableDepartments, setAvailableDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Kullanıcının zaten departman bilgisi varsa dashboard'a yönlendir
  useEffect(() => {
    if (currentUser && currentUser.departmentId && currentUser.departmentId !== '') {
      console.log('User already has department info, redirecting to dashboard');
      
      // Rol kontrolüyle birlikte yönlendirme
      if (currentUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (currentUser.role === 'COMMISSION_MEMBER') {
        navigate('/commission/dashboard', { replace: true });
      } else if (currentUser.role === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  // Fakülte ve bölüm verilerini yükle
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Backend'den fakülte ve bölüm verilerini çek
        const [facultiesResponse, departmentsResponse] = await Promise.all([
          axios.get('/api/v1/faculties'),
          axios.get('/api/v1/departments')
        ]);
        
        setFaculties(facultiesResponse.data.result || []);
        setDepartments(departmentsResponse.data.result || []);
        
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        // API hatası durumunda kullanıcıyı bilgilendir
        alert('Fakülte ve bölüm bilgileri yüklenirken hata oluştu. Sayfayı yenilemeyi deneyin.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Fakülte seçildiğinde o fakülteye ait bölümleri filtrele
  useEffect(() => {
    if (selectedFaculty) {
      const filtered = departments.filter(dept => dept.facultyId === selectedFaculty);
      setAvailableDepartments(filtered);
      setSelectedDepartment(''); // Bölüm seçimini sıfırla
    } else {
      setAvailableDepartments([]);
    }
  }, [selectedFaculty, departments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFaculty || !selectedDepartment) {
      alert('Lütfen fakülte ve bölüm seçimi yapınız.');
      return;
    }

    if (!currentUser?.id) {
      alert('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      navigate('/auth/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('🔍 Debug info:', {
        userId: currentUser.id,
        facultyId: selectedFaculty,
        departmentId: selectedDepartment,
        userRole: currentUser.role,
        userName: currentUser.name
      });

      // Auth context'teki updateUser fonksiyonunu kullan
      // Bu fonksiyon hem backend'i güncelleyecek hem de currentUser state'ini güncelleyecek
      await updateUser(currentUser.id, {
        facultyId: selectedFaculty,
        departmentId: selectedDepartment
      });

      console.log('Profile updated successfully via auth context');
      
      // Başarılı olursa kullanıcıyı dashboard'a yönlendir
      if (currentUser?.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (currentUser?.role === 'COMMISSION_MEMBER') {
        navigate('/commission/dashboard');
      } else if (currentUser?.role === 'STUDENT') {
        navigate('/student/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Profil güncelleme hatası:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Error handling
      let errorMessage = 'Profil bilgileri güncellenirken bir hata oluştu.';
      
      if (error.response?.status === 401) {
        errorMessage = 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.';
        navigate('/auth/login');
        return;
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data.message || 'Geçersiz bilgiler gönderildi.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#13126e] rounded-full"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="mb-4">
              <img
                src="/media/eru/erciyes-logo.png"
                alt="Erciyes Üniversitesi"
                className="h-16 w-16 mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Profil Kurulumu
            </h1>
            <p className="text-gray-600">
              Hoş geldiniz, <span className="font-medium text-[#13126e]">
                {currentUser?.name} {currentUser?.surname}
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Devam etmek için lütfen fakülte ve bölüm bilgilerinizi seçiniz.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fakülte Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fakülte <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e] appearance-none bg-white"
                  required
                >
                  <option value="">Fakülte seçiniz</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
                <KeenIcon 
                  icon="down" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                />
              </div>
            </div>

            {/* Bölüm Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bölüm <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#13126e] focus:border-[#13126e] appearance-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={!selectedFaculty}
                  required
                >
                  <option value="">
                    {selectedFaculty ? 'Bölüm seçiniz' : 'Önce fakülte seçiniz'}
                  </option>
                  {availableDepartments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
                <KeenIcon 
                  icon="down" 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
                />
              </div>
            </div>

            {/* Bilgi Kutusu */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start">
                <KeenIcon icon="information" className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800">
                    <strong>Önemli:</strong> Seçtiğiniz fakülte ve bölüm bilgileri sisteme kaydedilecektir. 
                    Bu bilgiler staj süreçlerinizde kullanılacağından doğru seçim yaptığınızdan emin olunuz.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !selectedFaculty || !selectedDepartment}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#13126e] hover:bg-[#1f1e7e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#13126e] disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></div>
                  Kaydediliyor...
                </>
              ) : (
                'Devam Et'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Teknik destek için: bmbb@erciyes.edu.tr
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfileSetup;