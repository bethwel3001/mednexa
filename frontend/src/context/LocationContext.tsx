import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface PatientLocation {
  latitude: number;
  longitude: number;
  address: string;
  area: string;
  city: string;
  accuracy?: number;
  isLive: boolean;
  lastUpdated: string;
}

interface LocationContextType {
  location: PatientLocation;
  requestCurrentLocation: () => Promise<void>;
  setLocationArea: (area: string) => Promise<void>;
  isDetecting: boolean;
  permissionStatus: 'prompt' | 'granted' | 'denied';
  calculateDistanceTo: (targetLat?: number, targetLng?: number) => number | null;
}

const DEFAULT_LOCATION: PatientLocation = {
  latitude: -1.2921,
  longitude: 36.7842,
  address: 'Argwings Kodhek Rd, Kilimani, Nairobi',
  area: 'Kilimani',
  city: 'Nairobi',
  isLive: false,
  lastUpdated: new Date().toISOString(),
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<PatientLocation>(DEFAULT_LOCATION);
  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied'>('prompt');

  // Load saved location on start
  useEffect(() => {
    const fetchStoredLocation = async () => {
      try {
        const res = await api.getPatientLocation();
        if (res && res.latitude && res.longitude) {
          setLocation({
            latitude: res.latitude,
            longitude: res.longitude,
            address: res.address || DEFAULT_LOCATION.address,
            area: res.area || DEFAULT_LOCATION.area,
            city: res.city || 'Nairobi',
            isLive: true,
            lastUpdated: res.last_updated || new Date().toISOString(),
          });
        }
      } catch (err) {
        // Use default
      }
    };
    fetchStoredLocation();
  }, []);

  // Request browser geolocation
  const requestCurrentLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetecting(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setPermissionStatus('granted');

          // Determine neighborhood if in Kenya or format coordinates
          let address = `Coordinates: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          let area = 'Current GPS';
          let city = 'Nairobi';

          // Proximity heuristics for Kenya areas
          if (Math.abs(latitude - (-1.2921)) < 0.05 && Math.abs(longitude - 36.7842) < 0.05) {
            area = 'Kilimani';
            address = 'Kilimani, Nairobi';
          } else if (Math.abs(latitude - (-1.2985)) < 0.05 && Math.abs(longitude - 36.8125) < 0.05) {
            area = 'Upper Hill';
            address = 'Upper Hill, Nairobi';
          } else if (Math.abs(latitude - (-1.2683)) < 0.05 && Math.abs(longitude - 36.8066) < 0.05) {
            area = 'Westlands';
            address = 'Westlands, Nairobi';
          } else if (Math.abs(latitude - (-1.2863)) < 0.05 && Math.abs(longitude - 36.8172) < 0.05) {
            area = 'CBD';
            address = 'Central Business District, Nairobi';
          } else if (Math.abs(latitude - (-1.3200)) < 0.05 && Math.abs(longitude - 36.7100) < 0.05) {
            area = 'Karen';
            address = 'Karen, Nairobi';
          }

          const updated: PatientLocation = {
            latitude,
            longitude,
            address,
            area,
            city,
            accuracy: Math.round(accuracy),
            isLive: true,
            lastUpdated: new Date().toISOString(),
          };

          setLocation(updated);
          setIsDetecting(false);

          try {
            await api.updatePatientLocation({
              latitude,
              longitude,
              address,
              area,
              city,
            });
          } catch (err) {
            console.error('Failed to sync location to backend', err);
          }

          resolve();
        },
        async (error) => {
          console.warn('Geolocation prompt denied or error:', error.message);
          setPermissionStatus('denied');
          setIsDetecting(false);

          // Gracefully default to authentic Kilimani patient position and sync
          try {
            await api.updatePatientLocation(DEFAULT_LOCATION);
          } catch (e) {
            // ignore
          }
          resolve();
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
      );
    });
  };

  // Set known area manually
  const setLocationArea = async (areaName: string) => {
    let lat = DEFAULT_LOCATION.latitude;
    let lon = DEFAULT_LOCATION.longitude;
    let addr = `${areaName}, Nairobi`;

    if (areaName.toLowerCase().includes('upper hill')) {
      lat = -1.2985;
      lon = 36.8125;
      addr = 'Upper Hill, Nairobi';
    } else if (areaName.toLowerCase().includes('westlands')) {
      lat = -1.2683;
      lon = 36.8066;
      addr = 'Westlands, Nairobi';
    } else if (areaName.toLowerCase().includes('karen')) {
      lat = -1.3200;
      lon = 36.7100;
      addr = 'Karen, Nairobi';
    } else if (areaName.toLowerCase().includes('mombasa')) {
      lat = -4.0435;
      lon = 39.6682;
      addr = 'Mombasa Island, Coast';
    }

    const updated: PatientLocation = {
      latitude: lat,
      longitude: lon,
      address: addr,
      area: areaName,
      city: 'Nairobi',
      isLive: true,
      lastUpdated: new Date().toISOString(),
    };

    setLocation(updated);
    try {
      await api.updatePatientLocation(updated);
    } catch (e) {
      console.error(e);
    }
  };

  const calculateDistanceTo = (targetLat?: number, targetLng?: number): number | null => {
    if (targetLat === undefined || targetLng === undefined) return null;
    const R = 6371; // km
    const dLat = (targetLat - location.latitude) * Math.PI / 180;
    const dLon = (targetLng - location.longitude) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(location.latitude * Math.PI / 180) * Math.cos(targetLat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        requestCurrentLocation,
        setLocationArea,
        isDetecting,
        permissionStatus,
        calculateDistanceTo,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
