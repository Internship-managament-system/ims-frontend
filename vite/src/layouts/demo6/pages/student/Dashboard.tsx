import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { 
  getMyInternshipApplicationsList, 
  InternshipApplicationListItem,
  InternshipType, 
  InternshipStatus,
  getInternships,
  Internship
} from '@/services/internshipService';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import axiosClient from '@/api/axiosClient';
import { INTERNSHIP_APPLICATIONS_ME } from '@/api/endpoints';
import { getProvinces } from '@/services/formOptionsService';

interface Application {
  id: string;
  companyName: string;
  position: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applicationDate: string;
}



interface ApplicationForm {
  internshipId: string;
  internshipType: string;
  province: string;
  program: string;
  internshipPeriod: string;
  activityField: string;
  workplaceEmail: string;
  workplacePhone: string;
  workplaceAddress: string;
  weeklyWorkingDays: string;
  startDate: string;
  endDate: string;
  hasGeneralHealthInsurance: boolean;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuthContext();
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const pageTitle = 'Öğrenci Paneli';
  const navigate = useNavigate();

  // Modal state
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [formData, setFormData] = useState<ApplicationForm>({
    internshipId: '',
    internshipType: 'VOLUNTARY',
    province: '',
    program: '',
    internshipPeriod: '',
    activityField: '',
    workplaceEmail: '',
    workplacePhone: '',
    workplaceAddress: '',
    weeklyWorkingDays: 'FIVE_DAYS',
    startDate: '',
    endDate: '',
    hasGeneralHealthInsurance: false
  });

  // API'den kullanıcının staj başvurularını çek (YENİ API)
  const { data: applications = [], isLoading: applicationsLoading, error: applicationsError } = useQuery({
    queryKey: ['internshipApplicationsList'],
    queryFn: getMyInternshipApplicationsList
  });

  // API'den stajları çek
  const { data: internships = [], isLoading: internshipsLoading, error: internshipsError } = useQuery({
    queryKey: ['internships'],
    queryFn: getInternships
  });



  // Provinces için state ve useEffect ekle
  const [provinces, setProvinces] = useState<any[]>([]);
  useEffect(() => {
    getProvinces().then((res: any) => setProvinces(res || []));
  }, []);

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'READY_FOR_ASSIGNMENT':
        return 'bg-purple-100 text-purple-800';
      case 'ASSIGNED':
        return 'bg-indigo-100 text-indigo-800';
      case 'APPLICATION_APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS':
        return 'bg-orange-100 text-orange-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      // Eski APPROVED enum'u için backward compatibility
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'READY_FOR_ASSIGNMENT':
        return '📄 Belgelerinizi Yükleyebilirsiniz';
      case 'ASSIGNED':
        return '⏳ Başvurunuz İnceleniyor';
      case 'APPLICATION_APPROVED':
        return 'Başvurunuz Onaylandı! 🎉';
      case 'REJECTED':
        return 'Başvuru Reddedildi';
      case 'IN_PROGRESS':
        return 'Staj Devam Ediyor';
      case 'COMPLETED':
        return 'Staj Tamamlandı';
      // Eski APPROVED enum'u için backward compatibility
      case 'APPROVED':
        return 'Başvurunuz Onaylandı! 🎉';
      default:
        return status;
    }
  };

  const calculateEndDate = (startDate: string, weeklyWorkDaysOption: string): string => {
    if (!startDate) return '';
    
    // Haftalık çalışma günlerini bulalım
    const workingDaysNumber = weeklyWorkDaysOption === 'FIVE_DAYS' ? 5 : 6;
    
    const start = new Date(startDate);
    let workingDaysCount = 0;
    let currentDate = new Date(start);
    
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
      
      if (workingDaysCount < 20) {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    
    return currentDate.toISOString().split('T')[0];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name === 'startDate' || name === 'weeklyWorkingDays') {
      const newStartDate = name === 'startDate' ? value : formData.startDate;
      const newWeeklyWorkingDays = name === 'weeklyWorkingDays' ? value : formData.weeklyWorkingDays;
      
      if (newStartDate) {
        const newEndDate = calculateEndDate(newStartDate, newWeeklyWorkingDays);
        
        setFormData(prev => ({
          ...prev,
          [name]: value,
          endDate: newEndDate
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form verilerini işle
    console.log('Form Data:', formData);
    // API çağrısı yapılacak
    setShowApplicationModal(false);
    // Form'u temizle
    setFormData({
      internshipId: '',
      internshipType: 'VOLUNTARY',
      province: '',
      program: '',
      internshipPeriod: '',
      activityField: '',
      workplaceEmail: '',
      workplacePhone: '',
      workplaceAddress: '',
      weeklyWorkingDays: 'FIVE_DAYS',
      startDate: '',
      endDate: '',
      hasGeneralHealthInsurance: false
    });
  };

  return (
    <Container className="min-h-screen bg-white">
      <div className="flex flex-col gap-5 lg:gap-7.5 pt-8 px-6">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Hoş Geldiniz, {currentUser?.name} {currentUser?.surname}
          </h1>
          <p className="text-sm text-gray-600">
            Staj süreçlerinizi buradan takip edebilir ve yeni başvurular yapabilirsiniz.
          </p>
        </div>

        {/* Main Panels */}
        <div className="flex flex-col gap-5 lg:gap-7.5">
          {/* Yapılan Başvurular Paneli */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                  <KeenIcon icon="document" className="text-white text-lg" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Başvurularım</h2>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {applicationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin mb-2 mx-auto">
                    <KeenIcon icon="spinner" className="text-[#13126e] w-8 h-8" />
                  </div>
                  <p>Başvurular yükleniyor...</p>
                </div>
              ) : applicationsError ? (
                <div className="text-center py-8 text-red-600">
                  <KeenIcon icon="error" className="text-red-600 w-8 h-8 mx-auto mb-2" />
                  <p>Başvurular yüklenirken bir hata oluştu.</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500">Henüz hiç başvuru yapmadınız.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Adı</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                        <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application: InternshipApplicationListItem) => (
                        <tr key={application.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium">{application.internshipName}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span>{application.companyName}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-sm">{new Date(application.appliedDate).toLocaleDateString('tr-TR')}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                              {getStatusLabel(application.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Button 
                              variant="outline" 
                              onClick={() => navigate(`/student/my-applications`)}
                              className="text-xs py-1 px-2"
                            >
                              Detaylar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {applications.length > 0 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/student/my-applications')}
                  className="text-sm"
                >
                  Tümünü Görüntüle
                </Button>
              </div>
            )}
          </div>

          {/* Yapılan Stajlar Paneli */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-lg">
                <KeenIcon icon="chart-line" className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Tamamlanan Stajlar</h2>
            </div>
            <div className="space-y-3">
              {/* Mock Tamamlanan Staj Verisi */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Adı</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Şirket</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">Yazılım (Kısaltılmış)</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span>Deneme Yazılım Firması</span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm">30.06.2025</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Stajınız Onaylandı! 🎉
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/student/my-applications`)}
                          className="text-xs py-1 px-2"
                        >
                          Detaylar
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/student/my-applications')}
                  className="text-sm"
                >
                  Tümünü Görüntüle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staj Başvuru Modalı */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Yeni Staj Başvurusu</h2>
                <button 
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <KeenIcon icon="cross" className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Staj Tipi */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Staj Tipi</h3>
                  <div className="flex gap-6">
                    {/* internshipTypes.map(type => (
                      <label key={type.value} className="flex items-center">
                        <input
                          type="radio"
                          name="internshipType"
                          value={type.value}
                          checked={formData.internshipType === type.value}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        {type.label}
                      </label>
                    )) */}
                  </div>
                </div>

                {/* Staj Seçimi */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Staj Seçimi</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Staj Seçiniz *
                    </label>
                    <select
                      name="internshipId"
                      value={formData.internshipId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                    >
                      <option value="">Staj Seçin</option>
                      {internshipsLoading ? (
                        <option disabled>Stajlar yükleniyor...</option>
                      ) : internshipsError ? (
                        <option disabled>Stajlar yüklenirken hata oluştu</option>
                      ) : (
                        internships.map(internship => (
                          <option key={internship.id} value={internship.id}>
                            {internship.name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* İş Yeri Bilgileri */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İşyeri İl/Ülke *
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      >
                        <option value="">İl/Ülke Seçin</option>
                        {provinces.map(province => (
                          <option key={province.value} value={province.value}>{province.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Staj Dönemi *
                      </label>
                      <select
                        name="internshipPeriod"
                        value={formData.internshipPeriod}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      >
                        <option value="">Dönem Seçin</option>
                        {/* internshipPeriods.map(period => (
                          <option key={period.value} value={period.value}>{period.label}</option>
                        )) */}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İş Yeri Faaliyet Alanı *
                      </label>
                      <input
                        type="text"
                        name="activityField"
                        value={formData.activityField}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Staj Gün Sayısı *
                      </label>
                      <input
                        type="text"
                        value="20 İş Günü"
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İş Yeri E-Posta *
                      </label>
                      <input
                        type="email"
                        name="workplaceEmail"
                        value={formData.workplaceEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Haftalık Çalışma Gün Sayısı *
                      </label>
                      <div className="flex gap-6 mt-2">
                        {/* weeklyWorkingDays.map(option => (
                          <label key={option.value} className="flex items-center">
                            <input
                              type="radio"
                              name="weeklyWorkingDays"
                              value={option.value}
                              checked={formData.weeklyWorkingDays === option.value}
                              onChange={handleInputChange}
                              className="mr-2"
                            />
                            {option.label}
                          </label>
                        )) */}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İş Yeri Telefon *
                      </label>
                      <input
                        type="tel"
                        name="workplacePhone"
                        value={formData.workplacePhone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Staj Başlama Tarihi *
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İş Yeri Adresi *
                      </label>
                      <textarea
                        name="workplaceAddress"
                        value={formData.workplaceAddress}
                        onChange={handleInputChange}
                        required
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Staj Bitiş Tarihi (Otomatik)
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                {/* Genel Sağlık Sigortası */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Genel Sağlık Sigortası</h3>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasGeneralHealthInsurance"
                        value="true"
                        checked={formData.hasGeneralHealthInsurance === true}
                        onChange={(e) => setFormData(prev => ({ ...prev, hasGeneralHealthInsurance: e.target.value === 'true' }))}
                        className="mr-2"
                      />
                      Var
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="hasGeneralHealthInsurance"
                        value="false"
                        checked={formData.hasGeneralHealthInsurance === false}
                        onChange={(e) => setFormData(prev => ({ ...prev, hasGeneralHealthInsurance: e.target.value === 'true' }))}
                        className="mr-2"
                      />
                      Yok
                    </label>
                  </div>
                </div>

                {/* Form Butonları */}
                <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Geri Dön
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#13126e] text-white rounded-lg hover:bg-[#1f1e7e] transition-colors"
                  >
                    Başvur
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default Dashboard;