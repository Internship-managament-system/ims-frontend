// /src/layouts/demo6/pages/admin/applications/ApplicationAssignments.tsx
import React from 'react';
import { Container } from '@/components';
import AssignmentPanel from './components/AssignmentPanel';

const ApplicationAssignments: React.FC = () => {
  return (
    <Container className="min-h-screen bg-white">
      <div className="pt-8 px-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Yönetimi - Atamalar</h1>
          <p className="text-gray-600">
            Komisyon üyelerine başvuru ve staj defteri atamalarını yönetin
          </p>
        </div>

        <div className="space-y-6">
          <AssignmentPanel />
        </div>
      </div>
    </Container>
  );
};

export default ApplicationAssignments;