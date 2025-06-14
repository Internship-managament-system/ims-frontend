import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { 
  createInternshipApplication, 
  updateInternshipApplication,
  getInternshipApplicationById,
  NewInternshipApplication, 
  InternshipType,
  calculateDurationInDays,
  getInternships,
  Internship,
  getInternshipDetail,
  InternshipDetail
} from '@/services/internshipService';
import { getAllDepartments } from '@/services/departmentService';
import { getProvinces } from '@/services/formOptionsService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@/auth/useAuthContext';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Form için ayrı interface (UI'da string değerler kullanıyoruz)
interface InternshipApplicationFormData {
  internshipId: string;
  workplaceName: string;
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
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const isUpdate = location.state?.isUpdate || id ? true : false;
  const applicationData = location.state?.application || null;
  
  const [formData, setFormData] = useState<InternshipApplicationFormData>({
    internshipId: '',
    workplaceName: '',
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
  const [weeklyWorkingDaysOptions, setWeeklyWorkingDaysOptions] = useState([]);
  const [selectedInternshipDetail, setSelectedInternshipDetail] = useState<InternshipDetail | null>(null);

  // Kullanıcı bilgilerini al
  const auth = useAuthContext();
  const userId = auth.currentUser?.id || '';
  const userDepartmentId = auth.currentUser?.departmentId || '';

  // Departmanları getir
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
  });

  // Stajları getir
  const { data: internships = [], isLoading: internshipsLoading, error: internshipsError } = useQuery({
    queryKey: ['internships'],
    queryFn: getInternships
  });

  // Kullanıcının bölüm bilgisini form verilerine otomatik olarak set et
  useEffect(() => {
    if (userDepartmentId) {
      setFormData(prev => ({
        ...prev,
        departmentId: userDepartmentId
      }));
    }
  }, [userDepartmentId]);

  useEffect(() => {
    document.title = 'Staj Başvurusu | Staj Yönetim Sistemi';
  }, []);

  // Tarihleri hesaplamak için bugünün tarihini al
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  
  // İki hafta sonrası için varsayılan bitiş tarihi
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 14);
  const twoWeeksLaterFormatted = twoWeeksLater.toISOString().split('T')[0];

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

  // Tarih değiştiğinde veya haftalık çalışma günü değiştiğinde staj süresini otomatik hesapla
  useEffect(() => {
    if (formData.startDate) {
      // Bitiş tarihini hesapla
      const endDate = calculateEndDateFromDuration(formData.startDate, formData.durationInDays || 0, formData.weeklyWorkingDays);
      
      // Staj süresini hesapla - iş günlerini (hafta içi günleri) say
      let duration = 0;
      if (endDate) {
        // Güncellenmiş calculateDurationInDays fonksiyonunu kullan
        duration = calculateDurationInDays(formData.startDate, endDate, formData.weeklyWorkingDays);
      }
      
      // Form verilerini güncelle
      setFormData(prev => ({
        ...prev,
        endDate: endDate,
        durationInDays: duration
      }));
    }
  }, [formData.startDate, formData.weeklyWorkingDays, formData.durationInDays]);

  // Başvuru detayını getir (eğer güncelleme modundaysa)
  const { data: applicationDetail, isLoading: applicationLoading } = useQuery({
    queryKey: ['internship-application', id],
    queryFn: () => getInternshipApplicationById(id as string),
    enabled: !!id && isUpdate && !applicationData
  });

  // Başvuru detayı geldiğinde form verilerini doldur
  useEffect(() => {
    if (applicationDetail) {
      setFormData({
        internshipId: applicationDetail.internshipId || '',
        workplaceName: applicationDetail.workplaceName || '',
        province: applicationDetail.province || '',
        companyName: (applicationDetail as any).companyName || '',
        activityField: applicationDetail.activityField || '',
        companyEmail: (applicationDetail as any).companyEmail || '',
        companyPhone: (applicationDetail as any).companyPhone || '',
        companyAddress: (applicationDetail as any).companyAddress || '',
        startDate: applicationDetail.startDate ? new Date(applicationDetail.startDate).toISOString().split('T')[0] : '',
        weeklyWorkingDays: (typeof applicationDetail.weeklyWorkingDays === 'number' 
          ? (applicationDetail.weeklyWorkingDays === 5 ? 'FIVE_DAYS' : 'SIX_DAYS')
          : (applicationDetail.weeklyWorkingDays as 'FIVE_DAYS' | 'SIX_DAYS')) || 'FIVE_DAYS',
        hasGeneralHealthInsurance: applicationDetail.hasGeneralHealthInsurance || false,
        applicationType: (applicationDetail as any).applicationType || 'VOLUNTARY',
      });
    }
  }, [applicationDetail]);

  // Eğer başvuru verisi prop olarak geldiyse form verilerini doldur
  useEffect(() => {
    if (applicationData && isUpdate) {
      setFormData({
        internshipId: applicationData.internshipId || '',
        workplaceName: applicationData.workplaceName || '',
        province: applicationData.province || '',
        companyName: (applicationData as any).companyName || '',
        activityField: applicationData.activityField || '',
        companyEmail: (applicationData as any).companyEmail || '',
        companyPhone: (applicationData as any).companyPhone || '',
        companyAddress: (applicationData as any).companyAddress || '',
        startDate: applicationData.startDate ? new Date(applicationData.startDate).toISOString().split('T')[0] : '',
        weeklyWorkingDays: (typeof applicationData.weeklyWorkingDays === 'number' 
          ? (applicationData.weeklyWorkingDays === 5 ? 'FIVE_DAYS' : 'SIX_DAYS')
          : (applicationData.weeklyWorkingDays as 'FIVE_DAYS' | 'SIX_DAYS')) || 'FIVE_DAYS',
        hasGeneralHealthInsurance: applicationData.hasGeneralHealthInsurance || false,
        applicationType: (applicationData as any).applicationType || 'VOLUNTARY',
      });
    }
  }, [applicationData, isUpdate]);

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
    },
    onError: (error: any) => {
      console.error('Mutation hatası:', error);
      if (error.response) {
        console.error('Hata detayları:', error.response);
      }
      toast.error(`Başvuru gönderilirken hata: ${error.message || 'Bilinmeyen hata'}`);
    }
  });

  // Staj başvurusu güncelleme mutation'ı
  const updateApplicationMutation = useMutation({
    mutationFn: (data: NewInternshipApplication) => 
      updateInternshipApplication(id as string, data),
    onSuccess: () => {
      toast.success('Staj başvurunuz başarıyla güncellendi!');
      navigate('/student/my-applications');
    },
    onError: (error: any) => {
      console.error('Güncelleme hatası:', error);
      toast.error(`Güncelleme sırasında hata: ${error.message || 'Bilinmeyen hata'}`);
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
      // Backend'de weeklyWorkingDays sayısal değer bekliyor
      // FIVE_DAYS = 5, SIX_DAYS = 6 olarak dönüştürüyoruz
      return weeklyWorkingDays === 'FIVE_DAYS' ? 5 : 6;
    };
    
    const submissionData: NewInternshipApplication = {
      internshipId: formData.internshipId,
      workplaceName: formData.workplaceName,
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
    
    console.log(`Staj başvurusu ${isUpdate ? 'güncelleniyor' : 'gönderiliyor'}:`, submissionData);
    
    if (isUpdate && id) {
      updateApplicationMutation.mutate(submissionData);
    } else {
      createApplicationMutation.mutate(submissionData);
    }
  };

  // Formu sıfırla
  const resetForm = () => {
    setFormData({
      internshipId: '',
      workplaceName: '',
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
            {isUpdate ? 'Staj Başvurusu Güncelleme' : 'Staj Başvurusu'}
          </h1>
          <p className="text-gray-600">
            {isUpdate 
              ? 'Staj başvurunuzu güncellemek için formu düzenleyin ve güncelleyin.' 
              : 'Staja başvurmak için aşağıdaki formu doldurun ve gerekli bilgileri girin.'}
          </p>
        </div>

        {(applicationLoading) ? (
          <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
            <div className="animate-spin mr-3">
              <KeenIcon icon="spinner" className="h-6 w-6 text-primary" />
            </div>
            <span>Veriler yükleniyor...</span>
          </div>
        ) : (
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
                  <label className="mb-1 text-sm font-medium">İş Yeri Adı</label>
                  <input type="text" name="workplaceName" value={formData.workplaceName} onChange={handleInputChange} className="border border-gray-300 rounded p-2" required />
                </div>
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
              <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded font-medium" disabled={createApplicationMutation.isPending}>{createApplicationMutation.isPending ? 'Gönderiliyor...' : 'Başvuru Yap'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InternshipApplicationPage;