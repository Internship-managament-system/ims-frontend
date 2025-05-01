// /pages/admin/Dashboard/index.tsx
import React from 'react';
import { Container } from '@/components';
import StatusCards from './components/StatusCards';
import SystemStatus from './components/SystemStatus';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <div className="p-5">
        <StatusCards />
        
        <div className="mt-6">
          <SystemStatus />
        </div>

        
      </div>
    </Container>
  );
};

export default Dashboard;