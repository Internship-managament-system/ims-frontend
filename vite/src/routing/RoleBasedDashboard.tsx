// /src/routing/RoleBasedDashboard.tsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/auth';

// Redirects users to the appropriate dashboard based on their role
const RoleBasedDashboard = () => {
  const { currentUser, logout } = useAuthContext();

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    // Kullanıcı bilgilerini kontrol et
    const userRole = currentUser.role;
    const hasRequiredFields = currentUser.name && currentUser.surname && currentUser.email;

    if (!hasRequiredFields) {
      // Eksik bilgiler varsa kullanıcı bilgileri sayfasına yönlendir
      return;
    }

    // Role-based redirection
    switch (userRole) {
      case 'COMMISSION_CHAIRMAN':
        return;
      case 'COMMISSION_MEMBER':
        return;
      case 'STUDENT':
        // Öğrenci için departman kontrolü
        if (!currentUser.departmentId) {
          // Departman bilgisi eksikse profil kurulum sayfasına yönlendir
          return;
        }
        return;
      case 'ADMIN':
        return;
      default:
        // Tanımsız rol için logout
        logout?.();
        return;
    }
  }, [currentUser, logout]);

  return null; // Bu component sadece yönlendirme yapar
};

export default RoleBasedDashboard;