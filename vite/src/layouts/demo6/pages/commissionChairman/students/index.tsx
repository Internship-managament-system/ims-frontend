// /pages/admin/students/index.tsx
import React from 'react';
import { Container } from '@/components';

const StudentQuery: React.FC = () => {
  return (
    <Container>
      <div className="p-5">
        {/* Arama formu */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Öğrenci Arama</h2>
          {/* Arama formu component'i gelecek */}
        </div>

        {/* Sonuçlar tablosu */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Arama Sonuçları</h2>
          {/* Tablo component'i gelecek */}
        </div>
      </div>
    </Container>
  );
};

export default StudentQuery;