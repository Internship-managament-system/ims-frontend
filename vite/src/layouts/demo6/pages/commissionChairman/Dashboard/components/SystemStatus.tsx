// /src/layouts/demo6/pages/admin/Dashboard/components/SystemStatus.tsx
import React from 'react';
import { KeenIcon } from '@/components/keenicons';

const SystemStatus: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <KeenIcon icon="setting-2" className="text-[#13126e]" />
        Sistem Durumu
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#13126e] text-white rounded-lg">
              <KeenIcon icon="calendar" className="text-sm" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Staj Başvuru Ayarı</span>
              <div className="text-sm text-gray-600">Minimum süre kuralı</div>
            </div>
          </div>
          <span className="font-semibold text-[#13126e] bg-[#13126e]/10 px-3 py-1 rounded-lg border border-[#13126e]/20">
            En az 14 gün sonrası
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#13126e] text-white rounded-lg">
              <KeenIcon icon="time" className="text-sm" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Defter Teslim Başlangıç</span>
              <div className="text-sm text-gray-600">Teslim başlangıç tarihi</div>
            </div>
          </div>
          <span className="font-semibold text-[#13126e] bg-[#13126e]/10 px-3 py-1 rounded-lg border border-[#13126e]/20">
            01.03.2025
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#13126e] text-white rounded-lg">
              <KeenIcon icon="time" className="text-sm" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Defter Teslim Bitiş</span>
              <div className="text-sm text-gray-600">Teslim bitiş tarihi</div>
            </div>
          </div>
          <span className="font-semibold text-[#13126e] bg-[#13126e]/10 px-3 py-1 rounded-lg border border-[#13126e]/20">
            30.05.2025
          </span>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#13126e] text-white rounded-lg">
              <KeenIcon icon="message-question" className="text-sm" />
            </div>
            <div>
              <span className="font-medium text-gray-900">Chatbot Durumu</span>
              <div className="text-sm text-gray-600">Yardım sistemi</div>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold bg-[#13126e] text-white rounded-lg">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Aktif
          </span>
        </div>
      </div>
      
      <button className="btn bg-gradient-to-r from-[#13126e] to-[#3a3a8e] text-white w-full py-3 px-4 rounded-xl mt-6 hover:from-[#0f0f5a] hover:to-[#2d2d75] transition-all duration-300 font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
        <KeenIcon icon="setting-2" />
        Sistem Ayarlarını Düzenle
      </button>
    </div>
  );
};

export default SystemStatus;