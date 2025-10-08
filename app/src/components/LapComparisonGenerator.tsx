'use client';

import { useState } from 'react';
import { TelemetryData, api } from '@/lib/api';
import { F1Driver, F1Track, F1_DRIVERS, F1_TRACKS } from '@/data/f1Data';

interface LapComparisonGeneratorProps {
  onDataGenerated: (lap1Data: TelemetryData, lap2Data: TelemetryData) => void;
  onClose: () => void;
}

export default function LapComparisonGenerator({ onDataGenerated, onClose }: LapComparisonGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<F1Track>(F1_TRACKS[0]); // Silverstone by default
  const [lap1Driver, setLap1Driver] = useState<F1Driver>(F1_DRIVERS[0]); // Max Verstappen by default
  const [lap2Driver, setLap2Driver] = useState<F1Driver>(F1_DRIVERS[1]); // Lewis Hamilton by default
  
  const [lap1Params, setLap1Params] = useState({
    max_speed: 320,
    max_rpm: 15000,
    num_gears: 8,
    lap_time: 90,
    driver_style: 'balanced'
  });
  
  const [lap2Params, setLap2Params] = useState({
    max_speed: 315,
    max_rpm: 15000,
    num_gears: 8,
    lap_time: 92,
    driver_style: 'aggressive'
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Generate data for both laps
      const lap1Data = await api.generateDemoData({
        ...lap1Params,
        track_name: selectedTrack.name,
        driver_id: lap1Driver.id,
        track_id: selectedTrack.id
      });
      
      const lap2Data = await api.generateDemoData({
        ...lap2Params,
        track_name: selectedTrack.name,
        driver_id: lap2Driver.id,
        track_id: selectedTrack.id
      });
      
      onDataGenerated(lap1Data, lap2Data);
    } catch (error) {
      console.error('Error generating comparison data:', error);
      alert('Failed to generate comparison data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-500 p-4 sm:p-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Generate Lap Comparison Data
            </h2>
            <p className="text-orange-100 text-xs sm:text-sm mt-1">Create realistic F1 data for comparing two drivers</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Track Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
              🏁 Select Track
            </label>
            <select
              value={selectedTrack.id}
              onChange={(e) => {
                const track = F1_TRACKS.find(t => t.id === e.target.value);
                if (track) setSelectedTrack(track);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
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

          {/* Driver Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Lap 1 Driver */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                🏎️ Lap 1 Driver
              </label>
              <select
                value={lap1Driver.id}
                onChange={(e) => {
                  const driver = F1_DRIVERS.find(d => d.id === e.target.value);
                  if (driver) setLap1Driver(driver);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              >
                {F1_DRIVERS.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    #{driver.number} {driver.name} - {driver.team}
                  </option>
                ))}
              </select>
            </div>

            {/* Lap 2 Driver */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                🏎️ Lap 2 Driver
              </label>
              <select
                value={lap2Driver.id}
                onChange={(e) => {
                  const driver = F1_DRIVERS.find(d => d.id === e.target.value);
                  if (driver) setLap2Driver(driver);
                }}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
              >
                {F1_DRIVERS.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    #{driver.number} {driver.name} - {driver.team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lap Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Lap 1 Parameters */}
            <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full mr-1.5 sm:mr-2"></div>
                Lap 1 - {lap1Driver.name}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                    ⚡ Max Speed (km/h)
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="400"
                    value={lap1Params.max_speed}
                    onChange={(e) => setLap1Params({...lap1Params, max_speed: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-1">
                    <span>200</span>
                    <span className="text-orange-400 font-bold">{lap1Params.max_speed}</span>
                    <span>400</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                    ⏱️ Lap Time (seconds)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    step="5"
                    value={lap1Params.lap_time}
                    onChange={(e) => setLap1Params({...lap1Params, lap_time: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-1">
                    <span>1:00</span>
                    <span className="text-orange-400 font-bold">{Math.floor(lap1Params.lap_time / 60)}:{(lap1Params.lap_time % 60).toString().padStart(2, '0')}</span>
                    <span>3:00</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                    🏎️ Driving Style
                  </label>
                  <select
                    value={lap1Params.driver_style}
                    onChange={(e) => setLap1Params({...lap1Params, driver_style: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  >
                    <option value="smooth">Smooth - Late braking, gentle inputs</option>
                    <option value="balanced">Balanced - Mixed approach</option>
                    <option value="aggressive">Aggressive - Late braking, hard inputs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lap 2 Parameters */}
            <div className="bg-gray-800/50 p-3 sm:p-4 rounded-lg">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full mr-1.5 sm:mr-2"></div>
                Lap 2 - {lap2Driver.name}
              </h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                    ⚡ Max Speed (km/h)
                  </label>
                  <input
                    type="range"
                    min="200"
                    max="400"
                    value={lap2Params.max_speed}
                    onChange={(e) => setLap2Params({...lap2Params, max_speed: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-1">
                    <span>200</span>
                    <span className="text-orange-400 font-bold">{lap2Params.max_speed}</span>
                    <span>400</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                    ⏱️ Lap Time (seconds)
                  </label>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    step="5"
                    value={lap2Params.lap_time}
                    onChange={(e) => setLap2Params({...lap2Params, lap_time: parseInt(e.target.value)})}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-400 mt-1">
                    <span>1:00</span>
                    <span className="text-orange-400 font-bold">{Math.floor(lap2Params.lap_time / 60)}:{(lap2Params.lap_time % 60).toString().padStart(2, '0')}</span>
                    <span>3:00</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-1.5 sm:mb-2">
                    🏎️ Driving Style
                  </label>
                  <select
                    value={lap2Params.driver_style}
                    onChange={(e) => setLap2Params({...lap2Params, driver_style: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                  >
                    <option value="smooth">Smooth - Late braking, gentle inputs</option>
                    <option value="balanced">Balanced - Mixed approach</option>
                    <option value="aggressive">Aggressive - Late braking, hard inputs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-800/50 p-4 sm:p-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Generate Comparison Data
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
