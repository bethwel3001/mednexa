import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, UserCheck, Stethoscope, Building2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, quickSwitchUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('patient@mednexa.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (role: 'patient' | 'doctor' | 'facility_admin') => {
    setLoading(true);
    try {
      await quickSwitchUser(role);
      if (role === 'doctor') navigate('/doctor/dashboard');
      else if (role === 'facility_admin') navigate('/facility/dashboard');
      else navigate('/patient/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
          <div className="w-9 h-9 rounded-2xl bg-[#131316] text-white flex items-center justify-center font-bold text-base shadow-xs group-hover:scale-105 transition-transform">
            <span className="font-extrabold tracking-tighter">M</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#131316]">MedNexa</span>
        </Link>
        <h2 className="text-xl font-bold text-[#131316]">Sign in to your account</h2>
        <p className="text-xs text-[#56616B] mt-1">
          Access your consultations, health records, or clinician queue.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-[#EFF1F6] shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-[#E11D48]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-full shadow-xs text-xs flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-6 border-t border-[#EFF1F6]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C94A0] block mb-3 text-center">
              Instant Demo Access
            </span>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('patient')}
                className="w-full text-left p-3 rounded-2xl border border-[#EFF1F6] hover:bg-[#FAFAFB] transition-colors flex items-center justify-between text-xs font-medium text-[#131316]"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sarah Achieng (Patient)</span>
                </div>
                <span className="text-[10px] text-[#8C94A0]">patient@mednexa.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('doctor')}
                className="w-full text-left p-3 rounded-2xl border border-[#EFF1F6] hover:bg-[#FAFAFB] transition-colors flex items-center justify-between text-xs font-medium text-[#131316]"
              >
                <div className="flex items-center gap-2.5">
                  <Stethoscope className="w-4 h-4 text-[#131316]" />
                  <span>Dr. Brian Otieno (Doctor)</span>
                </div>
                <span className="text-[10px] text-[#8C94A0]">doctor@mednexa.com</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('facility_admin')}
                className="w-full text-left p-3 rounded-2xl border border-[#EFF1F6] hover:bg-[#FAFAFB] transition-colors flex items-center justify-between text-xs font-medium text-[#131316]"
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Nairobi Hospital Admin</span>
                </div>
                <span className="text-[10px] text-[#8C94A0]">admin@mednexa.com</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-[#56616B]">
            Need an account?{' '}
            <Link to="/register" className="font-bold text-[#131316] hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
