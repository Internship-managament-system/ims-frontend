// /src/layouts/demo6/pages/admin/Dashboard/components/StatusCards.tsx
import React from 'react';
import { KeenIcon } from '@/components/keenicons';
import { useQuery } from '@tanstack/react-query';
import { getAllCommissionMembers } from '@/services/commissionService';
import { getInternshipApplicationsForCommission } from '@/services/internshipService';

const StatusCards: React.FC = () => {
  // Komisyon üyesi sayısını al
  const { data: commissionMembers = [] } = useQuery({
    queryKey: ['commission-members'],
    queryFn: getAllCommissionMembers,
  });

  // Bekleyen başvuru sayısını al
  const { data: applications = [] } = useQuery({
    queryKey: ['commission-internship-applications'],
    queryFn: getInternshipApplicationsForCommission,
  });

  // Bekleyen başvuru sayısını hesapla
  const pendingApplicationsCount = applications.filter(app => 
    app.status === 'PENDING' || 
    app.status === 'Beklemede' || 
    app.status?.toUpperCase() === 'PENDING'
  ).length;

  // Komisyon üyesi sayısını hesapla
  const commissionMembersCount = commissionMembers.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Toplam Öğrenci Sayısı */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <KeenIcon icon="people" className="text-2xl text-white" />
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm font-medium">Toplam Öğrenci</p>
            <h3 className="text-3xl font-bold text-white">250</h3>
          </div>
        </div>
        <div className="text-blue-100 text-xs">
          Aktif öğrenci sayısı
        </div>
      </div>

      {/* Bekleyen Başvurular */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <KeenIcon icon="time" className="text-2xl text-white" />
          </div>
          <div className="text-right">
            <p className="text-orange-100 text-sm font-medium">Bekleyen Başvurular</p>
            <h3 className="text-3xl font-bold text-white">{pendingApplicationsCount}</h3>
          </div>
        </div>
        <div className="text-orange-100 text-xs">
          İnceleme gerektiren
        </div>
      </div>

      {/* Bekleyen Defterler */}
      <div className="bg-gradient-to-br from-cyan-500 to-teal-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <KeenIcon icon="document" className="text-2xl text-white" />
          </div>
          <div className="text-right">
            <p className="text-cyan-100 text-sm font-medium">Bekleyen Defterler</p>
            <h3 className="text-3xl font-bold text-white">15</h3>
          </div>
        </div>
        <div className="text-cyan-100 text-xs">
          Değerlendirme bekleyen
        </div>
      </div>

      {/* Komisyon Üyeleri */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <KeenIcon icon="user-check" className="text-2xl text-white" />
          </div>
          <div className="text-right">
            <p className="text-purple-100 text-sm font-medium">Komisyon Üyeleri</p>
            <h3 className="text-3xl font-bold text-white">{commissionMembersCount}</h3>
          </div>
        </div>
        <div className="text-purple-100 text-xs">
          Aktif komisyon üyesi
        </div>
      </div>
    </div>
  );
};

export default StatusCards;