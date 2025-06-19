// /src/routing/AppRoutingSetup.tsx
import { ReactElement } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { ErrorsRouting } from '@/errors';
import { Demo6Layout } from '@/layouts/demo6';
import { RequireAuth } from '@/auth/RequireAuth';
import { AuthPage } from '@/auth';
import UsersInfo from '../auth/pages/UsersInfo';
import LandingPage from '../pages/LandingPage';
import GeneralAnnouncements from '../pages/GeneralAnnouncements';
import InternshipAnnouncements from '../pages/InternshipAnnouncements';
import AnnouncementDetail from '../pages/AnnouncementDetail';

// Admin Pages
import AdminDashboard from '../layouts/demo6/pages/admin/Dashboard';
import FacultyManagement from '../layouts/demo6/pages/admin/faculty';
import DepartmentManagement from '../layouts/demo6/pages/admin/department';
import AdminSettings from '../layouts/demo6/pages/admin/settings';

// commissionChairman Pages
import Dashboard from '../layouts/demo6/pages/commissionChairman/Dashboard';
import CommissionManagement from '../layouts/demo6/pages/commissionChairman/commission';
import StudentQuery from '../layouts/demo6/pages/commissionChairman/students';
import Settings from '../layouts/demo6/pages/commissionChairman/settings';
import FAQManagement from '../layouts/demo6/pages/commissionChairman/faq';
import InternshipApplicationsPage from '../layouts/demo6/pages/commissionChairman/internship-applications';

// Application Management Components
import ApplicationEvaluations from '../layouts/demo6/pages/commissionChairman/applications/ApplicationEvaluations';
import ApplicationAssignments from '../layouts/demo6/pages/commissionChairman/applications/ApplicationAssignments';

// Internship Settings Pages
import {
  RejectionReasons,
  InternshipDetails,
  TypeManagement,
  TopicPool
} from '../layouts/demo6/pages/commissionChairman/internship-settings';

import DocumentManagement from '../layouts/demo6/pages/commissionChairman/internship-settings/documents';

// Student & Commission Pages
import StudentDashboard from '../layouts/demo6/pages/student/Dashboard';
import CommissionDashboard from '../layouts/demo6/pages/commission/Dashboard';
import AssignedApplications from '../layouts/demo6/pages/commission/AssignedApplications';
import AssignedNotebooks from '../layouts/demo6/pages/commission/AssignedNotebooks';
import CommissionSettings from '../layouts/demo6/pages/commission/settings';
import StudentSettings from '../layouts/demo6/pages/student/settings';
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
import NotebookUpload from '../layouts/demo6/pages/student/notebook-upload/NotebookUpload';
import InternshipApplicationPage from '../layouts/demo6/pages/student/InternshipApplication';
import MyApplicationsPage from '../layouts/demo6/pages/student/MyApplications';
import InternshipDetailPopup from '../pages/InternshipDetailPopup';



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
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="department" element={<DepartmentManagement />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Commission Chairman Routes */}
      <Route path="commissionChairman/*" element={
        <RequireAuth allowedRoles={['COMMISSION_CHAIRMAN']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="commission" element={<CommissionManagement />} />
        
        {/* Application Management Routes */}
        <Route path="applications/evaluations" element={<ApplicationEvaluations />} />
        <Route path="applications/assignments" element={<ApplicationAssignments />} />
        
        {/* Internship Applications Route */}
        <Route path="internship-applications" element={<InternshipApplicationsPage />} />
        
        <Route path="students" element={<StudentQuery />} />
        <Route path="settings" element={<Settings />} />
        
        {/* Internship Settings Routes */}
        <Route path="internship-settings/type-management" element={<TypeManagement />} />
        <Route path="internship-settings/topic-pool" element={<TopicPool />} />
        <Route path="internship-settings/documents" element={<DocumentManagement />} />
        <Route path="internship-settings/rejection-reasons" element={<RejectionReasons />} />
        <Route path="internship-settings/internship-details" element={<InternshipDetails />} />

       

        {/* FAQ Management Routes */}
        <Route path="faq" element={<FAQManagement />} />
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
        <Route path="notebook-upload" element={<NotebookUpload />} />
        <Route path="processes" element={<Processes />} />
        <Route path="notebook" element={<Notebook />} />
        <Route path="documents" element={<Documents />} />
        <Route path="faq" element={<Faq />} />
        <Route path="support" element={<Support />} />
        <Route path="profile" element={<Profile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="settings" element={<StudentSettings />} />
        
        {/* Internship Application Routes */}
        <Route path="internship-application" element={<InternshipApplicationPage />} />
        <Route path="application-form/:id" element={<InternshipApplicationPage />} />
        <Route path="my-applications" element={<MyApplicationsPage />} />
      </Route>

      {/* Commission Member Routes */}
      <Route path="commission/*" element={
        <RequireAuth allowedRoles={['COMMISSION_MEMBER']}>
          <Demo6Layout />
        </RequireAuth>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<CommissionDashboard />} />
        <Route path="assigned-applications" element={<AssignedApplications />} />
        <Route path="assigned-notebooks" element={<AssignedNotebooks />} />
        <Route path="settings" element={<CommissionSettings />} />
      </Route>

      {/* Home Route - Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Pages */}
      <Route path="/general-announcements" element={<GeneralAnnouncements />} />
      <Route path="/internship-announcements" element={<InternshipAnnouncements />} />
      <Route path="/announcement/:id" element={<AnnouncementDetail />} />

      {/* Popup Pages - Standalone pages without layout */}
      <Route path="/internship-detail-popup" element={<InternshipDetailPopup />} />

      {/* Dashboard Route - Role-based redirection for authenticated users */}
      <Route path="/dashboard" element={<RoleBasedDashboard />} />

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/error/404" />} />
    </Routes>
  );
};

export { AppRoutingSetup };