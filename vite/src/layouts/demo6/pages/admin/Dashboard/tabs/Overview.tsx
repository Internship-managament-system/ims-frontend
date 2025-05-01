// /layouts/demo6/pages/admin/Dashboard/tabs/Overview.tsx
import React from 'react';
import StatusCards from '../components/StatusCards';
import PendingApplications from '../components/PendingApplications';
import AssignmentStatus from '../components/AssignmentStatus';
import CommissionStats from '../components/CommissionStats';
import SystemStatus from '../components/SystemStatus';

const Overview: React.FC = () => {
  return (
    <>
      <StatusCards />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <PendingApplications />
        </div>
        <div>
          <AssignmentStatus />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <CommissionStats />
        <SystemStatus />
      </div>
    </>
  );
};

export default Overview;