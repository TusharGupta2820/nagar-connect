import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { FieldWorkerLayout } from '../layouts/FieldWorkerLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import { Home } from '../pages/public/Home';
import { ReportIssue } from '../pages/public/ReportIssue';
import { TrackComplaint } from '../pages/public/TrackComplaint';
import { RoadSafetyMap } from '../pages/public/RoadSafetyMap';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Admin Pages
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { ComplaintManagement } from '../pages/admin/ComplaintManagement';
import { ComplaintDetails } from '../pages/admin/ComplaintDetails';
import { RoadIssueMap } from '../pages/admin/RoadIssueMap';
import { WardManagement } from '../pages/admin/WardManagement';
import { DepartmentManagement } from '../pages/admin/DepartmentManagement';
import { Analytics } from '../pages/admin/Analytics';
import { UserManagement } from '../pages/admin/UserManagement';
import { AuditLogs } from '../pages/admin/AuditLogs';

// Field Worker Pages
import { FieldDashboard } from '../pages/field/FieldDashboard';
import { AssignedComplaints } from '../pages/field/AssignedComplaints';
import { InspectionDetails } from '../pages/field/InspectionDetails';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Citizen / Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="report" element={<ReportIssue />} />
        <Route path="track" element={<TrackComplaint />} />
        <Route path="road-safety-map" element={<RoadSafetyMap />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Admin Module Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin', 'officer']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="complaints/:id" element={<ComplaintDetails />} />
        <Route path="map" element={<RoadIssueMap />} />
        <Route path="wards" element={<WardManagement />} />
        <Route path="departments" element={<DepartmentManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="audit-logs" element={<AuditLogs />} />
      </Route>

      {/* Field Worker Module Routes */}
      <Route
        path="/field"
        element={
          <ProtectedRoute allowedRoles={['field_worker', 'officer', 'admin']}>
            <FieldWorkerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FieldDashboard />} />
        <Route path="complaints" element={<AssignedComplaints />} />
        <Route path="complaints/:id" element={<InspectionDetails />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

