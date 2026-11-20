import React from 'react';
import { Facility } from '../types';
import { Building2, Phone, MapPin, Star, BedDouble, Navigation, ShieldCheck } from 'lucide-react';

interface FacilityCardProps {
  facility: Facility;
  distanceKm?: number | null;
  onSelect?: (facility: Facility) => void;
}

export const FacilityCard: React.FC<FacilityCardProps> = ({ facility, distanceKm }) => {
  return (
    <div className="bg-white rounded-3xl border border-[#EFF1F6] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Facility Image */}
        <div className="relative h-48 w-full bg-[#F4F5F7] overflow-hidden">
          <img
            src={facility.image_url || 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'}
            alt={facility.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3.5 left-3.5 flex gap-2">
            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-[#131316] shadow-xs border border-white">
              {facility.facility_type}
            </span>
            <span className="bg-[#131316] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-xs">
              {facility.operating_hours}
            </span>
          </div>

          <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-[#131316] shadow-xs flex items-center gap-1 border border-white">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Accredited</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-bold text-[#131316] text-base mb-1">
            {facility.name}
          </h3>

          <div className="flex items-center justify-between gap-1.5 text-xs text-[#8C94A0] mb-4">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-[#8C94A0] flex-shrink-0" />
              <span className="truncate">{facility.address}, {facility.city}</span>
            </div>
            {distanceKm !== undefined && distanceKm !== null && (
              <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-[#DFF2E4] border border-emerald-200 px-2.5 py-0.5 rounded-full">
                <span>{distanceKm} km away</span>
              </span>
            )}
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {facility.services.slice(0, 4).map((service, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-[#F4F5F7] text-[#56616B] px-2.5 py-1 rounded-full"
              >
                {service}
              </span>
            ))}
            {facility.services.length > 4 && (
              <span className="text-[11px] font-medium text-[#8C94A0] px-1 py-1">
                +{facility.services.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 pt-3 border-t border-[#EFF1F6] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[#56616B]">
          <BedDouble className="w-4 h-4 text-emerald-600" />
          <span>{facility.beds_available} beds open</span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${facility.emergency_phone || facility.phone}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#E11D48] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-rose-200/60 px-3 py-1.5 rounded-full transition-colors"
          >
            <Phone className="w-3 h-3" />
            <span>Emergency</span>
          </a>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.name + ' ' + facility.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#131316] hover:bg-[#F4F5F7] border border-[#E9EBEF] px-3 py-1.5 rounded-full transition-colors"
          >
            <Navigation className="w-3 h-3" />
            <span>Directions</span>
          </a>
        </div>
      </div>
    </div>
  );
};
