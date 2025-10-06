'use client';

import { useState } from 'react';
import { TelemetryData, api } from '@/lib/api';
import { F1Driver, F1Track, F1_DRIVERS, F1_TRACKS } from '@/data/f1Data';

interface DemoDataGeneratorProps {
  onDataGenerated: (data: TelemetryData) => void;
  onClose: () => void;
  analysisType?: 'single' | 'comparison';
}

export default function DemoDataGenerator({ onDataGenerated, onClose, analysisType = 'single' }: DemoDataGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<F1Driver>(F1_DRIVERS[2]); // Lewis Hamilton by default
  const [selectedTrack, setSelectedTrack] = useState<F1Track>(F1_TRACKS[0]); // Silverstone by default
  const [params, setParams] = useState({
    max_speed: 320,
    max_rpm: 15000,
    num_gears: 8,
    lap_time: 90,
    track_name: 'Demo Track',
    driver_style: 'balanced'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Update params with selected driver and track
      const updatedParams = {
        ...params,
        track_name: selectedTrack.name,
        driver_style: selectedDriver.name.includes('VERSTAPPEN') ? 'aggressive' : 
                     selectedDriver.name.includes('HAMILTON') ? 'smooth' : 'balanced',
        driver_id: selectedDriver.id,
        track_id: selectedTrack.id
      };
      
      const data = await api.generateDemoData(updatedParams);
      onDataGenerated(data);
    } catch (error) {
      console.error('Error generating demo data:', error);
      alert('Failed to generate demo data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              {analysisType === 'comparison' ? 'Generate Comparison Data' : 'Generate Demo Telemetry'}
            </h2>
            <p className="text-red-100 text-sm mt-1">
              {analysisType === 'comparison' ? 'Create data for lap comparison' : 'Create realistic F1 data for testing'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              👨‍💼 Select Driver
            </label>
            <select
              value={selectedDriver.id}
              onChange={(e) => {
                const driver = F1_DRIVERS.find(d => d.id === e.target.value);
                if (driver) setSelectedDriver(driver);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {F1_DRIVERS.map(driver => (
                <option key={driver.id} value={driver.id}>
                  #{driver.number} {driver.name} - {driver.team}
                </option>
              ))}
            </select>
          </div>

          {/* Track Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              🏁 Select Track
            </label>
            <select
              value={selectedTrack.id}
              onChange={(e) => {
                const track = F1_TRACKS.find(t => t.id === e.target.value);
                if (track) setSelectedTrack(track);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {F1_TRACKS.map(track => (
                <option key={track.id} value={track.id}>
                  {track.name} - {track.country} ({track.length}km, {track.turns} turns)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              {selectedTrack.description}
            </p>
          </div>

          {/* Max Speed */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              ⚡ Maximum Speed (km/h)
            </label>
            <input
              type="range"
              min="200"
              max="400"
              value={params.max_speed}
              onChange={(e) => setParams({...params, max_speed: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>200 km/h</span>
              <span className="text-red-400 font-bold">{params.max_speed} km/h</span>
              <span>400 km/h</span>
            </div>
          </div>

          {/* Max RPM */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              🔧 Maximum RPM
            </label>
            <input
              type="range"
              min="10000"
              max="20000"
              step="1000"
              value={params.max_rpm}
              onChange={(e) => setParams({...params, max_rpm: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>10,000</span>
              <span className="text-red-400 font-bold">{params.max_rpm.toLocaleString()}</span>
              <span>20,000</span>
            </div>
          </div>

          {/* Lap Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              ⏱️ Lap Time (seconds)
            </label>
            <input
              type="range"
              min="60"
              max="180"
              step="5"
              value={params.lap_time}
              onChange={(e) => setParams({...params, lap_time: parseInt(e.target.value)})}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1:00</span>
              <span className="text-red-400 font-bold">{Math.floor(params.lap_time / 60)}:{(params.lap_time % 60).toString().padStart(2, '0')}</span>
              <span>3:00</span>
            </div>
          </div>


          {/* Driver Style */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              🏎️ Driving Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['aggressive', 'balanced', 'smooth'].map((style) => (
                <button
                  key={style}
                  onClick={() => setParams({...params, driver_style: style})}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                    params.driver_style === style
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {params.driver_style === 'aggressive' && '⚡ Late braking, early throttle, more speed variation'}
              {params.driver_style === 'balanced' && '⚖️ Optimal balance of speed and control'}
              {params.driver_style === 'smooth' && '🎯 Smooth inputs, consistent speed, gentle on tires'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800/50 p-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

