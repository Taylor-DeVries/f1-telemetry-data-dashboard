'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TelemetryData } from '@/lib/api';
import F1Dashboard from '@/components/dashboard/F1Dashboard';

export default function Dashboard() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem('telemetryData');
    if (storedData) {
      setTelemetryData(JSON.parse(storedData));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!telemetryData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-cyan-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-cyan-400 opacity-20 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600 mb-2">
            LOADING TELEMETRY DATA
          </h2>
          <p className="text-gray-400 animate-pulse">Initializing F1 analysis systems...</p>
        </div>
      </div>
    );
  }

  return <F1Dashboard telemetryData={telemetryData} />;
}
