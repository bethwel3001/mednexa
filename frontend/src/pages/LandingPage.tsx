import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DoctorProfile } from '../types';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Video,
  Building2,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  User,
  Stethoscope,
  Mic
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { quickSwitchUser } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('Nairobi');
  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.getDoctors();
        setDoctors(res.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/patient/find-doctor?q=${encodeURIComponent(searchQuery)}&city=${city}`);
  };

  const handlePersonaLaunch = async (role: 'patient' | 'doctor' | 'facility_admin') => {
    await quickSwitchUser(role);
    if (role === 'doctor') navigate('/doctor/dashboard');
    else if (role === 'facility_admin') navigate('/facility/dashboard');
    else navigate('/patient/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-[#161613] font-sans antialiased selection:bg-[#D9F99D] selection:text-[#161613]">
      {/* ── Circular Floating Navbar (truerev & mainstack style) ── */}
      <Navbar />

      {/* ── Hero Section (Brief, Punchy, Purposeful) ── */}
      <section className="mx-auto max-w-5xl px-5 pt-32 pb-16 text-center sm:pt-40 sm:pb-20">
        {/* Chip */}
        <p className="inline-flex items-center gap-1.5 rounded-full bg-[#D9F99D] text-[#161613] px-3.5 py-1 text-xs font-semibold shadow-2xs">
          <span>●</span>
          <span>Kenya · verified doctors &amp; 24/7 casualty</span>
        </p>

        {/* Display Headline */}
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.04em] leading-[1.02]">
          Healthcare for how you live.{' '}
          <span className="font-serif italic font-normal text-emerald-800">Simply.</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-[#74736B]">
          Consult licensed physicians via video or schedule clinic visits at leading medical centers. Complete pre-intake simply and pay via M-Pesa.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/patient/find-doctor"
            className="inline-flex items-center gap-2 rounded-full bg-[#161613] hover:bg-black text-white px-6 py-3.5 text-sm font-semibold transition-all shadow-xs active:scale-95"
          >
            <span>Book a consultation</span>
            <ArrowRight className="w-4 h-4 text-[#D9F99D]" />
          </Link>

          <Link
            to="/patient/assistant"
            className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-[#F4F2EC] text-[#161613] border border-[#E8E6DD] px-6 py-3.5 text-sm font-semibold transition-all shadow-2xs active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Check symptoms</span>
          </Link>
        </div>

        {/* Clean, Functional Care Finder Input */}
        <form
          onSubmit={handleSearch}
          className="mx-auto mt-10 max-w-xl rounded-full border border-[#E8E6DD] bg-white p-2 shadow-soft flex items-center gap-2"
        >
          <div className="flex items-center gap-2.5 flex-1 px-3">
            <Search className="w-4 h-4 text-[#74736B] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctor, pediatrician, cardiologist..."
              className="w-full text-xs sm:text-sm bg-transparent focus:outline-none text-[#161613] placeholder-[#74736B]/70 font-medium"
            />
          </div>

          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="hidden sm:block text-xs bg-[#F4F2EC] rounded-full px-3 py-2 text-[#161613] font-semibold focus:outline-none border-none cursor-pointer"
          >
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="All">All Kenya</option>
          </select>

          <button
            type="submit"
            className="rounded-full bg-[#161613] hover:bg-black text-white text-xs font-semibold px-5 py-2.5 transition-all shadow-xs shrink-0"
          >
            Find
          </button>

          {/* Speech-to-Speech Feature (Added directly after Find) */}
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#161613] text-[#D9F99D] hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-xs"
            title="Speech-to-Speech Assistant (Msingi AI)"
            aria-label="Speech to Speech AI Assistant"
          >
            <Mic className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </button>
        </form>
      </section>

      {/* ── How It Works (Three Steps · truerev pastel cards) ── */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#74736B]">How it works</p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-tight">
            Three simple steps.{' '}
            <span className="font-serif italic font-normal text-emerald-800">That's it.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[28px] bg-[#DFF2E4] p-7 flex flex-col justify-between">
            <div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-[#161613] shadow-xs">
                1
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#161613]">
                Find your doctor
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#161613]/70">
                Browse verified specialists by specialty and city. See exact KMPDC license numbers and upfront consultation fees.
              </p>
            </div>
            <Link
              to="/patient/find-doctor"
              className="mt-6 text-xs font-bold text-[#161613] hover:underline inline-flex items-center gap-1"
            >
              Browse specialists →
            </Link>
          </article>

          <article className="rounded-[28px] bg-[#FFF0B8] p-7 flex flex-col justify-between">
            <div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-[#161613] shadow-xs">
                2
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#161613]">
                Pre-intake &amp; consult
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#161613]/70">
                Answer structured intake questions beforehand. Connect via secure video or attend an in-person clinic consultation.
              </p>
            </div>
            <Link
              to="/patient/assistant"
              className="mt-6 text-xs font-bold text-[#161613] hover:underline inline-flex items-center gap-1"
            >
              Try symptom check →
            </Link>
          </article>

          <article className="rounded-[28px] bg-[#FFE7CC] p-7 flex flex-col justify-between">
            <div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-bold text-[#161613] shadow-xs">
                3
              </span>
              <h3 className="mt-5 text-lg font-bold tracking-tight text-[#161613]">
                Notes, Rx &amp; M-Pesa
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#161613]/70">
                Receive doctor SOAP clinical notes and prescriptions in your records vault. Pay securely via Safaricom M-Pesa STK push.
              </p>
            </div>
            <Link
              to="/patient/appointments"
              className="mt-6 text-xs font-bold text-[#161613] hover:underline inline-flex items-center gap-1"
            >
              View records vault →
            </Link>
          </article>
        </div>
      </section>

      {/* ── Available Clinicians (Direct, Real Purpose) ── */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#74736B]">Live directory</p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-[#161613]">
              Featured practicing physicians
            </h2>
          </div>
          <Link
            to="/patient/find-doctor"
            className="text-xs font-bold text-[#161613] hover:text-[#74736B] inline-flex items-center gap-1"
          >
            <span>All doctors</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="rounded-[28px] border border-[#E8E6DD] bg-white p-6 shadow-soft hover:shadow-lift transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <img
                    src={doc.avatar_url}
                    alt={doc.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border border-[#E8E6DD]"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-[#161613] leading-snug">
                      {doc.full_name}
                    </h3>
                    <p className="text-xs font-medium text-emerald-800 mt-0.5">
                      {doc.speciality}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-mono bg-[#F4F2EC] px-2 py-0.5 rounded-full text-[#74736B]">
                      {doc.registration_number}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#74736B] line-clamp-2 leading-relaxed mb-4">
                  {doc.bio}
                </p>

                <div className="space-y-1 text-xs text-[#74736B] pt-3 border-t border-[#E8E6DD]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#74736B]" />
                    <span>{doc.clinic_address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#74736B]" />
                    <span>{doc.experience_years} years practice</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[#E8E6DD] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-[#74736B] block">Fee</span>
                  <span className="font-bold text-sm text-[#161613]">
                    KES {doc.fee.toLocaleString()}
                  </span>
                </div>
                <Link
                  to={`/patient/find-doctor?book=${doc.id}`}
                  className="rounded-full bg-[#161613] hover:bg-black text-white text-xs font-semibold px-4 py-2 transition-all shadow-xs"
                >
                  Book slot →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 24/7 Casualty & Hospital Hotline Card ── */}
      <section className="mx-auto max-w-5xl px-5 py-6">
        <div className="rounded-[30px] border border-rose-200 bg-[#FFF1F2] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#E11D48] mb-2 border border-rose-200">
              <span className="w-2 h-2 rounded-full bg-[#E11D48] animate-ping" />
              <span>National Emergency Care</span>
            </span>
            <h3 className="text-xl font-bold text-rose-950">
              Accredited Level 6 casualty &amp; emergency trauma units
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-rose-900">
              In an acute emergency, dial national hotlines immediately or visit Nairobi Hospital, Aga Khan, or Coast General Casualty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:999"
              className="inline-flex items-center gap-2 rounded-full bg-[#E11D48] hover:bg-rose-700 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call 999 / 112</span>
            </a>
            <Link
              to="/emergency"
              className="inline-flex items-center gap-1.5 rounded-full bg-white hover:bg-rose-50 text-rose-950 border border-rose-200 px-4 py-2.5 text-xs font-semibold transition-all"
            >
              <span>Casualty Directory →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Subtle Demo Persona Bar (Clean, Bottom of Page) ── */}
      <section className="mx-auto max-w-5xl px-5 py-10">
        <div className="rounded-[28px] border border-[#E8E6DD] bg-white p-6 text-center shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#74736B]">
            Testing &amp; Evaluation
          </p>
          <h4 className="mt-1 text-base font-bold text-[#161613]">
            Explore MedNexa across platform roles
          </h4>
          <p className="mt-1 text-xs text-[#74736B]">
            Quickly switch into demo accounts to test workflows:
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={() => handlePersonaLaunch('patient')}
              className="inline-flex items-center gap-2 rounded-full bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-4 py-2 text-xs font-semibold transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-700" />
              <span>Sarah Achieng (Patient)</span>
            </button>
            <button
              onClick={() => handlePersonaLaunch('doctor')}
              className="inline-flex items-center gap-2 rounded-full bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-4 py-2 text-xs font-semibold transition-colors"
            >
              <Stethoscope className="w-3.5 h-3.5 text-[#161613]" />
              <span>Dr. Brian Otieno (Doctor)</span>
            </button>
            <button
              onClick={() => handlePersonaLaunch('facility_admin')}
              className="inline-flex items-center gap-2 rounded-full bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-4 py-2 text-xs font-semibold transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-700" />
              <span>The Nairobi Hospital (Admin)</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Mainstack & truerev Sleek Dark Footer ── */}
      <Footer />

      {/* ── Speech-to-Speech Voice Assistant Modal (Msingi AI) ── */}
      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
};
