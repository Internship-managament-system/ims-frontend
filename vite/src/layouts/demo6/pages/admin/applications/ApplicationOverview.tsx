// /src/layouts/demo6/pages/admin/applications/ApplicationOverview.tsx
import React from 'react';
import { Container } from '@/components';
import ApplicationStats from './components/ApplicationStats';
import PendingApplications from './components/PendingApplications';
import EvaluationResults from './components/EvaluationResults';

const ApplicationOverview: React.FC = () => {
  return (
    <Container>
      <div className="p-5">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Yönetimi - Genel Durum</h1>
          <p className="text-gray-600">
            Staj başvurularının genel durumunu görüntüleyin
          </p>
        </div>

        <div className="space-y-6">
          <ApplicationStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PendingApplications limit={5} />
            <EvaluationResults limit={5} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ApplicationOverview;