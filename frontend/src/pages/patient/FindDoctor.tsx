import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { DoctorProfile } from '../../types';
import { ProviderCard } from '../../components/ProviderCard';
import { MapView } from '../../components/MapView';
import { BookingModal } from '../../components/BookingModal';
import { Search, Map, List, CheckCircle2, Loader2 } from 'lucide-react';

export const FindDoctor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCity = searchParams.get('city') || 'All';

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(initialQuery);
  const [speciality, setSpeciality] = useState('All');
  const [city, setCity] = useState(initialCity);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await api.getDoctors({
        q: query || undefined,
        speciality: speciality !== 'All' ? speciality : undefined,
        city: city !== 'All' ? city : undefined,
      });
      setDoctors(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [speciality, city]);

  // Auto-open booking modal when triggered by voice or link (?book=doc_1)
  useEffect(() => {
    const bookId = searchParams.get('book');
    if (bookId && doctors.length > 0) {
      const target = doctors.find((d) => d.id === bookId || d.id === `doc_${bookId}`);
      if (target) {
        setSelectedDoctor(target);
      }
    }
  }, [doctors, searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDoctors();
  };

  const specialities = [
    'All',
    'General Practitioner',
    'Cardiology',
    'Pediatrics & Family Medicine',
    'Obstetrics & Gynecology',
    'Orthopedics & Sports Medicine',
  ];

  const mapMarkers = doctors.map((d) => ({
    id: d.id,
    lat: d.latitude || -1.2921,
    lng: d.longitude || 36.8219,
    title: d.full_name,
    subtitle: `${d.speciality} • KES ${d.fee}`,
    type: 'doctor' as const,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Find Doctors & Specialists
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Book virtual telehealth consultations or clinic visits with Kenya's verified medical specialists.
          </p>
        </div>

        {/* View Toggle (Mainstack Segmented Pill) */}
        <div className="flex items-center gap-1 bg-[#F4F5F7] p-1 rounded-full border border-[#E9EBEF]">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white text-[#131316] shadow-xs'
                : 'text-[#56616B] hover:text-[#131316]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>List Cards</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              viewMode === 'map'
                ? 'bg-white text-[#131316] shadow-xs'
                : 'text-[#56616B] hover:text-[#131316]'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {bookingSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{bookingSuccessMsg}</span>
          </div>
          <button
            onClick={() => setBookingSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#8C94A0] absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor name, specialty, condition..."
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-xs bg-[#F4F5F7] border border-[#E9EBEF] rounded-full px-4 py-2.5 text-[#131316] font-semibold focus:outline-none"
            >
              <option value="All">All Regions</option>
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
            </select>

            <button
              type="submit"
              className="bg-[#131316] hover:bg-neutral-800 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xs transition-colors"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Speciality Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#EFF1F6]">
          {specialities.map((spec) => (
            <button
              key={spec}
              onClick={() => setSpeciality(spec)}
              className={`text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                speciality === spec
                  ? 'bg-[#131316] text-white shadow-xs font-semibold'
                  : 'bg-[#F4F5F7] text-[#56616B] hover:bg-[#E9EBEF]'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-3xl p-4 border border-[#EFF1F6] shadow-sm">
          <MapView
            markers={mapMarkers}
            onMarkerClick={(id) => {
              const doc = doctors.find((d) => d.id === id);
              if (doc) setSelectedDoctor(doc);
            }}
          />
        </div>
      )}

      {/* Doctor Cards */}
      {loading ? (
        <div className="py-16 text-center text-[#8C94A0]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#131316]" />
          <p className="text-xs">Finding available physicians...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EFF1F6]">
          <Search className="w-10 h-10 text-[#CBD0D6] mx-auto mb-3" />
          <h3 className="font-bold text-[#131316] text-sm mb-1">No doctors found</h3>
          <p className="text-xs text-[#8C94A0] max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or clearing filters.
          </p>
          <button
            onClick={() => {
              setQuery('');
              setSpeciality('All');
              setCity('All');
            }}
            className="text-xs font-semibold text-[#131316] hover:underline"
          >
            Reset all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <ProviderCard
              key={doctor.id}
              doctor={doctor}
              onBook={async (doc) => {
                try {
                  const detailed = await api.getDoctor(doc.id);
                  setSelectedDoctor(detailed || doc);
                } catch {
                  setSelectedDoctor(doc);
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onSuccess={(appointment) => {
            setBookingSuccessMsg(
              `Appointment requested with ${selectedDoctor.full_name}. You can review it under your Consultations tab.`
            );
          }}
        />
      )}
    </div>
  );
};
