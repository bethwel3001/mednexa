import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type?: 'doctor' | 'facility';
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (id: string) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  markers,
  center = [-1.2921, 36.8219], // Default Nairobi
  zoom = 12,
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const customIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `
        <div style="background-color: #087E8B; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    markers.forEach((m) => {
      if (m.lat && m.lng) {
        const marker = L.marker([m.lat, m.lng], { icon: customIcon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family: system-ui, sans-serif; padding: 4px;">
            <div style="font-weight: 600; font-size: 13px; color: #0F172A;">${m.title}</div>
            <div style="font-size: 12px; color: #64748B; margin-top: 2px;">${m.subtitle || ''}</div>
          </div>
        `);
        if (onMarkerClick) {
          marker.on('click', () => onMarkerClick(m.id));
        }
      }
    });

    if (markers.length > 0 && markers[0].lat && markers[0].lng) {
      map.panTo([markers[0].lat, markers[0].lng]);
    }

    return () => {
      // Keep map alive or clean up
    };
  }, [markers, center, zoom]);

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/80 text-xs font-medium text-slate-700 shadow-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        OpenStreetMap Live Medical Network
      </div>
    </div>
  );
};
