'use client';

import { F1Driver, F1Track, F1_DRIVERS, F1_TRACKS } from '@/data/f1Data';

interface DriverSelectorProps {
  selectedDriver: F1Driver;
  selectedTrack: F1Track;
  onDriverChange: (driver: F1Driver) => void;
  onTrackChange: (track: F1Track) => void;
}

export default function DriverSelector({ 
  selectedDriver, 
  selectedTrack, 
  onDriverChange, 
  onTrackChange 
}: DriverSelectorProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
      <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider">
        DRIVER & TRACK SELECTION
      </h3>
      
      {/* Driver Selection */}
      <div>
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">
          DRIVER
        </label>
        <select
          value={selectedDriver.id}
          onChange={(e) => {
            const driver = F1_DRIVERS.find(d => d.id === e.target.value);
            if (driver) onDriverChange(driver);
          }}
          className="w-full bg-black border border-gray-600 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
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
        <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1 sm:mb-2">
          TRACK
        </label>
        <select
          value={selectedTrack.id}
          onChange={(e) => {
            const track = F1_TRACKS.find(t => t.id === e.target.value);
            if (track) onTrackChange(track);
          }}
          className="w-full bg-black border border-gray-600 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
        >
          {F1_TRACKS.map(track => (
            <option key={track.id} value={track.id}>
              {track.name} - {track.country}
            </option>
          ))}
        </select>
      </div>

      {/* Current Selection Display */}
      <div className="pt-2 sm:pt-3 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">SELECTED:</span>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div 
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
              style={{ backgroundColor: selectedDriver.teamColor }}
            ></div>
            <span className="text-white font-mono text-xs">
              #{selectedDriver.number} {selectedDriver.name}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-gray-400">TRACK:</span>
          <span className="text-white font-mono text-xs">
            {selectedTrack.name} ({selectedTrack.length}km)
          </span>
        </div>
      </div>
    </div>
  );
}
