// /layouts/demo6/pages/admin/Dashboard/tabs/Settings.tsx
import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [minDays, setMinDays] = useState(14);
  const [startDate, setStartDate] = useState('2025-03-01');
  const [endDate, setEndDate] = useState('2025-05-30');
  const [exemptGraduates, setExemptGraduates] = useState(true);
  const [autoAssign, setAutoAssign] = useState(true);
  const [chatbotActive, setChatbotActive] = useState(true);
  
  const [rejectionReasons, setRejectionReasons] = useState([
    "Belgeler eksik veya hatalı",
    "Staj tarihleri uygun değil",
    "Staj yeri uygun değil",
    "İmzalar eksik"
  ]);
  
  const [newReason, setNewReason] = useState("");
  
  const addRejectionReason = () => {
    if (newReason) {
      setRejectionReasons([...rejectionReasons, newReason]);
      setNewReason("");
    }
  };
  
  const removeRejectionReason = (index: number) => {
    setRejectionReasons(rejectionReasons.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-6">
      {/* Başvuru Tarihi Ayarları */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Başvuru Tarihi Ayarları</h2>
        <div className="max-w-md">
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Minimum Başvuru Süresi (gün)</label>
            <div className="flex">
              <input 
                type="number" 
                className="border border-gray-300 rounded-lg p-2 w-full" 
                value={minDays}
                onChange={(e) => setMinDays(parseInt(e.target.value))}
                min={1}
              />
              <button className="btn bg-[#13126e] text-white ml-2 px-3 py-2 rounded">Kaydet</button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Staj başvurusunda seçilebilecek minimum tarih için gün sayısı
            </p>
          </div>
        </div>
      </div>
      
      {/* Staj Defteri Teslim Aralığı */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Staj Defteri Teslim Aralığı</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Başlangıç Tarihi</label>
            <input 
              type="date" 
              className="border border-gray-300 rounded-lg p-2 w-full" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Bitiş Tarihi</label>
            <input 
              type="date" 
              className="border border-gray-300 rounded-lg p-2 w-full" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center mt-3">
          <input 
            type="checkbox" 
            className="mr-2" 
            checked={exemptGraduates}
            onChange={(e) => setExemptGraduates(e.target.checked)}
          />
          <label className="text-sm text-gray-600">Mezunlar için tarih kısıtını kaldır</label>
        </div>
        <button className="btn bg-[#13126e] text-white px-3 py-2 rounded mt-4">Kaydet</button>
      </div>
      
      {/* Atama Algoritması Ayarları */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Atama Algoritması Ayarları</h2>
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Otomatik Atama</h3>
            <p className="text-sm text-gray-600">
              Yeni başvuruları otomatik olarak komisyon üyelerine ata
            </p>
          </div>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="toggle" 
              id="toggle" 
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={autoAssign}
              onChange={(e) => setAutoAssign(e.target.checked)}
            />
            <label 
              htmlFor="toggle" 
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${autoAssign ? 'bg-green-500' : 'bg-gray-300'}`}
            ></label>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Bu özellik açıkken, yeni başvurular sistem tarafından komisyon üyelerine sırayla atanır.
          </p>
        </div>
      </div>
      
      {/* Red Gerekçeleri Yönetimi */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Red Gerekçeleri Yönetimi</h2>
        <div className="mb-4">
          <div className="flex">
            <input 
              type="text" 
              className="border border-gray-300 rounded-lg p-2 flex-grow" 
              placeholder="Yeni red gerekçesi ekle"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
            />
            <button 
              className="btn bg-[#13126e] text-white ml-2 px-3 py-2 rounded"
              onClick={addRejectionReason}
            >
              Ekle
            </button>
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2">Mevcut Gerekçeler</h3>
          <ul className="space-y-2">
            {rejectionReasons.map((reason, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{reason}</span>
                <button 
                  className="text-red-500"
                  onClick={() => removeRejectionReason(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Komisyon üyeleri ayrıca "Diğer" seçeneği ile özel açıklama da yazabilirler.
          </p>
        </div>
      </div>
      
      {/* Chatbot Yönetimi */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Chatbot Yönetimi</h2>
          <div className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <input 
              type="checkbox" 
              name="chatbot-toggle" 
              id="chatbot-toggle" 
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              checked={chatbotActive}
              onChange={(e) => setChatbotActive(e.target.checked)}
            />
            <label 
              htmlFor="chatbot-toggle" 
              className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${chatbotActive ? 'bg-green-500' : 'bg-gray-300'}`}
            ></label>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Sıkça Sorulan Sorular</h3>
            <p className="text-sm text-gray-600 mb-3">
              Chatbot'un cevap vereceği sıkça sorulan soruları düzenleyin
            </p>
            <button className="btn bg-[#13126e] text-white px-3 py-2 rounded">
              SSS Düzenle
            </button>
          </div>
          <div>
            <h3 className="font-medium mb-2">Kullanıcı Mesajları</h3>
            <p className="text-sm text-gray-600 mb-3">
              Kullanıcıların chatbot'a sorduğu soruları görüntüleyin
            </p>
            <button className="btn bg-[#13126e] text-white px-3 py-2 rounded">
              Mesajları Görüntüle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;