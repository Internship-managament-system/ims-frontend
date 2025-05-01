// /src/layouts/demo6/pages/admin/Dashboard/components/PendingApplications.tsx
import React from 'react';

const PendingApplications: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Son Başvurular</h2>
        <button className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded">
          Tümünü Görüntüle
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Tarih</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Atanan Kişi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">20190101023</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ahmet Yılmaz</td>
              <td className="px-4 py-3 text-sm text-gray-700">25.04.2025</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Beklemede
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ali Demir</td>
              <td className="px-4 py-3 text-sm">
                <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                  İncele
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">20190101045</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ayşe Demir</td>
              <td className="px-4 py-3 text-sm text-gray-700">24.04.2025</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Eksik
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Dr. Mehmet Kaya</td>
              <td className="px-4 py-3 text-sm">
                <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                  İncele
                </button>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">20190101067</td>
              <td className="px-4 py-3 text-sm text-gray-700">Mehmet Öz</td>
              <td className="px-4 py-3 text-sm text-gray-700">23.04.2025</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Onaylandı
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ayşe Yıldız</td>
              <td className="px-4 py-3 text-sm">
                <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                  İncele
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingApplications;