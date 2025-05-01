// /src/routing/RoleBasedDashboard.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';

// Redirects users to the appropriate dashboard based on their role
const RoleBasedDashboard: React.FC = () => {
  const { currentUser, loading, hasRole } = useAuthContext();
  
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#13126e] rounded-full"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }
  
  if (hasRole('ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  if (hasRole('COMMISSION_MEMBER')) {
    return <Navigate to="/commission/dashboard" replace />;
  }
  
  if (hasRole('STUDENT')) {
    return <Navigate to="/student/dashboard" replace />;
  }
  
  return <Navigate to="/unauthorized" replace />;
};

export default RoleBasedDashboard;