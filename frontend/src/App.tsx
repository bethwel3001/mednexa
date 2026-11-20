import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppShell } from './components/AppShell';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { FindDoctor } from './pages/patient/FindDoctor';
import { FindFacility } from './pages/patient/FindFacility';
import { Appointments } from './pages/patient/Appointments';
import { SymptomIntake } from './pages/patient/SymptomIntake';
import { MedicalRecords } from './pages/patient/MedicalRecords';
import { RecoveryTracking } from './pages/patient/RecoveryTracking';
import { DoctorDashboard } from './pages/doctor/DoctorDashboard';
import { DoctorSchedule } from './pages/doctor/DoctorSchedule';
import { FacilityDashboard } from './pages/facility/FacilityDashboard';
import { EmergencyGuidance } from './pages/emergency/EmergencyGuidance';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <NotificationProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Application Shell Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <AppShell>
                  <PatientDashboard />
                </AppShell>
              }
            />
            <Route
              path="/patient/find-doctor"
              element={
                <AppShell>
                  <FindDoctor />
                </AppShell>
              }
            />
            <Route
              path="/patient/find-facility"
              element={
                <AppShell>
                  <FindFacility />
                </AppShell>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <AppShell>
                  <Appointments />
                </AppShell>
              }
            />
            <Route
              path="/patient/assistant"
              element={
                <AppShell>
                  <SymptomIntake />
                </AppShell>
              }
            />
            <Route
              path="/patient/records"
              element={
                <AppShell>
                  <MedicalRecords />
                </AppShell>
              }
            />
            <Route
              path="/patient/recovery"
              element={
                <AppShell>
                  <RecoveryTracking />
                </AppShell>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <AppShell>
                  <DoctorDashboard />
                </AppShell>
              }
            />
            <Route
              path="/doctor/schedule"
              element={
                <AppShell>
                  <DoctorSchedule />
                </AppShell>
              }
            />

            {/* Facility Routes */}
            <Route
              path="/facility/dashboard"
              element={
                <AppShell>
                  <FacilityDashboard />
                </AppShell>
              }
            />

            {/* Emergency Guidance */}
            <Route
              path="/emergency"
              element={
                <AppShell>
                  <EmergencyGuidance />
                </AppShell>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </NotificationProvider>
      </LocationProvider>
    </AuthProvider>
  </BrowserRouter>
  );
};

export default App;
