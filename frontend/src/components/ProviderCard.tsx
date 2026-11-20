import React from 'react';
import { DoctorProfile } from '../types';
import { ShieldCheck, MapPin, CheckCircle, Video, Users, Calendar, ArrowRight } from 'lucide-react';

interface ProviderCardProps {
  doctor: DoctorProfile;
  onBook: (doctor: DoctorProfile) => void;
  onViewProfile?: (doctor: DoctorProfile) => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ doctor, onBook, onViewProfile }) => {
  return (
    <div className="group bg-white rounded-3xl border border-[#EFF1F6] p-6 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Header */}
        <div className="flex items-start gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={doctor.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
              alt={doctor.full_name}
              className="w-16 h-16 rounded-2xl object-cover object-top border border-neutral-100 shadow-xs"
              loading="lazy"
            />
            {doctor.verification_status === 'verified' && (
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-xs" title="KMPDC Verified Physician">
                <CheckCircle className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-[#131316] text-sm truncate group-hover:text-neutral-700 transition-colors">
                {doctor.full_name}
              </h3>
              <div className="flex items-center gap-1 bg-[#F4F5F7] px-2 py-0.5 rounded-full text-[11px] font-mono text-[#525866] border border-[#EFF1F6] flex-shrink-0" title="Medical Board Registration">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{doctor.registration_number || 'KMPDC Verified'}</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#56616B] mt-0.5">{doctor.speciality}</p>
            
            <div className="flex items-center gap-1 text-[11px] text-[#8C94A0] mt-1">
              <MapPin className="w-3 h-3 text-[#8C94A0] flex-shrink-0" />
              <span className="truncate">{doctor.hospital_affiliation || doctor.clinic_address || doctor.city}</span>
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        {doctor.bio && (
          <p className="text-xs text-[#56616B] mt-3.5 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        )}

        {/* Tags / Pills */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-[#EFF1F6]">
          <span className="text-[11px] font-medium bg-[#F4F5F7] text-[#56616B] px-2.5 py-1 rounded-full">
            {doctor.experience_years} yrs exp
          </span>

          {doctor.consultation_types?.includes('teleconsultation') && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-100">
              <Video className="w-3 h-3 text-emerald-600" />
              Video Telehealth
            </span>
          )}

          <span className="text-[11px] text-[#8C94A0] bg-[#F4F5F7] px-2.5 py-1 rounded-full">
            {doctor.languages?.join(', ')}
          </span>
        </div>
      </div>

      {/* Footer / Fee & CTA */}
      <div className="mt-5 pt-4 border-t border-[#EFF1F6] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block">Consultation</span>
          <span className="text-sm font-extrabold text-[#131316]">
            KES {doctor.fee.toLocaleString()}
          </span>
        </div>

        <button
          onClick={() => onBook(doctor)}
          className="inline-flex items-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-all"
        >
          <span>Book Slot</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
