import React, { useState, useEffect } from 'react';
import { NewCommissionMember } from '@/services/commissionService';
import { useAuthContext } from '@/auth/useAuthContext';
import axios from 'axios';
import { getDepartmentById } from '@/services/commissionService';

// JWTProvider'dan GET_USER_URL'yi import et
const GET_USER_URL = `/api/v1/users/info`;

interface AddMemberModalProps {
  onClose: () => void;
  onAdd: (user: NewCommissionMember) => void;
  isLoading: boolean;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({ onClose, onAdd, isLoading }) => {
  // Kullanıcı bilgileri için state
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: ''
  });
  
  // Hata mesajları için state
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    surname: ''
  });
  
  // Departman bilgisi için state
  const [departmentInfo, setDepartmentInfo] = useState({
    id: '',
    name: ''
  });
  
  // Loading state
  const [isLoadingDepartment, setIsLoadingDepartment] = useState(false);
  
  // Auth context ile kullanıcı bilgilerini al
  const { currentUser } = useAuthContext();

  // Kullanıcı bilgilerini ve departman bilgisini al
  useEffect(() => {
    const fetchUserAndDepartmentInfo = async () => {
      if (!currentUser) return;
      
      setIsLoadingDepartment(true);
      
      try {
        // Güncel kullanıcı bilgilerini al
        const userResponse = await axios.get(GET_USER_URL);
        const userData = userResponse.data.result;
        
        // Departman ID'si varsa, departman bilgisini al
        if (userData?.departmentId) {
          try {
            const departmentData = await getDepartmentById(userData.departmentId as number);
            setDepartmentInfo({
              id: departmentData.id.toString(),
              name: departmentData.name
            });
          } catch (deptError) {
            console.error('Departman bilgisi alınamadı:', deptError);
          }
        }
      } catch (error) {
        console.error('Kullanıcı bilgisi alınamadı:', error);
      } finally {
        setIsLoadingDepartment(false);
      }
    };
    
    fetchUserAndDepartmentInfo();
  }, [currentUser]);

  // Form input değişiklikleri
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Input değiştiğinde ilgili hata mesajını temizle
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Form doğrulama
  const validateForm = (): boolean => {
    const newErrors = {
      email: '',
      name: '',
      surname: ''
    };
    
    let isValid = true;
    
    // Email doğrulama
    if (!formData.email) {
      newErrors.email = 'Email adresi gereklidir';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
      isValid = false;
    }
    
    // Ad doğrulama
    if (!formData.name) {
      newErrors.name = 'Ad gereklidir';
      isValid = false;
    }
    
    // Soyad doğrulama
    if (!formData.surname) {
      newErrors.surname = 'Soyad gereklidir';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Form gönderme
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Departman ID'si ile birlikte yeni üye verisini oluştur
    const newMemberData: any = {
      email: formData.email,
      name: formData.name,
      surname: formData.surname,
      departmentId: departmentInfo.id || currentUser?.departmentId
    };
    
    onAdd(newMemberData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Komisyon Üyesi Ekle
          </h3>
          <button 
            className="text-gray-500"
            onClick={onClose}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="ornek@erciyes.edu.tr" 
              className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 w-full`}
              disabled={isLoading}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Ad</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ad" 
              className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 w-full`}
              disabled={isLoading}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Soyad</label>
            <input 
              type="text" 
              name="surname"
              value={formData.surname}
              onChange={handleInputChange}
              placeholder="Soyad" 
              className={`border ${errors.surname ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 w-full`}
              disabled={isLoading}
            />
            {errors.surname && <p className="mt-1 text-xs text-red-500">{errors.surname}</p>}
          </div>
          
          {isLoadingDepartment ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
              Departman bilgisi yükleniyor...
            </div>
          ) : departmentInfo.id ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p>Departman: {departmentInfo.name}</p>
              <p className="text-xs italic">Kullanıcı kendi departmanınıza eklenecektir.</p>
            </div>
          ) : currentUser?.departmentId ? (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              <p>Departman: {currentUser.departmentName || 'Bilinmeyen Departman'}</p>
              <p className="text-xs italic">Kullanıcı kendi departmanınıza eklenecektir.</p>
            </div>
          ) : (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              <p>Uyarı: Departman bilginiz eksik!</p>
              <p className="text-xs italic">Lütfen yönetici ile iletişime geçin.</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2 pt-4">
            <button 
              type="button" 
              className="btn bg-gray-200 text-gray-800 py-2 px-4 rounded"
              onClick={onClose}
              disabled={isLoading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              className={`btn ${isLoading ? 'bg-indigo-400' : 'bg-[#13126e]'} text-white py-2 px-4 rounded flex items-center justify-center`}
              disabled={isLoading || (!departmentInfo.id && !currentUser?.departmentId)}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kaydediliyor...
                </>
              ) : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;