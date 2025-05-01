// /pages/admin/reports/index.tsx
import React from 'react';
import { Container } from '@/components';

const Reports: React.FC = () => {
  return (
    <Container>
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rapor kartları */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Başvuru İstatistikleri</h3>
            {/* Grafik component'i gelecek */}
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Onay Oranları</h3>
            {/* Grafik component'i gelecek */}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Reports;