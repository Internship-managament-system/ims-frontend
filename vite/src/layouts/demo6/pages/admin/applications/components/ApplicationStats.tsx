// src/layouts/demo6/pages/admin/applications/components/ApplicationStats.tsx
import React from 'react';
import { KeenIcon } from '@/components/keenicons';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  bgColor: string;
  description: string;
}

const ApplicationStats: React.FC = () => {
  const stats: StatCard[] = [
    {
      title: 'Bekleyen Başvurular',
      value: 5,
      icon: 'time',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-100',
      description: 'Atama bekleyen başvurular'
    },
    {
      title: 'Staj Defterleri',
      value: 3,
      icon: 'book-open',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Değerlendirici atanmamış'
    },
    {
      title: 'Mezun Defterleri',
      value: 2,
      icon: 'profile-circle',
      color: 'text-purple-700',
      bgColor: 'bg-purple-100',
      description: 'Mezunlardan gelen defterler'
    },
    {
      title: 'Tamamlanan Değerlendirmeler',
      value: 8,
      icon: 'check-circle',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Bu ay tamamlanan'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-full ${stat.bgColor}`}>
              <KeenIcon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900">{stat.title}</h3>
              <div className="flex items-baseline">
                <p className={`text-2xl font-semibold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationStats;