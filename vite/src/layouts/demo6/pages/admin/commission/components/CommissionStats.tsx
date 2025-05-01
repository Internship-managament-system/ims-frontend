// /src/layouts/demo6/pages/admin/Dashboard/components/CommissionStats.tsx
import React from 'react';

const CommissionStats: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Komisyon Üyesi İstatistikleri</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Komisyon Üyesi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İncelenen Başvuru</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Değerlendirilen Defter</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ali Demir</td>
              <td className="px-4 py-3 text-sm text-gray-700">15</td>
              <td className="px-4 py-3 text-sm text-gray-700">9</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">Dr. Mehmet Kaya</td>
              <td className="px-4 py-3 text-sm text-gray-700">12</td>
              <td className="px-4 py-3 text-sm text-gray-700">7</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ayşe Yıldız</td>
              <td className="px-4 py-3 text-sm text-gray-700">18</td>
              <td className="px-4 py-3 text-sm text-gray-700">11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CommissionStats;