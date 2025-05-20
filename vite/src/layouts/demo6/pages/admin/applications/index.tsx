// src/layouts/demo6/pages/admin/applications/index.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import AssignmentStatus from './components/AssignmentStatus';
import EvaluationTracker from './components/EvoluationTracker';
import PendingApplications from './components/PendingApplications';
import ApplicationFilters from './components/ApplicationFilters';

const ApplicationManagement: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <Container>
      <div className="p-5">
        <ApplicationFilters
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <AssignmentStatus 
            pendingApplications={5}
            internshipNotebooks={3}
            graduateNotebooks={2}
          />
          <EvaluationTracker />
        </div>

        <div className="mt-6">
          <PendingApplications />
        </div>
      </div>
    </Container>
  );
};

export default ApplicationManagement;