// /pages/admin/commission/components/CommissionTable.tsx
import React from 'react';

const CommissionTable: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-4">Ad Soyad</th>
            <th className="text-left py-4">Rol</th>
            <th className="text-left py-4">Durum</th>
            <th className="text-left py-4">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {/* Üye listesi map edilecek */}
        </tbody>
      </table>
    </div>
  );
};

export default CommissionTable;