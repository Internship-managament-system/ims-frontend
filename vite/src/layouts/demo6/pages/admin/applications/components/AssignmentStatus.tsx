// /src/layouts/demo6/pages/admin/Dashboard/components/AssignmentStatus.tsx
import React from 'react';

const AssignmentStatus: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm h-full">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Atanmamış İşlemler</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-100">
          <div>
            <p className="font-medium">Bekleyen Başvurular</p>
            <p className="text-sm text-gray-600">Atama bekleyen başvurular</p>
          </div>
          <div>
            <span className="text-lg font-bold text-yellow-700">5</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-100">
          <div>
            <p className="font-medium">Staj Defterleri</p>
            <p className="text-sm text-gray-600">Değerlendirici atanmamış</p>
          </div>
          <div>
            <span className="text-lg font-bold text-blue-700">3</span>
          </div>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-100">
          <div>
            <p className="font-medium">Mezun Defterleri</p>
            <p className="text-sm text-gray-600">Mezunlardan gelen defterler</p>
          </div>
          <div>
            <span className="text-lg font-bold text-purple-700">2</span>
          </div>
        </div>
        <button className="btn bg-[#13126e] text-white w-full py-2 px-4 rounded mt-4">
          Otomatik Atama Yap
        </button>
      </div>
    </div>
  );
};

export default AssignmentStatus;