import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ErrorsRouting } from '@/errors';
import { Demo6Layout } from '@/layouts/demo6';
import { RequireAuth } from '@/auth/RequireAuth';
import { AuthPage } from '@/auth';

// Rol bazlı dashboard sayfaları
import AdminDashboard from '../layouts/demo6/pages/admin/Dashboard';
import StudentDashboard from '../layouts/demo6/pages/student/Dashboard';
import CommissionDashboard from '../layouts/demo6/pages/commission/Dashboard';
import Unauthorized from '../layouts/demo6/Unauthorized';
import RoleBasedDashboard from './RoleBasedDashboard';

// Öğrenci sayfaları
import { RequiredDocuments } from '../layouts/demo6/pages/student/RequiredDocuments/RequiredDocuments';
import InternshipApplicationPage from '../layouts/demo6/pages/student/InternshipApplication/InternshipApplicationPage';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="auth/*" element={<AuthPage />} />

      {/* Error Routes */}
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route path="admin/*" element={
        <RequireAuth allowedRoles={['ADMIN']}>
          <AdminDashboard />
        </RequireAuth>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        {/* Diğer admin sayfaları buraya eklenebilir */}
      </Route>

      {/* Student Routes */}
      <Route path="student/*" element={
        <RequireAuth allowedRoles={['STUDENT']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="documents/required" element={<RequiredDocuments />} />
        <Route path="internship/application" element={<InternshipApplicationPage />} />
        {/* Diğer öğrenci sayfaları buraya eklenebilir */}
      </Route>

      {/* Commission Member Routes */}
      <Route path="commission/*" element={
        <RequireAuth allowedRoles={['COMMISSION_MEMBER']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route path="dashboard" element={<CommissionDashboard />} />
        {/* Diğer komisyon üyesi sayfaları buraya eklenebilir */}
      </Route>

      {/* Eskiden varolan dashboard erişimi - geriye dönük uyumluluk için */}
      <Route path="dashboard/*" element={
        <RequireAuth>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route path="documents/required" element={<RequiredDocuments />} />
      </Route>

      {/* Ana Sayfa - Rol bazlı yönlendirme */}
      <Route path="/" element={<RoleBasedDashboard />} />

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };