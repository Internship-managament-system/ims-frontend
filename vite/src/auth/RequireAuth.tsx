import { FC, ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ScreenLoader } from '@/components/loaders';
import { useAuthContext } from './useAuthContext';

interface RequireAuthProps {
  children?: ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
}

// Rol ve izinlere göre erişim kontrolü yapan bileşen
export const RequireAuth: FC<RequireAuthProps> = ({ 
  children, 
  allowedRoles = [], 
  allowedPermissions = [] 
}) => {
  const { auth, currentUser, loading } = useAuthContext();
  const location = useLocation();

  // Loading state - daha hassas kontrol
  if (loading) {
    return <ScreenLoader />;
  }

  // AUTH KONTROLÜ - ÖNCELİKLE bu kontrol yapılmalı
  if (!auth?.access_token || !currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // DEPARTMAN KONTROLÜ - /users/info sayfası haricinde kontrol yap
  // Bu sayede profil setup sırasında sonsuz döngü önlenir
  if (location.pathname !== '/users/info' && (!currentUser.departmentId || currentUser.departmentId === '')) {
    console.log('RequireAuth - Redirecting to profile setup, current path:', location.pathname, 'departmentId:', currentUser.departmentId);
    return <Navigate to="/users/info" replace />;
  }

  // ROL KONTROLÜ - Auth kontrolünden sonra
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // İZİN KONTROLÜ - Rol kontrolünden sonra
  if (allowedPermissions.length > 0) {
    const hasRequiredPermission = allowedPermissions.some(permission => 
      currentUser.permissions?.includes(permission)
    );

    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  // Tüm kontroller başarılı - render et
  return children ? <>{children}</> : <Outlet />;
};

// Mevcut kullanım için geriye dönük uyumlu basit RequireAuth bileşeni
export const SimpleRequireAuth = () => {
  const { auth, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  return auth?.access_token ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default RequireAuth;