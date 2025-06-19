import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components/keenicons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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

  // Minimum başvuru tarihi hesapla (bugünden 14 gün sonra)
  // Ana tarih hesaplama fonksiyonu - tek kaynak
  const getMinimumDate = (): Date => {
    const today = new Date();
    today.setDate(today.getDate() + 14);
    return today;
  };

  const getMinimumApplicationDate = (): string => {
    return getMinimumDate().toISOString().split('T')[0]; // YYYY-MM-DD formatında döndür
  };

  // Minimum tarihi human-readable formatta göster
  const getMinimumDateForDisplay = (): string => {
    return getMinimumDate().toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Date picker için tarihleri kısıtla
  const isDateDisabled = (date: Date): boolean => {
    const minimumDate = getMinimumDate();
    
    // Sadece tarih kısmını karşılaştır (saat bilgisini göz ardı et)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const minDateOnly = new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate());
    
    // Minimum tarih seçilebilir olmalı, ondan öncekiler seçilemez
    return dateOnly < minDateOnly;
  };

  // Kırmızı günler için custom day rendering
  const renderCustomDay = (day: number, date: Date) => {
    const isToday = date.toDateString() === new Date().toDateString();
    
    return (
      <span title={isToday ? '📅 Bugün' : ''}>
        {day}
      </span>
    );
  };

  // Date picker değer değişimi
  const handleDateChange = (date: Date | null) => {
    if (date && !isDateDisabled(date)) {
      // Timezone sorunu için local date formatı kullan
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      setFormData(prev => ({
        ...prev,
        startDate: formattedDate
      }));
    } else if (date && isDateDisabled(date)) {
      toast.error('⚠️ Bu tarih seçilemez! En az 14 gün sonrası seçiniz.');
    }
  };

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
      
      if (error.response?.status === 400) {
        // Validation hatalarını kullanıcıya göster
        const responseData = error.response.data;
        if (responseData?.message) {
          toast.error(`Validation Hatası: ${responseData.message}`);
        } else if (responseData?.errors) {
          const errorMessages = Object.values(responseData.errors).join(', ');
          toast.error(`Form Hatası: ${errorMessages}`);
        } else if (responseData?.violations) {
          const violationMessages = responseData.violations.map((v: any) => v.message).join(', ');
          toast.error(`Doğrulama Hatası: ${violationMessages}`);
        } else {
          toast.error('Gönderilen veriler geçersiz. Lütfen formu kontrol edin.');
        }
      } else if (error.response?.data) {
        toast.error(`Backend hatası: ${JSON.stringify(error.response.data)}`);
      } else {
        toast.error(`Başvuru gönderilirken hata: ${error.message || 'Bilinmeyen hata'}`);
      }
    }
  });

  // Tarih validasyonu fonksiyonu
  const validateStartDate = (dateString: string): boolean => {
    if (!dateString) return false;
    
    const selectedDate = new Date(dateString);
    const minimumDate = getMinimumDate();
    
    // Sadece tarih kısmını karşılaştır (saat bilgisini göz ardı et)
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const minDateOnly = new Date(minimumDate.getFullYear(), minimumDate.getMonth(), minimumDate.getDate());
    
    return selectedDateOnly >= minDateOnly;
  };

  // Form alanlarını güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Başlangıç tarihi kontrolü
    if (name === 'startDate' && value) {
      if (!validateStartDate(value)) {
        toast.error('⚠️ Staj başlangıç tarihi en az 14 gün sonrası olmalıdır!');
        return; // Geçersiz tarihi kaydetme
      }
    }
    
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
      // Province formatını değiştirmeden olduğu gibi gönder
      // Backend'in beklediği formatı bulana kadar
      console.log('🔄 Province formatting - Input:', provinceValue);
      
      // Türkiye il kodları genellikle büyük harfle tutulur
      const result = provinceValue.toUpperCase().trim();
      console.log('🔄 Province formatting - Output:', result);
      
      return result;
    };
    
    const formatWeeklyWorkingDays = (weeklyWorkingDays: string): number => {
      // Backend'de weeklyWorkingDays normal sayısal değer bekliyor: 5 veya 6
      const result = weeklyWorkingDays === 'FIVE_DAYS' ? 5 : 6;
      console.log('🔄 weeklyWorkingDays dönüştürme:', weeklyWorkingDays, '→', result);
      return result;
    };
    
    // Frontend validation önce
    const validationErrors: string[] = [];
    
    if (!formData.internshipId) validationErrors.push('Staj seçimi zorunludur');
    if (!formData.province) validationErrors.push('İl seçimi zorunludur');
    if (!formData.companyName.trim()) validationErrors.push('Şirket adı zorunludur');
    if (!formData.activityField.trim()) validationErrors.push('Faaliyet alanı zorunludur');
    if (!formData.companyEmail.trim()) validationErrors.push('Şirket e-postası zorunludur');
    if (!formData.companyPhone.trim()) validationErrors.push('Şirket telefonu zorunludur');
    if (!formData.companyAddress.trim()) validationErrors.push('Şirket adresi zorunludur');
    if (!formData.startDate) validationErrors.push('Başlangıç tarihi zorunludur');
    
    // 14 günlük kısıtlama kontrolü
    if (formData.startDate && !validateStartDate(formData.startDate)) {
      validationErrors.push('Staj başlangıç tarihi en az 14 gün sonrası olmalıdır');
    }
    
    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.companyEmail && !emailRegex.test(formData.companyEmail)) {
      validationErrors.push('Geçerli bir e-posta adresi giriniz');
    }
    
    // UUID format kontrolü
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (formData.internshipId && !uuidRegex.test(formData.internshipId)) {
      validationErrors.push('Geçersiz staj ID formatı');
    }
    
    if (validationErrors.length > 0) {
      toast.error(`Form hataları: ${validationErrors.join(', ')}`);
      return;
    }
    
    const submissionData: NewInternshipApplication = {
      internshipId: formData.internshipId,
      province: formatProvince(formData.province),
      companyName: formData.companyName.trim(),
      activityField: formData.activityField.trim(),
      companyEmail: formData.companyEmail.trim(),
      companyPhone: formData.companyPhone.trim(),
      companyAddress: formData.companyAddress.trim(),
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
    
    // Province debug bilgisi ekle
    console.log('🌍 Province Debug Info:');
    console.log('  Original province value:', formData.province);
    console.log('  Formatted province value:', formatProvince(formData.province));
    console.log('  Available provinces:', provinces.map(p => ({ value: p.value, label: p.label })));
    
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
    <>
      {/* CSS for disabled dates styling */}
      <style>{`
        /* React DatePicker Custom Styling */
        .react-datepicker-wrapper {
          width: 100%;
        }
        
        .react-datepicker__input-container input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-weight: 500;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .react-datepicker__input-container input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.25);
        }
        
        .react-datepicker__input-container input::placeholder {
          color: #9ca3af;
          opacity: 0.7;
        }
        
        /* DatePicker Popup Styling */
        .react-datepicker {
          border: 2px solid #ef4444;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.3);
          background: white;
        }
        
        .react-datepicker__header {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-bottom: none;
          border-radius: 10px 10px 0 0;
          color: white;
        }
        
        .react-datepicker__current-month {
          color: white;
          font-weight: bold;
          font-size: 16px;
        }
        
        .react-datepicker__day-name {
          color: white;
          font-weight: 600;
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
        }
        
        .react-datepicker__navigation {
          top: 12px;
        }
        
        .react-datepicker__navigation--previous {
          border-right-color: white;
        }
        
        .react-datepicker__navigation--next {
          border-left-color: white;
        }
        
        /* Beyaz günler (disabled) */
        .react-datepicker__day--disabled {
          background-color: #f9fafb !important;
          color: #9ca3af !important;
          font-weight: normal !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          cursor: not-allowed !important;
          position: relative;
        }
        
        .react-datepicker__day--disabled:hover {
          background-color: #f3f4f6 !important;
          transform: scale(1.05);
        }
        
        /* Seçilebilir günler */
        .react-datepicker__day:not(.react-datepicker__day--disabled) {
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .react-datepicker__day:not(.react-datepicker__day--disabled):hover {
          background-color: #dbeafe;
          color: #1e40af;
          transform: scale(1.1);
        }
        
        .react-datepicker__day--selected {
          background-color: #10b981 !important;
          color: white !important;
          font-weight: bold;
          border-radius: 6px;
        }
        
        .react-datepicker__day--today {
          background-color: #fbbf24;
          color: white;
          font-weight: bold;
          border-radius: 6px;
        }
        
        /* Kırmızı uyarı kutusu */
        .date-warning {
          animation: slideInLeft 0.4s ease-out;
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          border: 1px solid #ef4444;
          border-left: 4px solid #dc2626;
          padding: 12px 16px;
          border-radius: 8px;
          margin-top: 8px;
          box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.1);
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-20px);
          }
          to { 
            opacity: 1; 
            transform: translateX(0);
          }
        }
        
        /* Pulse efekti */
        .date-input-pulse {
          animation: pulseRed 2s infinite;
        }
        
        @keyframes pulseRed {
          0%, 100% { 
            border-color: #ef4444;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
          }
          50% { 
            border-color: #dc2626;
            box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
          }
        }
        
        /* Hover animasyonları */
        .react-datepicker__day--disabled:before {
          content: '🚫';
          position: absolute;
          top: -8px;
          right: -8px;
          font-size: 10px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .react-datepicker__day--disabled:hover:before {
          opacity: 1;
        }
      `}</style>
      
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-end">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium h-20 flex flex-col justify-start">
                  <span>Başlangıç Tarihi</span>
                  <span className="text-xs text-red-600 block mt-1">
                    ⚠️ En erken başlangıç tarihi: {getMinimumDateForDisplay()}
                  </span>
                  <span className="text-xs text-gray-500 block">
                    📅 Bugünden itibaren 14 gün sonrası seçilebilir
                  </span>
                </label>
                <DatePicker
                  selected={formData.startDate ? new Date(formData.startDate) : null}
                  onChange={handleDateChange}
                  filterDate={(date) => !isDateDisabled(date)}
                  minDate={new Date(getMinimumApplicationDate())}
                  placeholderText={`En erken: ${getMinimumDateForDisplay()}`}
                  dateFormat="dd/MM/yyyy"
                  locale="tr"
                  showPopperArrow={false}
                  className="w-full"
                  calendarClassName="custom-datepicker"
                  renderDayContents={renderCustomDay}
                  monthsShown={1}
                  showMonthDropdown={false}
                  showYearDropdown={false}
                  required
                />
                

              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium h-20 flex items-end">Haftalık Çalışma Gün Sayısı</label>
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
                <label className="mb-1 text-sm font-medium h-20 flex items-end">Toplam Süre</label>
                <input 
                  type="text" 
                  value={selectedInternshipDetail ? `${selectedInternshipDetail.durationOfDays} iş günü` : ''} 
                  className="border border-gray-300 rounded p-2 bg-gray-50" 
                  readOnly 
                  placeholder="Staj seçiniz"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium h-20 flex items-end">Bitiş Tarihi</label>
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
    </>
  );
};

export default InternshipApplicationPage;