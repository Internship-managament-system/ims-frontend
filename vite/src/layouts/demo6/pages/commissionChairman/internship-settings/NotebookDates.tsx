// /src/layouts/demo6/pages/admin/internship-settings/NotebookDates.tsx
import React, { useState } from 'react';
import { Container } from '@/components';

interface DateRange {
  startDate: string;
  endDate: string;
}

const NotebookDates: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '2025-05-15',
    endDate: '2025-06-15'
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange>({
    startDate: '2025-05-15',
    endDate: '2025-06-15'
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(true);

  const handleSave = () => {
    // Validate dates
    if (new Date(tempDateRange.startDate) >= new Date(tempDateRange.endDate)) {
      alert("Başlangıç tarihi bitiş tarihinden önce olmalıdır.");
      return;
    }

    setIsSaving(true);

    // Simulated API call to save the setting
    setTimeout(() => {
      setDateRange(tempDateRange);
      setIsEditing(false);
      setIsSaving(false);
    }, 800);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <Container>
      <div className="p-5">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Staj Defteri Toplama Tarihleri</h2>

          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              Öğrencilerin staj defterlerini sisteme yükleyebileceği tarih aralığını belirleyin.
              Bu tarih aralığı dışında yalnızca mezun durumundaki öğrenciler staj defteri yükleyebilecektir.
            </p>

            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Başlangıç Tarihi
                    </label>
                    <input
                      type="date"
                      className="border border-gray-300 rounded-md p-2 w-full"
                      value={tempDateRange.startDate}
                      onChange={(e) => setTempDateRange({ ...tempDateRange, startDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bitiş Tarihi
                    </label>
                    <input
                      type="date"
                      className="border border-gray-300 rounded-md p-2 w-full"
                      value={tempDateRange.endDate}
                      onChange={(e) => setTempDateRange({ ...tempDateRange, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
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
                      setTempDateRange(dateRange);
                      setIsEditing(false);
                    }}
                    disabled={isSaving}
                  >
                    İptal
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Mevcut Tarih Aralığı</h3>
                  <button
                    className="btn bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setTempDateRange(dateRange);
                      setIsEditing(true);
                    }}
                  >
                    Düzenle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="block text-sm text-gray-500">Başlangıç Tarihi</span>
                    <span className="text-lg font-semibold text-[#13126e]">
                      {formatDate(dateRange.startDate)}
                    </span>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-500">Bitiş Tarihi</span>
                    <span className="text-lg font-semibold text-[#13126e]">
                      {formatDate(dateRange.endDate)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
                <div className="font-medium text-gray-900">Defter Toplama Aktif</div>
                <div className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                  {isActive ? 'Açık' : 'Kapalı'}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={isActive}
                  onChange={() => setIsActive(!isActive)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
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
                  Belirlenen tarih aralığında öğrenciler staj defterlerini sisteme yükleyebilecektir.
                  Bu tarih aralığının dışında normal öğrenciler defter yükleyemez, yalnızca mezun durumundaki öğrenciler
                  herhangi bir zamanda defter yükleyebilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default NotebookDates;