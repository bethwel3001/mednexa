import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { EmergencyDirectory } from '../../types';
import { useLocation } from '../../context/LocationContext';
import { Phone, AlertTriangle, Navigation, Building2, Clock, Loader2, MapPin, Radio } from 'lucide-react';

export const EmergencyGuidance: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { location, requestCurrentLocation } = useLocation();
  const [directory, setDirectory] = useState<EmergencyDirectory | null>(null);
  const [loading, setLoading] = useState(true);
  const [broadcastActive, setBroadcastActive] = useState(false);

  useEffect(() => {
    if (searchParams.get('broadcast') === 'true') {
      setBroadcastActive(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchEmergencies = async () => {
      try {
        const data = await api.getEmergencies();
        setDirectory(data);
        api.recordEmergencyAccess().catch(() => {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencies();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Notice Card */}
      <div className="bg-[#FFF1F2] border border-rose-200 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E11D48] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-rose-950 tracking-tight">
              Emergency Hotlines & 24/7 Trauma Centers
            </h1>
            <p className="text-xs text-rose-900 mt-2 leading-relaxed">
              MedNexa connects patients for scheduled teleconsultations and clinic visits. For life-threatening emergencies, immediate physical trauma, or acute chest pain, please call national dispatch immediately or proceed to the nearest casualty department.
            </p>
          </div>
        </div>
      </div>

      {/* Live GPS Emergency Location Dispatch Banner */}
      <div className="bg-white border-2 border-[#E11D48]/30 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#E11D48] flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse text-[#E11D48]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#131316]">Your Live Emergency Location</h3>
                <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                  GPS Active
                </span>
              </div>
              <p className="text-xs text-[#56616B] mt-0.5">
                {location.address} (Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setBroadcastActive(true);
                requestCurrentLocation();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E11D48] hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{broadcastActive ? 'Location Shared with 999 Dispatch' : 'Share GPS with 999 Dispatch'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Immediate Hotlines */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#E11D48]" />
          <h2 className="font-bold text-[#131316] text-sm">
            Toll-Free & National Emergency Hotlines (Tap to Call)
          </h2>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#8C94A0]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#E11D48]" />
            Loading hotlines...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {directory?.hotlines.map((hotline, idx) => (
              <a
                key={idx}
                href={`tel:${hotline.number.split('/')[0].trim()}`}
                className="group p-4 rounded-2xl border border-[#EFF1F6] hover:border-rose-300 hover:bg-rose-50/20 transition-all flex items-center justify-between shadow-2xs"
              >
                <div>
                  <h3 className="font-bold text-[#131316] text-xs group-hover:text-rose-700 transition-colors">
                    {hotline.name}
                  </h3>
                  <div className="text-lg font-black text-[#131316] font-mono mt-0.5">
                    {hotline.number}
                  </div>
                  {hotline.alt && (
                    <span className="text-[10px] text-[#8C94A0] block mt-0.5">
                      Alt: {hotline.alt}
                    </span>
                  )}
                </div>

                <div className="w-9 h-9 rounded-full bg-[#F4F5F7] group-hover:bg-[#E11D48] group-hover:text-white flex items-center justify-center text-[#56616B] transition-all flex-shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Trauma Referral Centers */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#131316]" />
          <h2 className="font-bold text-[#131316] text-sm">
            24/7 Verified Emergency Casualty Hospitals
          </h2>
        </div>

        <div className="space-y-3">
          {directory?.primary_trauma_centers.map((center, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-[#EFF1F6] bg-[#F8F9FA] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-[#131316] text-xs">{center.name}</h4>
                  <span className="text-[10px] bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full">
                    {center.city}
                  </span>
                </div>
                <p className="text-[11px] text-[#56616B] mt-0.5">{center.address}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold mt-1">
                  <Clock className="w-3 h-3" />
                  <span>{center.hours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${center.phone}`}
                  className="inline-flex items-center gap-1.5 bg-[#E11D48] hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-full transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{center.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(center.name + ' ' + center.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 bg-white hover:bg-neutral-50 text-[#131316] font-semibold text-xs px-3 py-2 rounded-full border border-[#E9EBEF] transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
