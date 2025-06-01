// /src/layouts/demo6/pages/admin/applications/ApplicationEvaluations.tsx
import React from 'react';
import { Container } from '@/components';
import EvaluationResults from './components/EvaluationResults';

const ApplicationEvaluations: React.FC = () => {
  return (
    <Container className="min-h-screen bg-white">
      <div className="pt-8 px-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Yönetimi - Değerlendirmeler</h1>
          <p className="text-gray-600">
            Staj başvuru değerlendirme sonuçlarını görüntüleyin
          </p>
        </div>

        <div className="space-y-6">
          <EvaluationResults />
        </div>
      </div>
    </Container>
  );
};

export default ApplicationEvaluations;