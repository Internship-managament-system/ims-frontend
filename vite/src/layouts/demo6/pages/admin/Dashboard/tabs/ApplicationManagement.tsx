// /layouts/demo6/pages/admin/Dashboard/tabs/ApplicationManagement.tsx
import React, { useState } from 'react';

const ApplicationManagement: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Başvuru Yönetimi</h2>
        <div className="flex space-x-2">
          <button className="btn bg-[#13126e] text-white text-sm py-1 px-3 rounded">
            Otomatik Atama Yap
          </button>
          <button className="btn bg-blue-600 text-white text-sm py-1 px-3 rounded">
            Filtrele
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex space-x-2">
        <button 
          className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'all' ? 'bg-[#13126e] text-white' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveFilter('all')}
        >
          Tümü
        </button>
        <button 
          className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveFilter('pending')}
        >
          Bekliyor
        </button>
        <button 
          className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'incomplete' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveFilter('incomplete')}
        >
          Eksik
        </button>
        <button 
          className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveFilter('approved')}
        >
          Onaylandı
        </button>
        <button 
          className={`btn text-sm py-1 px-3 rounded ${activeFilter === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-800'}`}
          onClick={() => setActiveFilter('rejected')}
        >
          Reddedildi
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Öğrenci No</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Ad Soyad</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Staj Tipi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Başvuru Tarihi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Durum</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">Atanan Kişi</th>
              <th className="px-4 py-2 text-sm font-medium text-gray-500">İşlem</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">20190101023</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ahmet Yılmaz</td>
              <td className="px-4 py-3 text-sm text-gray-700">Yaz Stajı</td>
              <td className="px-4 py-3 text-sm text-gray-700">25.04.2025</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Beklemede
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ali Demir</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-1">
                  <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    İncele
                  </button>
                  <button className="btn bg-gray-500 text-white text-xs py-1 px-2 rounded">
                    Atama Geçmişi
                  </button>
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">20190101045</td>
              <td className="px-4 py-3 text-sm text-gray-700">Ayşe Demir</td>
              <td className="px-4 py-3 text-sm text-gray-700">Yaz Stajı</td>
              <td className="px-4 py-3 text-sm text-gray-700">24.04.2025</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                  Eksik
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Dr. Mehmet Kaya</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-1">
                  <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    İncele
                  </button>
                  <button className="btn bg-gray-500 text-white text-xs py-1 px-2 rounded">
                    Atama Geçmişi
                  </button>
                </div>
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-3 text-sm text-gray-700">20190101067</td>
              <td className="px-4 py-3 text-sm text-gray-700">Mehmet Öz</td>
              <td className="px-4 py-3 text-sm text-gray-700">Kış Stajı</td>
              <td className="px-4 py-3 text-sm text-gray-700">23.04.2025</td>
              <td className="px-4 py-3 text-sm">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                  Onaylandı
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ayşe Yıldız</td>
              <td className="px-4 py-3 text-sm">
                <div className="flex space-x-1">
                  <button className="btn bg-blue-500 text-white text-xs py-1 px-2 rounded">
                    İncele
                  </button>
                  <button className="btn bg-gray-500 text-white text-xs py-1 px-2 rounded">
                    Atama Geçmişi
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mt-6">
        <h3 className="text-md font-medium text-blue-800 mb-2">Otomatik Atama Durumu</h3>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="font-medium">Aktif</span>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Otomatik atama sistemi açık. Yeni başvurular komisyon üyelerine sırayla otomatik olarak atanacaktır.
        </p>
      </div>
    </div>
  );
};

export default ApplicationManagement;