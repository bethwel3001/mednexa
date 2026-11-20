import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="px-3 pb-6 pt-16 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-[#161613] px-6 py-10 text-white sm:px-10 sm:py-12 shadow-lift">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          {/* Brand Info */}
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2.5 group" aria-label="MedNexa Home">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#D9F99D] font-serif text-xl italic text-[#161613] shadow-xs group-hover:scale-105 transition-transform">
                m
              </span>
              <span className="text-xl font-bold tracking-tight text-white">
                mednexa<span className="text-[#D9F99D] font-serif italic text-lg">.</span>
              </span>
            </Link>

            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Licensed healthcare access across Kenya. Consult verified physicians via video, discover 24/7 casualty centers, and complete pre-consultation intake simply.
            </p>

            <Link
              to="/patient/find-doctor"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D9F99D] hover:bg-lime-200 text-[#161613] px-5 py-2.5 text-xs font-bold transition-all shadow-xs"
            >
              <span>Book a consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Navigation Columns */}
          <div className="grid grid-cols-2 gap-8 text-xs sm:grid-cols-3">
            <div>
              <p className="mb-3 font-semibold text-white/40 uppercase tracking-wider text-[11px]">
                Care Access
              </p>
              <div className="space-y-2">
                <Link to="/patient/find-doctor" className="block text-white/75 hover:text-white transition-colors">
                  Find Doctors
                </Link>
                <Link to="/patient/find-facility" className="block text-white/75 hover:text-white transition-colors">
                  Casualty Centers
                </Link>
                <Link to="/patient/assistant" className="block text-white/75 hover:text-white transition-colors">
                  Symptom Intake
                </Link>
                <Link to="/patient/appointments" className="block text-white/75 hover:text-white transition-colors">
                  My Consultations
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-3 font-semibold text-white/40 uppercase tracking-wider text-[11px]">
                Emergency 24/7
              </p>
              <div className="space-y-2">
                <a href="tel:999" className="block text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                  National Dispatch: 999
                </a>
                <a href="tel:112" className="block text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                  Toll-Free: 112
                </a>
                <a href="tel:1199" className="block text-white/75 hover:text-white transition-colors">
                  Red Cross: 1199
                </a>
                <Link to="/emergency" className="block text-white/75 hover:text-white transition-colors">
                  Trauma Directory →
                </Link>
              </div>
            </div>

            <div>
              <p className="mb-3 font-semibold text-white/40 uppercase tracking-wider text-[11px]">
                Standards
              </p>
              <div className="space-y-2 text-white/75">
                <p>KMPDC Verified</p>
                <p>M-Pesa Express</p>
                <p>Digital Health Act (2023)</p>
                <p>Encrypted Telehealth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-white/40 sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} mednexa. All clinical rights reserved.</span>
          <span>Nairobi · Mombasa · Kisumu</span>
        </div>
      </div>
    </footer>
  );
};
