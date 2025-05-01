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

  if (loading) {
    return <ScreenLoader />;
  }

  // Kullanıcı giriş yapmamışsa login sayfasına yönlendir
  if (!auth || !currentUser) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Belirtilen roller varsa, kullanıcının rolünü kontrol et
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Belirtilen izinler varsa, kullanıcının izinlerini kontrol et
  if (allowedPermissions.length > 0) {
    const hasRequiredPermission = allowedPermissions.some(permission => 
      currentUser.permissions?.includes(permission)
    );

    if (!hasRequiredPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // children prop varsa onu render et, yoksa Outlet'i render et
  return children ? <>{children}</> : <Outlet />;
};

// Mevcut kullanım için geriye dönük uyumlu basit RequireAuth bileşeni
export const SimpleRequireAuth = () => {
  const { auth, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <ScreenLoader />;
  }

  return auth ? <Outlet /> : <Navigate to="/auth/login" state={{ from: location }} replace />;
};

export default RequireAuth;