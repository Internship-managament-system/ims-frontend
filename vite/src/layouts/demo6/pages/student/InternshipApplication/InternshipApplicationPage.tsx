import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { 
  createInternshipApplication, 
  NewInternshipApplication, 
  getInternships,
  Internship,
  getInternshipDetail,
  InternshipDetail
} from '@/services/internshipService';
import { getProvinces } from '@/services/formOptionsService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@/auth/useAuthContext';
import { useNavigate } from 'react-router-dom';

// Form için ayrı interface (UI'da string değerler kullanıyoruz)
interface InternshipApplicationFormData {
  internshipId: string;
  province: string;
  companyName: string;
  activityField: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  startDate: string;
  weeklyWorkingDays: 'FIVE_DAYS' | 'SIX_DAYS';
  hasGeneralHealthInsurance: boolean;
  applicationType: 'VOLUNTARY' | 'MANDATORY';
  endDate?: string;
  durationInDays?: number;
}

const InternshipApplicationPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<InternshipApplicationFormData>({
    internshipId: '',
    province: '',
    companyName: '',
    activityField: '',
    companyEmail: '',
    companyPhone: '',
    companyAddress: '',
    startDate: '',
    weeklyWorkingDays: 'FIVE_DAYS',
    hasGeneralHealthInsurance: false,
    applicationType: 'VOLUNTARY',
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [selectedInternshipDetail, setSelectedInternshipDetail] = useState<InternshipDetail | null>(null);

  // Kullanıcı bilgilerini al
  const auth = useAuthContext();
  const userId = auth.currentUser?.id || '';

  // Stajları getir
  const { data: internships = [], isLoading: internshipsLoading, error: internshipsError } = useQuery({
    queryKey: ['internships'],
    queryFn: getInternships
  });

  useEffect(() => {
    document.title = 'Staj Başvurusu | Staj Yönetim Sistemi';
  }, []);

  // Sadece iller için getProvinces fonksiyonu ve provinces state'i bırakıldı
  useEffect(() => {
    getProvinces().then((res: any) => setProvinces(res || []));
  }, []);

  // Başlangıç tarihi ve staj süresine göre bitiş tarihini hesapla
  const calculateEndDateFromDuration = (startDate: string, durationInDays: number, weeklyWorkingDays: 'FIVE_DAYS' | 'SIX_DAYS'): string => {
    if (!startDate || !durationInDays) return '';
    
    const start = new Date(startDate);
    let workingDaysCount = 0;
    let currentDate = new Date(start);
    
    const workingDaysPerWeek = weeklyWorkingDays === 'FIVE_DAYS' ? 5 : 6;
    
    // Toplam iş günü sayısına ulaşana kadar günleri say
    while (workingDaysCount < durationInDays) {
      const dayOfWeek = currentDate.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
      
      if (workingDaysPerWeek === 5) {
        // 5 gün çalışma: Pazartesi-Cuma (1-5)
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          workingDaysCount++;
        }
      } else {
        // 6 gün çalışma: Pazartesi-Cumartesi (1-6)
        if (dayOfWeek >= 1 && dayOfWeek <= 6) {
          workingDaysCount++;
        }
      }
      
      // Hedef iş günü sayısına ulaşmadıysa bir sonraki güne geç
      if (workingDaysCount < durationInDays) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return currentDate.toISOString().split('T')[0];
  };

  // Staj seçilince detayını getir
  useEffect(() => {
    if (formData.internshipId) {
      getInternshipDetail(formData.internshipId)
        .then(detail => {
          setSelectedInternshipDetail(detail);
        })
        .catch(error => {
          console.error('Staj detayı getirme hatası:', error);
          setSelectedInternshipDetail(null);
        });
    } else {
      setSelectedInternshipDetail(null);
    }
  }, [formData.internshipId]);

  // Staj başvurusu oluşturma mutation'ı
  const createApplicationMutation = useMutation({
    mutationFn: (applicationData: NewInternshipApplication) => 
      createInternshipApplication(applicationData),
    onSuccess: () => {
      toast.success('Staj başvurunuz başarıyla oluşturuldu!');
      resetForm();
      navigate('/student/my-applications');
    },
    onError: (error: any) => {
      console.error('🚨 Mutation hatası:', error);
      console.error('🚨 Error response:', error.response);
      console.error('🚨 Error response data:', error.response?.data);
      console.error('🚨 Error status:', error.response?.status);
      
      if (error.response?.data) {
        toast.error(`Backend hatası: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error(`Başvuru gönderilirken hata: ${error.message || 'Bilinmeyen hata'}`);
      }
    }
  });

  // Form alanlarını güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: isChecked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'weeklyWorkingDays'
          ? (value === 'FIVE_DAYS' || value === 'SIX_DAYS'
              ? (value as 'FIVE_DAYS' | 'SIX_DAYS')
              : 'FIVE_DAYS')
          : value
      }));
    }
  };

  // Formu gönder
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast.error('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
      return;
    }
    
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    const formatProvince = (provinceValue: string) => {
      if (provinceValue === provinceValue.toUpperCase()) {
        return provinceValue;
      }
      return provinceValue.toUpperCase();
    };
    
    const formatWeeklyWorkingDays = (weeklyWorkingDays: string): number => {
      // Backend'de weeklyWorkingDays normal sayısal değer bekliyor: 5 veya 6
      const result = weeklyWorkingDays === 'FIVE_DAYS' ? 5 : 6;
      console.log('🔄 weeklyWorkingDays dönüştürme:', weeklyWorkingDays, '→', result);
      return result;
    };
    
    const submissionData: NewInternshipApplication = {
      internshipId: formData.internshipId,
      province: formatProvince(formData.province),
      companyName: formData.companyName,
      activityField: formData.activityField,
      companyEmail: formData.companyEmail,
      companyPhone: formData.companyPhone,
      companyAddress: formData.companyAddress,
      startDate: formatDate(formData.startDate),
      weeklyWorkingDays: formatWeeklyWorkingDays(formData.weeklyWorkingDays),
      hasGeneralHealthInsurance: formData.hasGeneralHealthInsurance,
      applicationType: formData.applicationType,
    };
    
    console.log('📝 Form verisi (raw):', formData);
    console.log('📤 API\'ye gönderilecek veri:', submissionData);
    console.log('🔍 applicationType:', formData.applicationType);
    console.log('🔍 weeklyWorkingDays (transformed):', formatWeeklyWorkingDays(formData.weeklyWorkingDays));
    
    // Field'ları tek tek kontrol edelim
    console.log('🔍 Tüm field kontrolleri:');
    console.log('  ✓ internshipId:', submissionData.internshipId, typeof submissionData.internshipId);
    console.log('  ✓ province:', submissionData.province, typeof submissionData.province);
    console.log('  ✓ companyName:', submissionData.companyName, typeof submissionData.companyName);
    console.log('  ✓ activityField:', submissionData.activityField, typeof submissionData.activityField);
    console.log('  ✓ companyEmail:', submissionData.companyEmail, typeof submissionData.companyEmail);
    console.log('  ✓ companyPhone:', submissionData.companyPhone, typeof submissionData.companyPhone);
    console.log('  ✓ companyAddress:', submissionData.companyAddress, typeof submissionData.companyAddress);
    console.log('  ✓ startDate:', submissionData.startDate, typeof submissionData.startDate);
    console.log('  ✓ weeklyWorkingDays:', submissionData.weeklyWorkingDays, typeof submissionData.weeklyWorkingDays);
    console.log('  ✓ hasGeneralHealthInsurance:', submissionData.hasGeneralHealthInsurance, typeof submissionData.hasGeneralHealthInsurance);
    console.log('  ✓ applicationType:', submissionData.applicationType, typeof submissionData.applicationType);
    
    createApplicationMutation.mutate(submissionData);
  };

  // Formu sıfırla
  const resetForm = () => {
    setFormData({
      internshipId: '',
      province: '',
      companyName: '',
      activityField: '',
      companyEmail: '',
      companyPhone: '',
      companyAddress: '',
      startDate: '',
      weeklyWorkingDays: 'FIVE_DAYS',
      hasGeneralHealthInsurance: false,
      applicationType: 'VOLUNTARY',
    });
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="container mx-auto pt-6 pb-20 px-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-2">
            Staj Başvurusu
          </h1>
          <p className="text-gray-600">
            Staja başvurmak için aşağıdaki formu doldurun ve gerekli bilgileri girin.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Staj Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Staj Türü</label>
                <select
                  name="applicationType"
                  value={formData.applicationType}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                  required
                >
                  <option value="VOLUNTARY">Gönüllü</option>
                  <option value="MANDATORY">Zorunlu</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Staj</label>
                <select
                  name="internshipId"
                  value={formData.internshipId}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                  required
                >
                  <option value="">Staj Seçiniz</option>
                  {internshipsLoading ? (
                    <option disabled>Stajlar yükleniyor...</option>
                  ) : internshipsError ? (
                    <option disabled>Stajlar yüklenirken hata oluştu</option>
                  ) : (
                    internships.map((intern: Internship) => (
                      <option key={intern.id} value={intern.id}>{intern.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">İş Yeri Bilgileri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">İl</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                  required
                >
                  <option value="">İl Seçiniz</option>
                  {provinces.map((province: any) => (
                    <option key={province.value} value={province.value}>{province.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Şirket Adı</label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} className="border border-gray-300 rounded p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Faaliyet Alanı</label>
                <input type="text" name="activityField" value={formData.activityField} onChange={handleInputChange} className="border border-gray-300 rounded p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Şirket E-posta</label>
                <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} className="border border-gray-300 rounded p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Şirket Telefon</label>
                <input type="tel" name="companyPhone" value={formData.companyPhone} onChange={handleInputChange} className="border border-gray-300 rounded p-2" required />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="mb-1 text-sm font-medium">Şirket Adresi</label>
                <textarea name="companyAddress" value={formData.companyAddress} onChange={handleInputChange} className="border border-gray-300 rounded p-2" rows={3} required />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium mb-4">Staj Tarihleri ve Çalışma Günleri</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Başlangıç Tarihi</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="border border-gray-300 rounded p-2" required />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Haftalık Çalışma Gün Sayısı</label>
                <select
                  name="weeklyWorkingDays"
                  value={formData.weeklyWorkingDays}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2"
                  required
                >
                  <option value="FIVE_DAYS">5 Gün</option>
                  <option value="SIX_DAYS">6 Gün</option>
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Toplam Süre</label>
                <input 
                  type="text" 
                  value={selectedInternshipDetail ? `${selectedInternshipDetail.durationOfDays} iş günü` : ''} 
                  className="border border-gray-300 rounded p-2 bg-gray-50" 
                  readOnly 
                  placeholder="Staj seçiniz"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Bitiş Tarihi</label>
                <input 
                  type="text" 
                  value={
                    formData.startDate && selectedInternshipDetail 
                      ? new Date(calculateEndDateFromDuration(formData.startDate, selectedInternshipDetail.durationOfDays, formData.weeklyWorkingDays)).toLocaleDateString('tr-TR')
                      : ''
                  } 
                  className="border border-gray-300 rounded p-2 bg-gray-50" 
                  readOnly 
                  placeholder="Başlangıç tarihi giriniz"
                />
              </div>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="hasGeneralHealthInsurance" name="hasGeneralHealthInsurance" checked={formData.hasGeneralHealthInsurance} onChange={handleInputChange} className="mr-2" />
              <label htmlFor="hasGeneralHealthInsurance" className="text-sm">Genel Sağlık Sigortam var</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-8">
            <button type="reset" onClick={resetForm} className="bg-gray-200 text-gray-800 py-2 px-6 rounded font-medium">Sıfırla</button>
            <button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-6 rounded font-medium" 
              disabled={createApplicationMutation.isPending}
            >
              {createApplicationMutation.isPending ? 'Gönderiliyor...' : 'Başvuru Yap'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InternshipApplicationPage;