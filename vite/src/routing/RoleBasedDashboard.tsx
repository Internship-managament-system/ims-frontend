// /src/routing/RoleBasedDashboard.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';

// Redirects users to the appropriate dashboard based on their role
const RoleBasedDashboard: React.FC = () => {
  const { currentUser, loading, hasRole } = useAuthContext();

  useEffect(() => {
    // Kullanıcı bilgisinde değişiklik olduğunda tarayıcı konsoluna yazdır (sadece debug için)
    if (currentUser) {
      console.log('RoleBasedDashboard - Current user info:', {
        id: currentUser.id,
        role: currentUser.role,
        hasDepartmentId: !!currentUser.departmentId,
        hasFacultyId: !!currentUser.facultyId
      });
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#13126e] rounded-full"></div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!currentUser) {
    return <Navigate to="/auth/login" replace />;
  }

  // Belirtilen roller için yönlendirme
  if (hasRole('ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Departman kontrolü - Admin rolü değilse ve departman eksikse yönlendir
  // null, undefined veya boş string kontrolü yap
  if (!currentUser.departmentId || currentUser.departmentId === '') {
    console.log('RoleBasedDashboard - Redirecting to profile setup, departmentId:', currentUser.departmentId);
    return <Navigate to="/users/info" replace />;
  }
  
  if (hasRole('COMMISSION_CHAIRMAN')) {
    return <Navigate to="/commissionChairman/dashboard" replace />;
  }

  if (hasRole('COMMISSION_MEMBER')) {
    return <Navigate to="/commission/dashboard" replace />;
  }

  if (hasRole('STUDENT')) {
    return <Navigate to="/student/dashboard" replace />;
  }

  // Tanımlanmamış rol için yetkisiz sayfasına yönlendir
  return <Navigate to="/unauthorized" replace />;
};

export default RoleBasedDashboard;