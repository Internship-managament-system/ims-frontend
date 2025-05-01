// /layouts/demo6/pages/admin/Dashboard/components/StatusCards.tsx
import React from 'react';

const StatusCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {/* Toplam Öğrenci Sayısı */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Toplam Öğrenci</p>
            <h3 className="text-2xl font-bold text-gray-900">250</h3>
          </div>
          <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Bekleyen Başvurular */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Bekleyen Başvurular</p>
            <h3 className="text-2xl font-bold text-gray-900">18</h3>
          </div>
          <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Onaylanan Stajlar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Onaylanan Stajlar</p>
            <h3 className="text-2xl font-bold text-green-600">78</h3>
          </div>
          <div className="p-2 bg-green-100 text-green-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Kısmen Kabul */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Kısmen Kabul</p>
            <h3 className="text-2xl font-bold text-yellow-600">12</h3>
          </div>
          <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
        </div>
      </div>

      {/* Reddedilen Stajlar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Reddedilen Stajlar</p>
            <h3 className="text-2xl font-bold text-red-600">21</h3>
          </div>
          <div className="p-2 bg-red-100 text-red-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Bekleyen Defterler */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Bekleyen Defterler</p>
            <h3 className="text-2xl font-bold text-purple-600">15</h3>
          </div>
          <div className="p-2 bg-purple-100 text-purple-700 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusCards;