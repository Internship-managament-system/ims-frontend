// /src/layouts/demo6/pages/admin/Dashboard/components/SystemStatus.tsx
import React from 'react';

const SystemStatus: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sistem Durumu</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center p-2 border-b border-gray-100">
          <span className="text-gray-600">Staj Başvuru Ayarı</span>
          <span className="font-medium text-gray-900">En az 14 gün sonrası</span>
        </div>
        <div className="flex justify-between items-center p-2 border-b border-gray-100">
          <span className="text-gray-600">Defter Teslim Başlangıç</span>
          <span className="font-medium text-gray-900">01.03.2025</span>
        </div>
        <div className="flex justify-between items-center p-2 border-b border-gray-100">
          <span className="text-gray-600">Defter Teslim Bitiş</span>
          <span className="font-medium text-gray-900">30.05.2025</span>
        </div>
        <div className="flex justify-between items-center p-2 border-b border-gray-100">
          <span className="text-gray-600">Otomatik Atama Durumu</span>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Aktif
          </span>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-gray-600">Chatbot Durumu</span>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            Aktif
          </span>
        </div>
      </div>
      <button className="btn bg-[#13126e] text-white w-full py-2 px-4 rounded mt-4">
        Sistem Ayarlarını Düzenle
      </button>
    </div>
  );
};

export default SystemStatus;