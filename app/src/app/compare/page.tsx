'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TelemetryData } from '@/lib/api';
import ComparisonDashboard from '@/components/compare/ComparisonDashboard';

export default function CompareLaps() {
  const [lap1Data, setLap1Data] = useState<TelemetryData | null>(null);
  const [lap2Data, setLap2Data] = useState<TelemetryData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Load data from sessionStorage
    const storedLap1Data = sessionStorage.getItem('lap1Data');
    const storedLap2Data = sessionStorage.getItem('lap2Data');
    
    if (storedLap1Data) {
      setLap1Data(JSON.parse(storedLap1Data));
    }
    if (storedLap2Data) {
      setLap2Data(JSON.parse(storedLap2Data));
    }
  }, []);

  // Listen for storage changes to update data when new data is generated
  useEffect(() => {
    const handleStorageChange = () => {
      const storedLap1Data = sessionStorage.getItem('lap1Data');
      const storedLap2Data = sessionStorage.getItem('lap2Data');
      
      if (storedLap1Data) {
        setLap1Data(JSON.parse(storedLap1Data));
      }
      if (storedLap2Data) {
        setLap2Data(JSON.parse(storedLap2Data));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return <ComparisonDashboard lap1Data={lap1Data} lap2Data={lap2Data} />;
}

