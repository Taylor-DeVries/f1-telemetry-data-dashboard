'use client';

import { useState, useEffect } from 'react';
import { TelemetryData } from '@/lib/api';
import { F1Driver, F1Track, F1_DRIVERS, F1_TRACKS } from '@/data/f1Data';
import F1Header from './F1Header';
import Speedometer from './Speedometer';
import RPMGauge from './RPMGauge';
import ThrottleBrakeBar from './ThrottleBrakeBar';
import GearDisplay from './GearDisplay';
import DriverInfo from './DriverInfo';
import TelemetryChart from './TelemetryChart';
import SectorAnalysis from './SectorAnalysis';
import ChannelSelector from './ChannelSelector';
import DriverSelector from './DriverSelector';
import TrackImage from './TrackImage';
import DataExplanation from './DataExplanation';

interface F1DashboardProps {
  telemetryData: TelemetryData;
}

export default function F1Dashboard({ telemetryData }: F1DashboardProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<F1Driver>(F1_DRIVERS[2]); // Lewis Hamilton by default
  const [selectedTrack, setSelectedTrack] = useState<F1Track>(F1_TRACKS[0]); // Silverstone by default
  const [manualSpeed, setManualSpeed] = useState<number | null>(null);
  const [manualRpm, setManualRpm] = useState<number | null>(null);

  // Auto-select common telemetry columns and set driver/track from metadata
  useEffect(() => {
    const commonColumns = ['time', 'speed', 'throttle', 'brake', 'gear', 'rpm'];
    const availableColumns = telemetryData.columns.filter(col => 
      commonColumns.some(common => col.toLowerCase().includes(common))
    );
    setSelectedChannels(availableColumns.slice(0, 4));

    // Set driver and track from metadata if available
    if (telemetryData.metadata) {
      if (telemetryData.metadata?.driver_id) {
        const driver = F1_DRIVERS.find(d => d.id === telemetryData.metadata?.driver_id);
        if (driver) setSelectedDriver(driver);
      }
      if (telemetryData.metadata?.track_id) {
        const track = F1_TRACKS.find(t => t.id === telemetryData.metadata?.track_id);
        if (track) setSelectedTrack(track);
      }
    }
  }, [telemetryData]);

  // Simulate live data updates
  useEffect(() => {
    if (isLive && telemetryData.full_data) {
      const maxIndex = Object.keys(telemetryData.full_data.time || {}).length - 1;
      const interval = setInterval(() => {
        setCurrentDataIndex(prev => (prev + 1) % maxIndex);
      }, 100); // Update every 100ms for smooth animation
      
      return () => clearInterval(interval);
    }
  }, [isLive, telemetryData]);

  const handleChannelToggle = (channel: string) => {
    setSelectedChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(col => col !== channel)
        : [...prev, channel]
    );
  };

  // Get current values for gauges
  const getCurrentValue = (channel: string) => {
    // Use manual values if set
    if (channel === 'speed' && manualSpeed !== null) return manualSpeed;
    if (channel === 'rpm' && manualRpm !== null) return manualRpm;
    
    if (!telemetryData.full_data || !telemetryData.full_data[channel]) return 0;
    const values = Object.values(telemetryData.full_data[channel]) as number[];
    if (isLive) {
      const index = Math.min(currentDataIndex, values.length - 1);
      return values[index] || 0;
    }
    return values[values.length - 1] || 0;
  };

  // Handle manual gauge controls
  const handleSpeedChange = (newSpeed: number) => {
    setManualSpeed(newSpeed);
  };

  const handleRpmChange = (newRpm: number) => {
    setManualRpm(newRpm);
  };

  // Reset to live data
  const resetToLiveData = () => {
    setManualSpeed(null);
    setManualRpm(null);
  };

  // Prepare chart data (updates in real-time during live mode)
  const chartData = selectedChannels.map(channel => {
    const values = Object.values(telemetryData.full_data[channel] || {}) as number[];
    const maxIndex = isLive ? currentDataIndex + 1 : values.length;
    const displayValues = values.slice(0, maxIndex);
    
    // Apply manual overrides to chart data for consistency
    if (channel === 'speed' && manualSpeed !== null) {
      // Replace the last value with manual speed for consistency
      if (displayValues.length > 0) {
        displayValues[displayValues.length - 1] = manualSpeed;
      }
    }
    if (channel === 'rpm' && manualRpm !== null) {
      // Replace the last value with manual RPM for consistency
      if (displayValues.length > 0) {
        displayValues[displayValues.length - 1] = manualRpm;
      }
    }
    
    return {
      x: Array.from({ length: displayValues.length }, (_, i) => i),
      y: displayValues,
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: channel.toUpperCase(),
      line: { width: 2 }
    };
  });

  // Calculate sector data (updates in real-time during live mode)
  const calculateSectorData = () => {
    if (!telemetryData.full_data || !telemetryData.full_data.sector) return [];
    
    const sectors = [1, 2, 3].map(sectorNum => {
      const sectorIndices = Object.entries(telemetryData.full_data.sector)
        .filter(([, value]) => value === sectorNum)
        .map(([index]) => parseInt(index));
      
      if (sectorIndices.length === 0) return null;
      
      // In live mode, only calculate up to current data point
      const maxIndex = isLive ? currentDataIndex : sectorIndices.length - 1;
      const relevantIndices = sectorIndices.filter(i => i <= maxIndex);
      
      if (relevantIndices.length === 0) return null;
      
      const sectorTimes = relevantIndices.map(i => telemetryData.full_data.time[i]);
      const sectorTime = Math.max(...sectorTimes) - Math.min(...sectorTimes);
      
      const sectorSpeeds = relevantIndices.map(i => telemetryData.full_data.speed[i]);
      const avgSpeed = sectorSpeeds.reduce((a, b) => a + b, 0) / sectorSpeeds.length;
      const maxSpeed = Math.max(...sectorSpeeds);
      
      return {
        sector: sectorNum,
        time: sectorTime,
        avgSpeed,
        maxSpeed,
        dataPoints: relevantIndices.length,
        isLive: isLive && relevantIndices.length < sectorIndices.length
      };
    }).filter(Boolean);
    
    return sectors;
  };

  const sectorData = calculateSectorData().filter((sector): sector is NonNullable<typeof sector> => sector !== null);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <F1Header 
        trackName={selectedTrack.name}
        sessionType="QUALIFYING"
        lapTime="1:42.123"
        weather="SUNNY"
        teamColor={selectedDriver.teamColor}
      />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        {/* Top Row - Driver Info, Gauges, and Controls */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Driver Info */}
          <div className="col-span-12 lg:col-span-3">
            <DriverInfo 
              driverName={selectedDriver.name}
              teamName={selectedDriver.team}
              lapTime={telemetryData.metadata?.lap_time ? 
                `${Math.floor(telemetryData.metadata.lap_time / 60)}:${(telemetryData.metadata.lap_time % 60).toFixed(3).padStart(6, '0')}` : 
                "1:29.158"}
              maxSpeed={telemetryData.metadata?.max_speed || 320}
              teamColor={selectedDriver.teamColor}
              teamSecondaryColor={selectedDriver.teamSecondaryColor}
              currentSpeed={getCurrentValue('speed')}
              currentRpm={getCurrentValue('rpm')}
              currentGear={Math.round(getCurrentValue('gear'))}
            />
          </div>

          {/* Gauges Row */}
          <div className="col-span-12 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 h-full">
              {/* Speedometer */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 sm:p-4">
                <Speedometer 
                  speed={getCurrentValue('speed')} 
                  onSpeedChange={handleSpeedChange}
                  isManualOverride={manualSpeed !== null}
                />
                {/* Additional Speed Info */}
                <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>AVG SPEED</span>
                    <span className="text-white font-mono text-xs">{Math.round(getCurrentValue('speed') * 0.85)} km/h</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>MAX SPEED</span>
                    <span className="text-white font-mono text-xs">{telemetryData.metadata?.max_speed || 320} km/h</span>
                  </div>
                </div>
              </div>

              {/* RPM Gauge */}
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-2 sm:p-4">
                <RPMGauge 
                  rpm={getCurrentValue('rpm')} 
                  onRpmChange={handleRpmChange}
                  isManualOverride={manualRpm !== null}
                />
                {/* Additional RPM Info */}
                <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>AVG RPM</span>
                    <span className="text-white font-mono text-xs">{Math.round(getCurrentValue('rpm') * 0.9)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>MAX RPM</span>
                    <span className="text-white font-mono text-xs">{telemetryData.metadata?.max_rpm || 15000}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="col-span-12 lg:col-span-3 space-y-3 sm:space-y-4">
            {/* Driver & Track Selection */}
            <DriverSelector
              selectedDriver={selectedDriver}
              selectedTrack={selectedTrack}
              onDriverChange={setSelectedDriver}
              onTrackChange={setSelectedTrack}
            />

            {/* Live Toggle */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
                  LIVE MODE
                </span>
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                    isLive ? 'bg-cyan-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                      isLive ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-xs text-gray-400">
                  {isLive ? 'LIVE DATA' : 'STATIC DATA'}
                </span>
              </div>
              <div className="mt-1 sm:mt-2 text-xs text-gray-500">
                Live mode simulates real-time telemetry updates by cycling through data points every 100ms
              </div>
              {(manualSpeed !== null || manualRpm !== null) && (
                <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-700">
                  <button
                    onClick={resetToLiveData}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    Reset to Live Data
                  </button>
                  <div className="mt-1 text-xs text-cyan-400">
                    Manual overrides active
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry Charts - Moved above track map */}
        <div className="mb-4 sm:mb-6">
          {selectedChannels.length > 0 ? (
            <TelemetryChart
              data={chartData}
              title="TELEMETRY ANALYSIS"
              height={400}
              showLegend={true}
            />
          ) : (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 sm:p-16 text-center">
              <div className="text-gray-600 mb-4">
                <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-base sm:text-lg font-medium">No Channels Selected</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                Select telemetry channels to display analysis charts
              </p>
            </div>
          )}
        </div>

        {/* Middle Row - Track Map, Throttle/Brake, Gear, and Channel Selector */}
        <div className="grid grid-cols-12 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Track Map */}
          <div className="col-span-12 lg:col-span-6">
            <TrackImage 
              track={selectedTrack}
              teamColor={selectedDriver.teamColor}
            />
          </div>

          {/* Throttle/Brake and Gear */}
          <div className="col-span-12 lg:col-span-3">
            <div className="space-y-3 sm:space-y-4 h-full">
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4">
                <ThrottleBrakeBar 
                  throttle={getCurrentValue('throttle') * 100}
                  brake={getCurrentValue('brake') * 100}
                />
              </div>

              <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4 flex items-center justify-center">
                <GearDisplay gear={Math.round(getCurrentValue('gear'))} />
              </div>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="col-span-12 lg:col-span-3">
            <ChannelSelector
              channels={telemetryData.columns}
              selectedChannels={selectedChannels}
              onChannelToggle={handleChannelToggle}
            />
          </div>
        </div>

        {/* Sector Analysis */}
        {sectorData.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <SectorAnalysis sectors={sectorData} />
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <button
            onClick={() => window.location.href = '/'}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white font-bold rounded-lg hover:from-cyan-700 hover:to-cyan-600 transition-all transform hover:scale-105 text-sm sm:text-base"
          >
            BACK TO HOME
          </button>
        </div>

        {/* Data Generation Info - Moved to Bottom */}
        <div className="max-w-4xl mx-auto">
          <DataExplanation />
        </div>
      </div>
    </div>
  );
}
