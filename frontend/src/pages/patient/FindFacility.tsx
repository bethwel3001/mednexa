import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Facility } from '../../types';
import { FacilityCard } from '../../components/FacilityCard';
import { MapView } from '../../components/MapView';
import { useLocation } from '../../context/LocationContext';
import { Search, Map, List, Loader2, MapPin, Navigation, Compass } from 'lucide-react';

export const FindFacility: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { location, requestCurrentLocation, isDetecting, calculateDistanceTo } = useLocation();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('All');
  const [sortByDistance, setSortByDistance] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Check ?nearMe=true from voice command
  useEffect(() => {
    if (searchParams.get('nearMe') === 'true') {
      setSortByDistance(true);
    }
  }, [searchParams]);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const data = await api.getFacilities({
        q: query || undefined,
        city: city !== 'All' ? city : undefined,
      });
      setFacilities(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, [city]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFacilities();
  };

  // Sort facilities by proximity if enabled
  const sortedFacilities = [...facilities].sort((a, b) => {
    if (!sortByDistance) return 0;
    const distA = calculateDistanceTo(a.latitude, a.longitude) ?? 9999;
    const distB = calculateDistanceTo(b.latitude, b.longitude) ?? 9999;
    return distA - distB;
  });

  const mapMarkers = sortedFacilities.map((f) => ({
    id: f.id,
    lat: f.latitude,
    lng: f.longitude,
    title: f.name,
    subtitle: `${f.facility_type} • ${f.city} • Open ${f.operating_hours}`,
    type: 'facility' as const,
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Accredited Hospitals & Clinics
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Directory of tertiary referral hospitals, casualty trauma centers, and diagnostic clinics.
          </p>
        </div>

        {/* View Toggle */}
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

      {/* Live Location & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm space-y-3">
        {/* Patient Location Pill */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFF1F6]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-[#131316]">
              Your Location: <span className="font-extrabold">{location.address}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSortByDistance(!sortByDistance)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                sortByDistance
                  ? 'bg-[#161613] text-white shadow-xs'
                  : 'bg-[#F4F5F7] text-[#56616B] hover:text-[#131316]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Nearest First</span>
            </button>

            <button
              onClick={() => requestCurrentLocation()}
              disabled={isDetecting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#DFF2E4] hover:bg-[#D0ECD7] text-emerald-950 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isDetecting ? 'Detecting GPS...' : 'Update My GPS'}</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#8C94A0] absolute left-4 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search hospital name, diagnostic services, trauma unit..."
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
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="bg-white rounded-3xl p-4 border border-[#EFF1F6] shadow-sm">
          <MapView markers={mapMarkers} />
        </div>
      )}

      {/* Facilities Cards */}
      {loading ? (
        <div className="py-16 text-center text-[#8C94A0]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#131316]" />
          <p className="text-xs">Loading accredited facilities...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedFacilities.map((fac) => (
            <FacilityCard
              key={fac.id}
              facility={fac}
              distanceKm={calculateDistanceTo(fac.latitude, fac.longitude)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
