// /pages/commissionChairman/Dashboard/index.tsx
import React from 'react';
import { Container } from '@/components';
import { KeenIcon } from '@/components/keenicons';
import { useQuery } from '@tanstack/react-query';
import { getInternshipApplicationsForCommission } from '@/services/internshipService';
import { useAuthContext } from '@/auth';
import StatusCards from './components/StatusCards';
import SystemStatus from './components/SystemStatus';

const Dashboard: React.FC = () => {
  // Kullanıcı bilgilerini al
  const { currentUser } = useAuthContext();

  // Bekleyen başvuru sayısını dinamik olarak al
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['commission-internship-applications'],
    queryFn: getInternshipApplicationsForCommission,
  });

  // Bekleyen başvuru sayısını hesapla - status string olarak geliyor
  const pendingApplicationsCount = applications.filter(app => 
    app.status === 'PENDING' || 
    app.status === 'Beklemede' || 
    app.status?.toUpperCase() === 'PENDING'
  ).length;

  console.log('🔍 Dashboard - Applications:', applications);
  console.log('🔍 Dashboard - Pending count:', pendingApplicationsCount);

  // Kullanıcı adını formatla
  const getUserDisplayName = () => {
    if (currentUser?.name && currentUser?.surname) {
      return `${currentUser.name} ${currentUser.surname}`;
    } else if (currentUser?.fullname) {
      return currentUser.fullname;
    } else if (currentUser?.email) {
      return currentUser.email.split('@')[0]; // Email'den isim çıkar
    }
    return 'Komisyon Başkanı';
  };

  return (
    <Container>
      <div className="p-5 space-y-6">
        {/* Hoş Geldin Bölümü */}
        <div className="bg-gradient-to-r from-[#13126e] to-[#3a3a8e] rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Hoş Geldiniz, {getUserDisplayName()}</h1>
              <p className="text-blue-100 text-lg">Staj süreçlerini yönetin ve öğrenci gelişimini takip edin</p>
            </div>
            <div className="hidden lg:block">
              <div className="p-4 bg-white/20 rounded-2xl">
                <KeenIcon icon="user-square" className="text-5xl text-white" />
              </div>
            </div>
          </div>
        </div>
        
        {/* İstatistik Kartları */}
        <StatusCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Hızlı Eylemler */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <KeenIcon icon="flash" className="text-[#13126e]" />
                Hızlı Eylemler
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors group">
                  <div className="p-2 bg-[#13126e] text-white rounded-lg group-hover:scale-110 transition-transform">
                    <KeenIcon icon="time" className="text-lg" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Bekleyen Başvurular</div>
                    <div className="text-sm text-gray-600">
                      {isLoading ? 'Yükleniyor...' : `${pendingApplicationsCount} başvuru incelemeyi bekliyor`}
                    </div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors group">
                  <div className="p-2 bg-[#13126e] text-white rounded-lg group-hover:scale-110 transition-transform">
                    <KeenIcon icon="setting-2" className="text-lg" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Staj Türleri</div>
                    <div className="text-sm text-gray-600">Staj türlerini yönet</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors group">
                  <div className="p-2 bg-[#13126e] text-white rounded-lg group-hover:scale-110 transition-transform">
                    <KeenIcon icon="book" className="text-lg" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Konu Havuzu</div>
                    <div className="text-sm text-gray-600">Staj konularını düzenle</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition-colors group">
                  <div className="p-2 bg-[#13126e] text-white rounded-lg group-hover:scale-110 transition-transform">
                    <KeenIcon icon="folder" className="text-lg" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Belgeler</div>
                    <div className="text-sm text-gray-600">Belge şablonlarını yönet</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Sistem Durumu */}
          <div className="lg:col-span-1">
            <SystemStatus />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;