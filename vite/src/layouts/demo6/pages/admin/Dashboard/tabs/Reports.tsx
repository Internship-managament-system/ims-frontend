// /layouts/demo6/pages/admin/Dashboard/tabs/Reports.tsx
import React, { useState } from 'react';

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState('monthly');
  const [dateRange, setDateRange] = useState('current');
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Raporlama ve İstatistikler</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Rapor Tipi</label>
            <select 
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="monthly">Aylık Rapor</option>
              <option value="semester">Dönemlik Rapor</option>
              <option value="yearly">Yıllık Rapor</option>
              <option value="commission">Komisyon Üyesi Raporu</option>
              <option value="student">Öğrenci Bazlı Rapor</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-600 mb-1">Tarih Aralığı</label>
            <select 
              className="border border-gray-300 rounded-lg p-2 w-full"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="current">Mevcut Dönem</option>
              <option value="last">Geçen Dönem</option>
              <option value="year">Son 1 Yıl</option>
              <option value="all">Tüm Zamanlar</option>
            </select>
          </div>
        </div>
        
        <button className="btn bg-[#13126e] text-white px-3 py-2 rounded">
          Raporu Oluştur
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Staj İstatistikleri</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">Başvuru Durumları</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Toplam Başvuru</span>
                <span className="font-medium text-gray-900">111</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Onaylanan</span>
                <span className="font-medium text-green-600">78</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Kısmen Kabul</span>
                <span className="font-medium text-yellow-600">12</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">Reddedilen</span>
                <span className="font-medium text-red-600">21</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="text-md font-medium text-gray-900 mb-3">Değerlendirme İstatistikleri</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">Ortalama Değerlendirme Süresi</span>
                <span className="font-medium text-gray-900">3.2 gün</span>
              </div>
              <div className="flex justify-between items-center p-2 border-b border-gray-100">
                <span className="text-gray-600">En Aktif Komisyon Üyesi</span>
                <span className="font-medium text-gray-900">Prof. Dr. Ayşe Yıldız</span>
              </div>
              <div className="flex justify-between items-center p-2">
                <span className="text-gray-600">En Çok Red Sebebi</span>
                <span className="font-medium text-gray-900">Belgeler Eksik</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Komisyon Üyesi Performansı</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Komisyon Üyesi</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">İncelenen Başvuru</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Değerlendirilen Defter</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Ortalama Süre</th>
                <th className="px-4 py-2 text-sm font-medium text-gray-500">Onay Oranı</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ali Demir</td>
                <td className="px-4 py-3 text-sm text-gray-700">15</td>
                <td className="px-4 py-3 text-sm text-gray-700">9</td>
                <td className="px-4 py-3 text-sm text-gray-700">2.8 gün</td>
                <td className="px-4 py-3 text-sm text-gray-700">85%</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">Dr. Mehmet Kaya</td>
                <td className="px-4 py-3 text-sm text-gray-700">12</td>
                <td className="px-4 py-3 text-sm text-gray-700">7</td>
                <td className="px-4 py-3 text-sm text-gray-700">3.5 gün</td>
                <td className="px-4 py-3 text-sm text-gray-700">75%</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="px-4 py-3 text-sm text-gray-700">Prof. Dr. Ayşe Yıldız</td>
                <td className="px-4 py-3 text-sm text-gray-700">18</td>
                <td className="px-4 py-3 text-sm text-gray-700">11</td>
                <td className="px-4 py-3 text-sm text-gray-700">2.1 gün</td>
                <td className="px-4 py-3 text-sm text-gray-700">90%</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <button className="btn bg-[#13126e] text-white px-3 py-2 rounded mt-4">
          Detaylı Rapor İndir
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Öğrenci Bazlı Staj Kaydı Sorgulama</h2>
        
        <div className="mb-4">
          <div className="flex">
            <input 
              type="text" 
              className="border border-gray-300 rounded-lg p-2 flex-grow" 
              placeholder="Öğrenci numarası veya isim ile ara"
            />
            <button className="btn bg-[#13126e] text-white ml-2 px-3 py-2 rounded">
              Ara
            </button>
          </div>
        </div>
        
        <p className="text-sm text-gray-600">
          Bir öğrencinin tüm staj geçmişini görüntülemek için öğrenci numarası veya isim giriniz.
        </p>
      </div>
    </div>
  );
};

export default Reports;