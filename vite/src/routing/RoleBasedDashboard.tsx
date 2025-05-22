// /src/routing/RoleBasedDashboard.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';

// Redirects users to the appropriate dashboard based on their role
const RoleBasedDashboard: React.FC = () => {
  const { currentUser, loading, hasRole } = useAuthContext();

  useEffect(() => {
    // Kullanıcı bilgisinde değişiklik olduğunda tarayıcı konsoluna yazdır
    if (currentUser) {
      console.log('Current user info:', currentUser);
      console.log('Has department ID:', !!currentUser.departmentId);
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

  // // Yeni eklenen profil kontrolü:
  // if (!currentUser.facultyId || !currentUser.departmentId) {
  //   return <Navigate to="/users/info" replace />;
  // }

  // Departman kontrolü
  if (!currentUser.departmentId) {
    return <Navigate to="/users/info" replace />;
  }

  // Belirtilen roller için yönlendirme
  if (hasRole('ADMIN')) {
    return <Navigate to="/admin/dashboard" replace />;
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