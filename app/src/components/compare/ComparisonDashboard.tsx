'use client';

import { useState, useEffect } from 'react';
import { TelemetryData } from '@/lib/api';
import { F1Driver, F1Track, F1_DRIVERS, F1_TRACKS } from '@/data/f1Data';
import DriverComparisonPanel from './DriverComparisonPanel';
import IntuitiveComparisonChart from './IntuitiveComparisonChart';
import SimpleDeltaChart from './SimpleDeltaChart';
import LapComparisonGenerator from '../LapComparisonGenerator';

interface ComparisonDashboardProps {
  lap1Data: TelemetryData | null;
  lap2Data: TelemetryData | null;
}

export default function ComparisonDashboard({ lap1Data: initialLap1Data, lap2Data: initialLap2Data }: ComparisonDashboardProps) {
  const [lap1Data, setLap1Data] = useState<TelemetryData | null>(initialLap1Data);
  const [lap2Data, setLap2Data] = useState<TelemetryData | null>(initialLap2Data);
  const [driver1, setDriver1] = useState<F1Driver>(F1_DRIVERS[2]); // Lewis Hamilton
  const [driver2, setDriver2] = useState<F1Driver>(F1_DRIVERS[0]); // Max Verstappen
  const [selectedTrack, setSelectedTrack] = useState<F1Track>(F1_TRACKS[0]); // Silverstone
  const [showGenerator, setShowGenerator] = useState(false);

  // Sync with initial data
  useEffect(() => {
    setLap1Data(initialLap1Data);
    setLap2Data(initialLap2Data);
  }, [initialLap1Data, initialLap2Data]);

  // Update drivers and track when data changes
  useEffect(() => {
    if (lap1Data?.metadata?.driver_id) {
      const driver = F1_DRIVERS.find(d => d.id === lap1Data.metadata?.driver_id);
      if (driver) setDriver1(driver);
    }
    if (lap2Data?.metadata?.driver_id) {
      const driver = F1_DRIVERS.find(d => d.id === lap2Data.metadata?.driver_id);
      if (driver) setDriver2(driver);
    }
    if (lap1Data?.metadata?.track_id) {
      const track = F1_TRACKS.find(t => t.id === lap1Data.metadata?.track_id);
      if (track) setSelectedTrack(track);
    }
  }, [lap1Data, lap2Data]);


  const handleComparisonDataGenerated = (newLap1Data: TelemetryData, newLap2Data: TelemetryData) => {
    // Store both lap data
    sessionStorage.setItem('lap1Data', JSON.stringify(newLap1Data));
    sessionStorage.setItem('lap2Data', JSON.stringify(newLap2Data));
    
    // Update local state immediately
    setLap1Data(newLap1Data);
    setLap2Data(newLap2Data);
    
    setShowGenerator(false);
  };


  // Calculate lap statistics
  const calculateLapStats = (data: TelemetryData | null) => {
    if (!data) return { fullThrottle: 0, heavyBraking: 0, cornering: 0 };
    
    const throttle = Object.values(data.full_data.throttle || {}) as number[];
    const brake = Object.values(data.full_data.brake || {}) as number[];
    const speed = Object.values(data.full_data.speed || {}) as number[];
    
    const totalPoints = throttle.length;
    const fullThrottlePoints = throttle.filter(t => t > 0.8).length;
    const heavyBrakingPoints = brake.filter(b => b > 0.6).length;
    const corneringPoints = speed.filter(s => s < 150).length;
    
    return {
      fullThrottle: Math.round((fullThrottlePoints / totalPoints) * 100),
      heavyBraking: Math.round((heavyBrakingPoints / totalPoints) * 100),
      cornering: Math.round((corneringPoints / totalPoints) * 100)
    };
  };

  const lap1Stats = calculateLapStats(lap1Data);
  const lap2Stats = calculateLapStats(lap2Data);

  // Calculate lap times and gap
  const lap1Time = lap1Data?.metadata?.lap_time ? 
    `${Math.floor(lap1Data.metadata.lap_time / 60)}:${(lap1Data.metadata.lap_time % 60).toFixed(3).padStart(6, '0')}` : 
    "1:29.158";
  const lap2Time = lap2Data?.metadata?.lap_time ? 
    `${Math.floor(lap2Data.metadata.lap_time / 60)}:${(lap2Data.metadata.lap_time % 60).toFixed(3).padStart(6, '0')}` : 
    "1:29.340";
  
  const time1 = lap1Data?.metadata?.lap_time || 89.158;
  const time2 = lap2Data?.metadata?.lap_time || 89.340;
  const gap = time1 - time2;
  // const gapString = gap < 0 ? `${gap.toFixed(3)}s` : `+${gap.toFixed(3)}s`;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="text-white font-black text-2xl">
                <span className="text-red-600">F1</span>
              </div>
              <div className="h-8 w-px bg-gray-600"></div>
              <div className="text-white font-bold text-lg">
                TELEMETRY DASHBOARD
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Controls */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-white">
            <h2 className="text-xl font-bold">LAP COMPARISON ANALYSIS</h2>
            <p className="text-gray-400 text-sm">{selectedTrack.name} • {selectedTrack.country}</p>
          </div>
          <button
            onClick={() => setShowGenerator(true)}
            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold rounded-lg transition-all transform hover:scale-105"
          >
            Generate New Data
          </button>
        </div>

        {/* Driver Comparison Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DriverComparisonPanel
            driver={driver1}
            lapTime={lap1Time}
            maxSpeed={lap1Data?.metadata?.max_speed || 320}
            fullThrottle={lap1Stats.fullThrottle}
            heavyBraking={lap1Stats.heavyBraking}
            cornering={lap1Stats.cornering}
            side="left"
          />
          <DriverComparisonPanel
            driver={driver2}
            lapTime={lap2Time}
            maxSpeed={lap2Data?.metadata?.max_speed || 320}
            fullThrottle={lap2Stats.fullThrottle}
            heavyBraking={lap2Stats.heavyBraking}
            cornering={lap2Stats.cornering}
            side="right"
          />
        </div>


        {/* Telemetry Charts */}
        {lap1Data && lap2Data ? (
          <div className="space-y-6">
            <IntuitiveComparisonChart
              lap1Data={lap1Data}
              lap2Data={lap2Data}
              driver1Name={driver1.name}
              driver2Name={driver2.name}
              driver1Color={driver1.teamColor}
              driver2Color={driver2.teamColor}
              title="TELEMETRY COMPARISON"
              height={350}
            />
            <SimpleDeltaChart
              lap1Data={lap1Data}
              lap2Data={lap2Data}
              driver1Name={driver1.name}
              driver2Name={driver2.name}
              height={250}
            />
          </div>
        ) : (
          <div className="bg-gray-800 border border-gray-600 rounded-lg p-16 text-center">
            <div className="text-gray-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-400 text-lg font-medium">No Data Available</p>
            <p className="text-gray-500 text-sm mt-2">
              Generate demo data for both laps to start comparison
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all transform hover:scale-105"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </div>

      {/* Comparison Data Generator Modal */}
      {showGenerator && (
        <LapComparisonGenerator
          onDataGenerated={handleComparisonDataGenerated}
          onClose={() => setShowGenerator(false)}
        />
      )}
    </div>
  );
}
