import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, ArrowRight, ShieldCheck, Stethoscope, Building2 } from 'lucide-react';

interface NavbarProps {
  onOpenBooking?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenBooking }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const navLinks = [
    { label: 'Find Doctors', path: '/patient/find-doctor' },
    { label: 'Hospitals & Casualty', path: '/patient/find-facility' },
    { label: 'Symptom Check', path: '/patient/assistant' },
    { label: 'Emergency', path: '/emergency', emergency: true },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-6">
      {open && (
        <button
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 cursor-default bg-[#161613]/25 backdrop-blur-[2px] md:hidden"
        />
      )}

      <div className="relative mx-auto max-w-5xl">
        {/* ── Circular / Pill Bar (Mainstack / truerev Floating Design) ── */}
        <div className="flex min-h-[58px] items-center gap-2 rounded-full border border-[#E8E6DD]/90 bg-white/95 py-1.5 pl-2.5 pr-2 shadow-soft backdrop-blur-xl sm:pl-3.5 sm:pr-2.5">
          {/* Creative Brand Monogram & Mark */}
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

          {/* Desktop Centre Navigation (Brief & purposeful - NO role clutter) */}
          <nav aria-label="Main Navigation" className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
            {navLinks.map((item) => {
              const active = location.pathname === item.path;
              if (item.emergency) {
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold text-[#E11D48] hover:bg-rose-50 transition-colors flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] animate-pulse" />
                    <span>{item.label}</span>
                  </Link>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? 'bg-[#161613] text-white font-semibold shadow-2xs'
                      : 'text-[#74736B] hover:bg-[#F4F2EC] hover:text-[#161613]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <Link
              to="/login"
              className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-[#161613] hover:text-[#74736B] transition-colors"
            >
              Sign in
            </Link>

            <Link
              to="/patient/find-doctor"
              onClick={onOpenBooking}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#161613] hover:bg-black text-white text-xs font-semibold px-4 py-2 transition-all shadow-xs active:scale-95"
            >
              <span>Book consult</span>
              <ArrowRight className="w-3 h-3 text-[#D9F99D]" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close Menu' : 'Open Menu'}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#F4F2EC] text-base font-bold text-[#161613] hover:bg-[#E8E6DD] transition-all md:hidden"
            >
              {open ? '✕' : '≡'}
            </button>
          </div>
        </div>

        {/* ── Mobile Circular Panel (truerev style) ── */}
        {open && (
          <div className="relative mt-2 overflow-hidden rounded-[26px] border border-[#E8E6DD] bg-white p-4 shadow-lift md:hidden animate-fadeIn">
            <p className="px-2 pb-1.5 pt-1 text-[10px] font-bold uppercase tracking-wider text-[#74736B]">
              Quick Navigation
            </p>
            <div className="divide-y divide-[#E8E6DD]/70">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`flex min-h-[46px] w-full items-center justify-between rounded-xl px-2 text-left text-xs font-semibold transition-colors ${
                    item.emergency
                      ? 'text-[#E11D48] hover:bg-rose-50'
                      : 'text-[#161613] hover:bg-[#F4F2EC]'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[#74736B]">→</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#E8E6DD] flex flex-col gap-2">
              <Link
                to="/patient/find-doctor"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#161613] text-white text-xs font-bold hover:bg-black transition-colors"
              >
                Book a consultation →
              </Link>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="w-full text-center py-2 rounded-full border border-[#E8E6DD] text-xs font-semibold text-[#161613] hover:bg-[#F4F2EC] transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
