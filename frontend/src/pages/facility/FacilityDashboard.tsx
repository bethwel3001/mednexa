import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Facility } from '../../types';
import { Building2, BedDouble, Phone, Stethoscope, Clock, CheckCircle2 } from 'lucide-react';

export const FacilityDashboard: React.FC = () => {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacility = async () => {
      setLoading(true);
      try {
        const list = await api.getFacilities();
        if (list && list.length > 0) {
          setFacility(list[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, []);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            {facility?.name || 'The Nairobi Hospital'} Console
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Maintain facility profiles, monitor casualty trauma bed availability, and oversee medical departments.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-800 border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accredited Tertiary Referral Facility</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Available Beds</span>
            <BedDouble className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">
            {facility?.beds_available || 38}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Casualty & ICU open</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Casualty Hours</span>
            <Clock className="w-4 h-4 text-[#131316]" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">24/7</div>
          <span className="text-[11px] text-[#56616B] font-medium mt-1 block">Emergency intake active</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Clinicians</span>
            <Stethoscope className="w-4 h-4 text-[#131316]" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">14</div>
          <span className="text-[11px] text-[#56616B] font-medium mt-1 block">On-call specialists</span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Patient Score</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">4.9 / 5.0</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Verified patient reviews</span>
        </div>
      </div>

      {/* Facility Details Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-5">
          <h3 className="font-bold text-[#131316] text-base">Facility Profile & Operational Departments</h3>
          
          <div className="rounded-2xl overflow-hidden h-52 w-full bg-[#F4F5F7]">
            <img
              src={facility?.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'}
              alt="Facility"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs bg-[#F8F9FA] p-4 rounded-2xl border border-[#EFF1F6]">
            <div>
              <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Address</span>
              <span className="font-semibold text-[#131316]">{facility?.address}, {facility?.city}</span>
            </div>
            <div>
              <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">General Enquiries</span>
              <span className="font-semibold text-[#131316]">{facility?.phone}</span>
            </div>
            <div>
              <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Emergency Line</span>
              <span className="font-bold text-[#E11D48]">{facility?.emergency_phone}</span>
            </div>
            <div>
              <span className="text-[#8C94A0] block text-[10px] uppercase font-bold">Accreditation</span>
              <span className="font-semibold text-emerald-700">Kenya Ministry of Health Level 6</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block mb-2">
              Clinical Services & Specialized Units
            </span>
            <div className="flex flex-wrap gap-2">
              {facility?.services?.map((svc, i) => (
                <span
                  key={i}
                  className="bg-white border border-[#E9EBEF] text-[#131316] text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Doctors */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
          <h3 className="font-bold text-[#131316] text-base">Clinicians On-Duty</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-[#EFF1F6]">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200"
                alt="Doctor"
                className="w-10 h-10 rounded-xl object-cover object-top"
              />
              <div className="text-xs">
                <h4 className="font-bold text-[#131316]">Dr. Brian Otieno</h4>
                <p className="text-[#8C94A0] text-[11px]">Pediatrics & General</p>
                <span className="text-[10px] text-emerald-600 font-semibold">● Available for Booking</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-[#EFF1F6]">
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200"
                alt="Doctor"
                className="w-10 h-10 rounded-xl object-cover object-top"
              />
              <div className="text-xs">
                <h4 className="font-bold text-[#131316]">Dr. Wanjiru Mwangi</h4>
                <p className="text-[#8C94A0] text-[11px]">Cardiology</p>
                <span className="text-[10px] text-emerald-600 font-semibold">● In Consultation</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-[#F8F9FA] rounded-2xl border border-[#EFF1F6]">
              <img
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200"
                alt="Doctor"
                className="w-10 h-10 rounded-xl object-cover object-top"
              />
              <div className="text-xs">
                <h4 className="font-bold text-[#131316]">Dr. David Kiprop</h4>
                <p className="text-[#8C94A0] text-[11px]">Primary Care</p>
                <span className="text-[10px] text-emerald-600 font-semibold">● Available for Booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
