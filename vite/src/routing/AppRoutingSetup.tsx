// /src/routing/AppRoutingSetup.tsx
import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ErrorsRouting } from '@/errors';
import { Demo6Layout } from '@/layouts/demo6';
import { RequireAuth } from '@/auth/RequireAuth';
import { AuthPage } from '@/auth';
import UsersInfo from '../auth/pages/UsersInfo';
// Admin Pages
import Dashboard from '../layouts/demo6/pages/admin/Dashboard';
import CommissionManagement from '../layouts/demo6/pages/admin/commission';
import ApplicationManagement from '../layouts/demo6/pages/admin/applications';
import DocumentManagement from '../layouts/demo6/pages/admin/documents';
import StudentQuery from '../layouts/demo6/pages/admin/students';
import Settings from '../layouts/demo6/pages/admin/settings';

// New Internship Settings Pages
import {
  ApplicationPeriod,
  NotebookDates,
  RejectionReasons,
  InternshipDetails
} from '../layouts/demo6/pages/admin/internship-settings';

// Student & Commission Pages
import StudentDashboard from '../layouts/demo6/pages/student/Dashboard';
import CommissionDashboard from '../layouts/demo6/pages/commission/Dashboard';
import Unauthorized from '../layouts/demo6/Unauthorized';
import RoleBasedDashboard from './RoleBasedDashboard';

const AppRoutingSetup = (): ReactElement => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="auth/*" element={<AuthPage />} />

      <Route path="users/info" element={
        <RequireAuth>
          <UsersInfo />
        </RequireAuth>
      } />

      {/* Error Routes */}
      <Route path="error/*" element={<ErrorsRouting />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route path="admin/*" element={
        <RequireAuth allowedRoles={['ADMIN']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="commission" element={<CommissionManagement />} />
        <Route path="applications" element={<ApplicationManagement />} />
        <Route path="documents" element={<DocumentManagement />} />
        <Route path="students" element={<StudentQuery />} />

        <Route path="settings" element={<Settings />} />

        {/* New Internship Settings Routes */}
        <Route path="internship-settings/application-period" element={<ApplicationPeriod />} />
        <Route path="internship-settings/notebook-dates" element={<NotebookDates />} />
        <Route path="internship-settings/rejection-reasons" element={<RejectionReasons />} />
        <Route path="internship-settings/internship-details" element={<InternshipDetails />} />
      </Route>


      {/* Student Routes */}
      <Route path="student/*" element={
        <RequireAuth allowedRoles={['STUDENT']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
      </Route>

      {/* Commission Member Routes */}
      <Route path="commission/*" element={
        <RequireAuth allowedRoles={['COMMISSION_MEMBER']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CommissionDashboard />} />
      </Route>

      {/* Home Route - Role-based redirection */}
      <Route path="/" element={<RoleBasedDashboard />} />

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };