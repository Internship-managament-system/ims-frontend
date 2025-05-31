import React, { useState, useEffect } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { 
  createInternshipApplication, 
  NewInternshipApplication, 
  InternshipType,
  calculateDurationInDays
} from '@/services/internshipService';
import { getAllDepartments } from '@/services/departmentService';
import {
  getAllFormOptions,
  SelectOption
} from '@/services/formOptionsService';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useAuthContext } from '@/auth/useAuthContext';

const InternshipApplicationPage: React.FC = () => {
  const [formData, setFormData] = useState<Omit<NewInternshipApplication, 'studentId'> & { durationInDays: number }>({
    departmentId: '',
    program: '',
    internshipPeriod: '',
    workplaceName: '',
    province: '',
    activityField: '',
    workplaceEmail: '',
    workplacePhone: '',
    workplaceAddress: '',
    startDate: '',
    endDate: '',
    durationInDays: 0,
    weeklyWorkingDays: 'FIVE_DAYS',
    hasGeneralHealthInsurance: false,
    internshipType: 'VOLUNTARY' as InternshipType
  });

  // Kullanıcı bilgilerini al
  const auth = useAuthContext();
  const userId = auth.currentUser?.id || '';
  const userDepartmentId = auth.currentUser?.departmentId || '';

  // Departmanları getir
  const { data: departments = [] } = useQuery({
    queryKey: ['departments'],
    queryFn: getAllDepartments
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

  // Form seçeneklerini getir
  const { data: formOptions, isLoading: optionsLoading, error: optionsError } = useQuery({
    queryKey: ['form-options'],
    queryFn: getAllFormOptions,
    // Hata durumunda tekrar deneme seçenekleri
    retry: 3,
    retryDelay: 1000,
    // Cache süresini belirleme
    staleTime: 1000 * 60 * 5 // 5 dakika
  });

  // Form seçenekleri yüklenirken hata olursa
  useEffect(() => {
    if (optionsError) {
      console.error('Form seçenekleri yüklenirken hata:', optionsError);
      toast.error('Form seçenekleri yüklenemedi. Lütfen sayfayı yenileyin.');
    }
  }, [optionsError]);

  // Yükleme durumunda ve opsiyonlar gelmezse varsayılan değerler
  const provinces = formOptions?.provinces || [];
  const programTypes = formOptions?.programTypes || [];
  const internshipTypes = formOptions?.internshipTypes || [];
  const internshipPeriods = formOptions?.internshipPeriods || [];
  const weeklyWorkingDays = formOptions?.weeklyWorkingDays || [];

  // Başlangıç tarihi ve haftalık çalışma günlerine göre bitiş tarihini hesapla
  const calculateEndDate = (startDate: string, weeklyWorkDaysOption: string): string => {
    if (!startDate) return '';
    
    // Haftalık çalışma günlerini belirle (5 gün veya 6 gün)
    const workingDaysNumber = weeklyWorkDaysOption === 'FIVE_DAYS' ? 5 : 6;
    
    const start = new Date(startDate);
    let workingDaysCount = 0;
    let currentDate = new Date(start);
    
    // 20 iş günü tamamlanana kadar günleri say
    while (workingDaysCount < 20) {
      const dayOfWeek = currentDate.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
      
      if (workingDaysNumber === 5) {
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
      
      // 20 iş günü tamamlanmadıysa bir sonraki güne geç
      if (workingDaysCount < 20) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    // ISO formatında tarihi döndür (YYYY-MM-DD)
    return currentDate.toISOString().split('T')[0];
  };

  // Tarih değiştiğinde veya haftalık çalışma günü değiştiğinde staj süresini otomatik hesapla
  useEffect(() => {
    if (formData.startDate) {
      // Bitiş tarihini hesapla
      const endDate = calculateEndDate(formData.startDate, formData.weeklyWorkingDays);
      
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
  }, [formData.startDate, formData.weeklyWorkingDays]);

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
        [name]: value
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
    
    // Tarihleri doğru formata çevir (YYYY-MM-DD)
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };
    
    // Province değerini düzgün formata çevir (backend ENUM bekliyor - ANKARA, ISTANBUL gibi)
    const formatProvince = (provinceValue: string) => {
      // Eğer zaten büyük harfli ise olduğu gibi döndür
      if (provinceValue === provinceValue.toUpperCase()) {
        return provinceValue;
      }
      
      // Değilse büyük harfe çevir
      return provinceValue.toUpperCase();
    };
    
    // API'ye gönderilecek veriyi hazırla - Swagger belgesine göre
    const applicationData: NewInternshipApplication = {
      studentId: userId,
      departmentId: formData.departmentId,
      program: formData.program,
      internshipPeriod: formData.internshipPeriod,
      workplaceName: formData.workplaceName,
      province: formatProvince(formData.province), // Enum değeri olarak gönderilmeli (ANKARA, ISTANBUL vb.)
      activityField: formData.activityField,
      workplaceEmail: formData.workplaceEmail,
      workplacePhone: formData.workplacePhone,
      workplaceAddress: formData.workplaceAddress,
      startDate: formatDate(formData.startDate),
      endDate: formatDate(formData.endDate),
      weeklyWorkingDays: formData.weeklyWorkingDays,
      hasGeneralHealthInsurance: formData.hasGeneralHealthInsurance,
      internshipType: formData.internshipType
    };
    
    console.log('Staj başvurusu gönderiliyor:', applicationData);
    
    // Formu gönder
    createApplicationMutation.mutate(applicationData);
  };

  // Formu sıfırla
  const resetForm = () => {
    setFormData({
      departmentId: '',
      program: '',
      internshipPeriod: '',
      workplaceName: '',
      province: '',
      activityField: '',
      workplaceEmail: '',
      workplacePhone: '',
      workplaceAddress: '',
      startDate: '',
      endDate: '',
      durationInDays: 0,
      weeklyWorkingDays: 'FIVE_DAYS',
      hasGeneralHealthInsurance: false,
      internshipType: 'VOLUNTARY'
    });
  };

  return (
    <div className="min-h-screen bg-white pb-16">
      <div className="container mx-auto pt-6 pb-20 px-6">
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-2">Staj Başvurusu</h1>
          <p className="text-gray-600">
            Staja başvurmak için aşağıdaki formu doldurun ve gerekli bilgileri girin.
          </p>
        </div>

        {optionsLoading ? (
          <div className="flex items-center justify-center p-8 bg-white rounded-lg shadow">
            <div className="animate-spin mr-3">
              <KeenIcon icon="spinner" className="h-6 w-6 text-primary" />
            </div>
            <span>Form seçenekleri yükleniyor...</span>
          </div>
        ) : optionsError ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <KeenIcon icon="error" className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Form seçenekleri yüklenemedi</h3>
            <p className="text-gray-600 mb-4">Form seçeneklerini getirirken bir hata oluştu. Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#13126e] text-white py-2 px-4 rounded"
            >
              Sayfayı Yenile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Staj Bilgileri */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Staj Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Bölüm</label>
                  <select
                    name="departmentId"
                    value={formData.departmentId}
                    disabled
                    className="border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
                    required
                  >
                    <option value="">Bölüm Seçiniz</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                  <small className="text-gray-500 mt-1">Bölüm bilgisi kullanıcı profilinden otomatik olarak alınmaktadır.</small>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Program</label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  >
                    <option value="">Program Seçiniz</option>
                    {programTypes.map(program => (
                      <option key={program.value} value={program.value}>{program.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Staj Dönemi</label>
                  <select
                    name="internshipPeriod"
                    value={formData.internshipPeriod}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  >
                    <option value="">Dönem Seçiniz</option>
                    {internshipPeriods.map(period => (
                      <option key={period.value} value={period.value}>{period.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Staj Türü</label>
                  <select
                    name="internshipType"
                    value={formData.internshipType}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  >
                    <option value="">Staj Türü Seçiniz</option>
                    {internshipTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="hasGeneralHealthInsurance"
                    name="hasGeneralHealthInsurance"
                    checked={formData.hasGeneralHealthInsurance}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        hasGeneralHealthInsurance: e.target.checked
                      }));
                    }}
                    className="mr-2"
                  />
                  <label htmlFor="hasGeneralHealthInsurance" className="text-sm">
                    Genel Sağlık Sigortam var
                  </label>
                </div>
              </div>
            </div>

            {/* Şirket Bilgileri */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">İş Yeri Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">İş Yeri Adı</label>
                  <input
                    type="text"
                    name="workplaceName"
                    value={formData.workplaceName}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">İl/Ülke</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  >
                    <option value="">İl/Ülke Seçiniz</option>
                    {provinces.map(province => (
                      <option key={province.value} value={province.value}>{province.label}</option>
                    ))}
                  </select>
                  <small className="text-gray-500 mt-1">Backend'e ENUM formatında gönderilecektir (ör: ANKARA)</small>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Faaliyet Alanı</label>
                  <input
                    type="text"
                    name="activityField"
                    value={formData.activityField}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">İş Yeri E-posta</label>
                  <input
                    type="email"
                    name="workplaceEmail"
                    value={formData.workplaceEmail}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">İş Yeri Telefon</label>
                  <input
                    type="tel"
                    name="workplacePhone"
                    value={formData.workplacePhone}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    required
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="mb-1 text-sm font-medium">İş Yeri Adresi</label>
                  <textarea
                    name="workplaceAddress"
                    value={formData.workplaceAddress}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded p-2"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Staj Tarihleri ve Günleri */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-medium mb-4">Staj Tarihleri ve Çalışma Günleri</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Başlangıç Tarihi</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={todayFormatted}
                    className="border border-gray-300 rounded p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Bitiş Tarihi</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    readOnly
                    className="border border-gray-300 rounded p-2 bg-gray-100 cursor-not-allowed"
                    required
                  />
                  <small className="text-gray-500 mt-1">Başlangıç tarihine göre otomatik hesaplanır</small>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium">Staj Süresi (Gün)</label>
                  <input
                    type="number"
                    name="durationInDays"
                    value={formData.durationInDays}
                    readOnly
                    className="border border-gray-300 rounded p-2 bg-gray-100"
                  />
                  <small className="text-gray-500 mt-1">Başlangıç ve bitiş tarihlerine göre otomatik hesaplanır</small>
                </div>
              </div>

              <div>
                <label className="mb-2 text-sm font-medium block">Haftalık Çalışma Gün Sayısı</label>
                <select
                  name="weeklyWorkingDays"
                  value={formData.weeklyWorkingDays}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 w-full md:w-64"
                  required
                >
                  <option value="">Seçiniz</option>
                  {weeklyWorkingDays.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 flex justify-end gap-4 shadow-md">
              <button 
                type="button"
                onClick={resetForm}
                className="btn bg-gray-200 text-gray-800 py-2 px-6 rounded"
              >
                Formu Temizle
              </button>
              
              <button 
                type="submit" 
                className="btn bg-[#13126e] text-white py-2 px-6 rounded flex items-center gap-2"
                disabled={createApplicationMutation.isPending}
              >
                {createApplicationMutation.isPending ? (
                  <>
                    <span className="animate-spin">
                      <KeenIcon icon="spinner" className="text-white" />
                    </span>
                    <span>Gönderiliyor...</span>
                  </>
                ) : (
                  <>
                    <KeenIcon icon="check" className="text-white" />
                    <span>Başvuruyu Tamamla</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default InternshipApplicationPage;