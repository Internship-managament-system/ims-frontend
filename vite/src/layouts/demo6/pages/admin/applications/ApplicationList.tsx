// /src/layouts/demo6/pages/admin/applications/ApplicationList.tsx
import React, { useState } from 'react';
import { Container } from '@/components';
import ApplicationFilters from './components/ApplicationFilters';
import PendingApplications from './components/PendingApplications';

const ApplicationList: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <Container>
      <div className="p-5">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Başvuru Yönetimi - Başvurular</h1>
          <p className="text-gray-600">
            Tüm staj başvurularını görüntüleyin ve yönetin
          </p>
        </div>

        <div className="space-y-6">
          <ApplicationFilters
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
          />
          <PendingApplications />
        </div>
      </div>
    </Container>
  );
};

export default ApplicationList;