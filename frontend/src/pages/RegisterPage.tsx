import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, UserCheck, Stethoscope } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [speciality, setSpeciality] = useState('General Practitioner');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        role,
        full_name: fullName,
        email,
        phone,
        password,
        speciality: role === 'doctor' ? speciality : undefined,
      });

      if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
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
        <h2 className="text-xl font-bold text-[#131316]">Create your account</h2>
        <p className="text-xs text-[#56616B] mt-1">
          Modern healthcare consultations and medical records in Kenya.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 rounded-3xl border border-[#EFF1F6] shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-[#E11D48]">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button
              type="button"
              onClick={() => setRole('patient')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                role === 'patient'
                  ? 'border-[#131316] bg-[#131316] text-white shadow-xs'
                  : 'border-[#EFF1F6] text-[#56616B] hover:border-neutral-300 bg-[#FAFAFB]'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Patient</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('doctor')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                role === 'doctor'
                  ? 'border-[#131316] bg-[#131316] text-white shadow-xs'
                  : 'border-[#EFF1F6] text-[#56616B] hover:border-neutral-300 bg-[#FAFAFB]'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Doctor</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={role === 'doctor' ? 'Dr. Jane Doe' : 'Jane Wambui'}
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                Mobile Number (for M-Pesa)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
              />
            </div>

            {role === 'doctor' && (
              <div>
                <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                  Medical Specialty
                </label>
                <select
                  value={speciality}
                  onChange={(e) => setSpeciality(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                >
                  <option value="General Practitioner">General Practitioner</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Pediatrics & Family Medicine">Pediatrics & Family Medicine</option>
                  <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
                  <option value="Orthopedics & Sports Medicine">Orthopedics & Sports Medicine</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-full shadow-xs text-xs flex items-center justify-center gap-2 transition-all mt-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Complete Registration</span>}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-[#56616B]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#131316] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
