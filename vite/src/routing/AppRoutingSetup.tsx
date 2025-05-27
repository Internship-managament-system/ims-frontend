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
import DocumentManagement from '../layouts/demo6/pages/admin/documents';
import StudentQuery from '../layouts/demo6/pages/admin/students';
import Settings from '../layouts/demo6/pages/admin/settings';

// Application Management Components
import ApplicationOverview from '../layouts/demo6/pages/admin/applications/ApplicationOverview';
import ApplicationList from '../layouts/demo6/pages/admin/applications/ApplicationList';
import ApplicationEvaluations from '../layouts/demo6/pages/admin/applications/ApplicationEvaluations';
import ApplicationAssignments from '../layouts/demo6/pages/admin/applications/ApplicationAssignments';

// Internship Settings Pages
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
import Processes from '../layouts/demo6/pages/student/processes/Processes';
import Notebook from '../layouts/demo6/pages/student/notebook/Notebook';
import Faq from '../layouts/demo6/pages/student/faq/Faq';
import Support from '../layouts/demo6/pages/student/support/Support';
import Profile from '../layouts/demo6/pages/student/profile/Profile';
import ChangePassword from '../layouts/demo6/pages/student/profile/ChangePassword';
import Applications from '../layouts/demo6/pages/student/applications/Applications';
import Documents from '../layouts/demo6/pages/student/documents/Documents';

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
        
        {/* Application Management Routes */}
        <Route path="applications/overview" element={<ApplicationOverview />} />
        <Route path="applications/list" element={<ApplicationList />} />
        <Route path="applications/evaluations" element={<ApplicationEvaluations />} />
        <Route path="applications/assignments" element={<ApplicationAssignments />} />
        
        <Route path="documents" element={<DocumentManagement />} />
        <Route path="students" element={<StudentQuery />} />
        <Route path="settings" element={<Settings />} />

        {/* Internship Settings Routes */}
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
        <Route path="applications" element={<Applications />} />
        <Route path="processes" element={<Processes />} />
        <Route path="notebook" element={<Notebook />} />
        <Route path="documents" element={<Documents />} />
        <Route path="faq" element={<Faq />} />
        <Route path="support" element={<Support />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
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