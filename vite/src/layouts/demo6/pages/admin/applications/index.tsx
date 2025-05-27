// /src/layouts/demo6/pages/admin/applications/index.tsx
import { Navigate } from 'react-router-dom';

// Ana applications route'unda overview sayfasına yönlendir
const ApplicationManagement = () => {
  return <Navigate to="/admin/applications/overview" replace />;
};

export default ApplicationManagement;