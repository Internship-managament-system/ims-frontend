import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';
import { useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';

interface Application {
  id: string;
  companyName: string;
  position: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  applicationDate: string;
}

interface Internship {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  status: 'COMPLETED' | 'IN_PROGRESS';
}

interface ApplicationForm {
  internshipType: 'VOLUNTARY' | 'MANDATORY';
  workplaceName: string;
  province: string;
  program: string;
  internshipPeriod: string;
  activityField: string;
  workplaceEmail: string;
  workplacePhone: string;
  workplaceAddress: string;
  weeklyWorkingDays: 5 | 6;
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
    internshipType: 'VOLUNTARY',
    workplaceName: '',
    province: '',
    program: '',
    internshipPeriod: '',
    activityField: '',
    workplaceEmail: '',
    workplacePhone: '',
    workplaceAddress: '',
    weeklyWorkingDays: 5,
    startDate: '',
    endDate: '',
    hasGeneralHealthInsurance: false
  });

  // Mock data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      companyName: 'ABC Teknoloji A.Ş.',
      position: 'Yazılım Geliştirici',
      status: 'PENDING',
      applicationDate: '2024-01-15'
    },
    {
      id: '2',
      companyName: 'XYZ Bilişim Ltd.',
      position: 'Frontend Developer',
      status: 'APPROVED',
      applicationDate: '2024-01-10'
    },
    {
      id: '3',
      companyName: 'DEF Yazılım A.Ş.',
      position: 'Backend Developer',
      status: 'REJECTED',
      applicationDate: '2024-01-05'
    }
  ]);

  const [internships, setInternships] = useState<Internship[]>([
    {
      id: '1',
      companyName: 'XYZ Bilişim Ltd.',
      position: 'Yazılım Stajı',
      startDate: '2023-06-01',
      endDate: '2023-08-30',
      status: 'COMPLETED'
    },
    {
      id: '2',
      companyName: 'TechCorp A.Ş.',
      position: 'Donanım Stajı',
      startDate: '2024-01-15',
      endDate: '2024-04-15',
      status: 'IN_PROGRESS'
    }
  ]);

  useEffect(() => {
    document.title = `${pageTitle} | Staj Yönetim Sistemi`;
  }, [pageTitle]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Beklemede';
      case 'APPROVED':
        return 'Onaylandı';
      case 'REJECTED':
        return 'Reddedildi';
      case 'COMPLETED':
        return 'Tamamlandı';
      case 'IN_PROGRESS':
        return 'Devam Ediyor';
      default:
        return status;
    }
  };

  const calculateEndDate = (startDate: string, weeklyWorkingDays: 5 | 6): string => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let workingDaysCount = 0;
    let currentDate = new Date(start);
    
    while (workingDaysCount < 20) {
      const dayOfWeek = currentDate.getDay(); // 0 = Pazar, 1 = Pazartesi, ..., 6 = Cumartesi
      
      if (weeklyWorkingDays === 5) {
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
      const newWeeklyWorkingDays = name === 'weeklyWorkingDays' ? parseInt(value) as 5 | 6 : formData.weeklyWorkingDays;
      
      const newEndDate = calculateEndDate(newStartDate, newWeeklyWorkingDays);
      
      setFormData(prev => ({
        ...prev,
        [name]: name === 'weeklyWorkingDays' ? parseInt(value) : value,
        endDate: newEndDate
      }));
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
      internshipType: 'VOLUNTARY',
      workplaceName: '',
      province: '',
      program: '',
      internshipPeriod: '',
      activityField: '',
      workplaceEmail: '',
      workplacePhone: '',
      workplaceAddress: '',
      weeklyWorkingDays: 5,
      startDate: '',
      endDate: '',
      hasGeneralHealthInsurance: false
    });
  };

  return (
    <Container>
      <div className="flex flex-col gap-5 lg:gap-7.5">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-gray-900">
            Hoş Geldiniz, {currentUser?.name} {currentUser?.surname}
          </h1>
          <p className="text-sm text-gray-600">
            Staj süreçlerinizi buradan takip edebilir ve yeni başvurular yapabilirsiniz.
          </p>
        </div>

        {/* Main Panels */}
        <div className="flex flex-col gap-5 lg:gap-7.5">
          {/* Yeni Başvuru Paneli */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-[#13126e] rounded-lg">
                <KeenIcon icon="plus" className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Yeni Başvuru</h2>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Staj yapmak istediğiniz şirketlere başvuru yapın.
            </p>
            <button 
              className="w-full bg-[#13126e] text-white py-3 px-4 rounded-lg hover:bg-[#1f1e7e] transition-colors flex items-center justify-center gap-2"
              onClick={() => setShowApplicationModal(true)}
            >
              <KeenIcon icon="plus" className="text-sm" />
              Yeni Başvuru Yap
            </button>
          </div>

          {/* Yapılan Başvurular Paneli */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
                <KeenIcon icon="document" className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Yapılan Başvurular</h2>
            </div>
            <div className="space-y-3 mb-4">
              {applications.slice(0, 2).map((app) => (
                <div key={app.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {app.companyName}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">{app.position}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(app.status)}`}>
                      {getStatusText(app.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
              onClick={() => navigate('/student/applications')}
            >
              Tümünü Görüntüle ({applications.length})
            </button>
          </div>

          {/* Yapılan Stajlar Paneli */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-lg">
                <KeenIcon icon="chart-line" className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Yapılan Stajlar</h2>
            </div>
            <div className="space-y-3">
              {internships.map((internship) => (
                <div key={internship.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {internship.companyName}
                      </h3>
                      <p className="text-xs text-gray-600 truncate">{internship.position}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(internship.startDate).toLocaleDateString('tr-TR')} - {new Date(internship.endDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(internship.status)}`}>
                      {getStatusText(internship.status)}
                    </span>
                  </div>
                </div>
              ))}
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
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="internshipType"
                        value="VOLUNTARY"
                        checked={formData.internshipType === 'VOLUNTARY'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      İsteğe Bağlı
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="internshipType"
                        value="MANDATORY"
                        checked={formData.internshipType === 'MANDATORY'}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Zorunlu
                    </label>
                  </div>
                </div>

                {/* İş Yeri Bilgileri */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        İş Yeri Adı *
                      </label>
                      <input
                        type="text"
                        name="workplaceName"
                        value={formData.workplaceName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Program *
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#13126e] focus:border-[#13126e]"
                      >
                        <option value="">Program Seçin</option>
                        <option value="ANADAL_PROGRAMI">Anadal Programı</option>
                        <option value="YANDAL_PROGRAMI">Yandal Programı</option>
                        <option value="CIFT_ANADAL">Çift Anadal</option>
                      </select>
                    </div>
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
                        <option value="KAYSERI">Kayseri</option>
                        <option value="ANKARA">Ankara</option>
                        <option value="ISTANBUL">İstanbul</option>
                        <option value="IZMIR">İzmir</option>
                        <option value="DIGER">Diğer</option>
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
                        <option value="1_STAJ">1. Staj</option>
                        <option value="2_STAJ">2. Staj</option>
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
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="weeklyWorkingDays"
                            value={5}
                            checked={formData.weeklyWorkingDays === 5}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          5 Gün
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="weeklyWorkingDays"
                            value={6}
                            checked={formData.weeklyWorkingDays === 6}
                            onChange={handleInputChange}
                            className="mr-2"
                          />
                          6 Gün
                        </label>
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