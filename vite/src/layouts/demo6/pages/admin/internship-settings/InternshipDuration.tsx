import React, { useState } from 'react';
import { Container } from '@/components';

const InternshipDuration: React.FC = () => {
  const [internshipDays, setInternshipDays] = useState<number>(20);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempValue, setTempValue] = useState<number>(20);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = () => {
    if (tempValue < 1) {
      alert("Staj süresi en az 1 gün olmalıdır.");
      return;
    }
    
    setIsSaving(true);
    
    // Simulated API call to save the setting
    setTimeout(() => {
      setInternshipDays(tempValue);
      setIsEditing(false);
      setIsSaving(false);
    }, 800);
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Staj Süresi Ayarı</h2>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Öğrencilerin yapacağı stajın kaç gün süreceğini belirleyin. Bu değer staj başvuru formundaki 
              bitiş tarihi hesaplaması için kullanılır.
            </p>
            
            {isEditing ? (
              <div className="flex items-end gap-4">
                <div className="w-full max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staj Süresi (Gün)
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="90"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={tempValue}
                    onChange={(e) => setTempValue(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    className="btn bg-[#13126e] text-white px-4 py-2 rounded"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button 
                    className="btn bg-gray-200 text-gray-800 px-4 py-2 rounded"
                    onClick={() => {
                      setTempValue(internshipDays);
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <h3 className="font-medium text-gray-900">Mevcut Ayar</h3>
                  <p className="text-lg font-semibold text-[#13126e]">
                    {internshipDays} gün
                  </p>
                </div>
                <button 
                  className="btn bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setTempValue(internshipDays);
                    setIsEditing(true);
                  }}
                >
                  Düzenle
                </button>
              </div>
            )}
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0 text-yellow-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Bu ayar değiştirildiğinde, öğrencilerin staj başlangıç tarihlerini seçerken karşılaşacakları minimum süre değişecektir.
                  Mevcut başvuruları etkilemez.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default InternshipDuration; 