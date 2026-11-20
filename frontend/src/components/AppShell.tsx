import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useLocation as usePatientLocation } from '../context/LocationContext';
import { VoiceAssistantModal } from './VoiceAssistantModal';
import {
  Bell,
  Phone,
  ChevronDown,
  User,
  ShieldCheck,
  Stethoscope,
  Building2,
  LogOut,
  Mic,
  MapPin
} from 'lucide-react';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, quickSwitchUser } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { location: patientLoc, requestCurrentLocation, isDetecting } = usePatientLocation();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const role = user?.role || 'patient';

  const navLinks = [
    { label: 'Overview', path: role === 'doctor' ? '/doctor/dashboard' : role === 'facility_admin' ? '/facility/dashboard' : '/patient/dashboard' },
    { label: 'Find Doctors', path: '/patient/find-doctor' },
    { label: 'Hospitals', path: '/patient/find-facility' },
    { label: 'Consultations', path: '/patient/appointments' },
    { label: 'Symptom Intake', path: '/patient/assistant' },
    { label: 'Records', path: '/patient/records' },
    { label: 'Care Tracker', path: '/patient/recovery' },
  ];

  const handleRoleChange = async (targetRole: 'patient' | 'doctor' | 'facility_admin') => {
    setShowUserDropdown(false);
    await quickSwitchUser(targetRole);
    if (targetRole === 'doctor') navigate('/doctor/dashboard');
    else if (targetRole === 'facility_admin') navigate('/facility/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-[#161613] flex flex-col font-sans selection:bg-[#D9F99D] selection:text-[#161613]">
      {/* ── Circular Floating Header (truerev & mainstack style) ── */}
      <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
        <div className="relative mx-auto max-w-6xl">
          <div className="flex min-h-[58px] items-center gap-2 rounded-full border border-[#E8E6DD]/90 bg-white/95 py-1.5 pl-2.5 pr-2 shadow-soft backdrop-blur-xl sm:pl-3.5 sm:pr-2.5">
            {/* Creative Logo */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-transform hover:scale-[1.02]"
              aria-label="MedNexa Home"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#161613] font-serif text-xl italic text-[#D9F99D] shadow-xs">
                m
              </span>
              <span className="text-[17px] font-bold tracking-tight text-[#161613]">
                mednexa<span className="text-emerald-500 font-serif italic text-lg">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav aria-label="App Navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 xl:gap-1 lg:flex">
              {navLinks.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      active
                        ? 'bg-[#161613] text-white font-semibold shadow-2xs'
                        : 'text-[#74736B] hover:bg-[#F4F2EC] hover:text-[#161613]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
              {/* Location Badge */}
              <button
                onClick={() => requestCurrentLocation()}
                title={`Your Location: ${patientLoc.address}. Tap to refresh GPS.`}
                className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#161613] bg-[#F4F2EC] hover:bg-[#E8E6DD] rounded-full px-3 py-1.5 border border-[#E8E6DD] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[100px]">{isDetecting ? 'Locating...' : patientLoc.area || 'Kilimani'}</span>
              </button>

              {/* Emergency Hotline Pill */}
              <Link
                to="/emergency"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[#E11D48] bg-rose-50 hover:bg-rose-100 rounded-full px-3 py-1.5 border border-rose-200 transition-colors"
              >
                <span>Emergency 999</span>
              </Link>

              {/* Notifications Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative grid h-9 w-9 place-items-center rounded-full text-[#74736B] hover:text-[#161613] hover:bg-[#F4F2EC] transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E11D48]" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-lift border border-[#E8E6DD] overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4 border-b border-[#E8E6DD] flex items-center justify-between">
                      <h4 className="font-bold text-[#161613] text-xs">Notifications</h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] text-[#74736B] hover:text-[#161613] font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-[#E8E6DD]/70">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#74736B]">
                          No notifications right now
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.link) navigate(n.link);
                              setShowNotifications(false);
                            }}
                            className={`p-3.5 text-xs hover:bg-[#FBFAF7] cursor-pointer transition-colors ${
                              !n.is_read ? 'bg-amber-50/30' : ''
                            }`}
                          >
                            <div className="font-semibold text-[#161613] mb-0.5">{n.title}</div>
                            <p className="text-[#74736B] leading-relaxed text-[11px]">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Clean User Avatar Circle (No "Patient Doctor Hospital" text in navbar) */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 p-1 rounded-full border border-[#E8E6DD] hover:border-neutral-400 bg-white transition-all shadow-2xs"
                  aria-label="User Account"
                >
                  <div className="w-8 h-8 rounded-full bg-[#161613] text-white text-xs font-bold flex items-center justify-center">
                    {user?.profile?.display_name?.charAt(0) || user?.profile?.full_name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[#74736B] mr-1" />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-lift border border-[#E8E6DD] p-2.5 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-[#E8E6DD]/70 mb-1.5">
                      <p className="font-bold text-xs text-[#161613] leading-none">
                        {user?.profile?.display_name || user?.profile?.full_name || 'Sarah Achieng'}
                      </p>
                      <p className="text-[10px] text-[#74736B] capitalize mt-1">
                        Active: {role.replace('_', ' ')}
                      </p>
                    </div>

                    <div className="px-3 py-1 text-[10px] font-bold text-[#74736B] uppercase tracking-wider">
                      Switch Active Persona
                    </div>
                    <button
                      onClick={() => handleRoleChange('patient')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        role === 'patient' ? 'bg-[#F4F2EC] font-bold text-[#161613]' : 'text-[#74736B] hover:bg-[#FBFAF7]'
                      }`}
                    >
                      <span>Patient (Sarah Achieng)</span>
                      {role === 'patient' && <span className="w-1.5 h-1.5 rounded-full bg-[#161613]" />}
                    </button>
                    <button
                      onClick={() => handleRoleChange('doctor')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        role === 'doctor' ? 'bg-[#F4F2EC] font-bold text-[#161613]' : 'text-[#74736B] hover:bg-[#FBFAF7]'
                      }`}
                    >
                      <span>Doctor (Dr. Brian Otieno)</span>
                      {role === 'doctor' && <span className="w-1.5 h-1.5 rounded-full bg-[#161613]" />}
                    </button>
                    <button
                      onClick={() => handleRoleChange('facility_admin')}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        role === 'facility_admin' ? 'bg-[#F4F2EC] font-bold text-[#161613]' : 'text-[#74736B] hover:bg-[#FBFAF7]'
                      }`}
                    >
                      <span>Nairobi Hospital (Admin)</span>
                      {role === 'facility_admin' && <span className="w-1.5 h-1.5 rounded-full bg-[#161613]" />}
                    </button>

                    <div className="my-1.5 border-t border-[#E8E6DD]/70" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserDropdown(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#E11D48] hover:bg-rose-50 font-medium flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F4F2EC] text-base font-bold text-[#161613] hover:bg-[#E8E6DD] transition-all lg:hidden"
              >
                {mobileMenuOpen ? '✕' : '≡'}
              </button>
            </div>
          </div>

          {/* Mobile dropdown nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-2 rounded-[26px] border border-[#E8E6DD] bg-white p-3 shadow-lift animate-fadeIn space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-xl px-3 text-left text-xs font-semibold ${
                    location.pathname === item.path ? 'bg-[#161613] text-white' : 'text-[#74736B] hover:bg-[#F4F2EC]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[#74736B]">→</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 pt-24 sm:pt-28 pb-12">
        {children}
      </main>

      {/* Sleek Minimalist Footer (Mainstack & truerev Inspired) */}
      <footer className="border-t border-[#E8E6DD] bg-white py-6 text-xs text-[#74736B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#161613]">mednexa.</span>
            <span>•</span>
            <span>Healthcare designed for how you live.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Nairobi • Mombasa • Kisumu</span>
            <span>•</span>
            <Link to="/emergency" className="text-[#E11D48] font-semibold hover:underline">
              Emergency Hotlines
            </Link>
          </div>
        </div>
      </footer>

      {/* ── Floating Voice Assistant Trigger (Msingi AI Speech to Speech) ── */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="group relative flex items-center gap-2 rounded-full bg-[#161613] hover:bg-black text-[#D9F99D] p-3 sm:px-4 sm:py-3 shadow-lift hover:scale-105 active:scale-95 transition-all"
          title="Speech-to-Speech Assistant (Msingi AI)"
          aria-label="Speech to Speech AI Assistant"
        >
          <Mic className="w-5 h-5 text-[#D9F99D]" />
          <span className="hidden sm:inline text-xs font-bold text-white tracking-tight">
            Voice Care
          </span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      </div>

      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
};
