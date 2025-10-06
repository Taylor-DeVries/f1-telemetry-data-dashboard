'use client';

import { useState } from 'react';

export default function DataExplanation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white font-semibold text-xs">DATA GENERATION INFO</span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="mt-3 space-y-2 text-xs text-gray-300">
          <div>
            <span className="text-cyan-400 font-semibold">Speed Profile:</span> Generated based on your max speed setting, with realistic cornering reductions and track-specific characteristics.
          </div>
          <div>
            <span className="text-cyan-400 font-semibold">Throttle/Brake:</span> Calculated from speed changes - throttle when accelerating, brake when decelerating, with driver style affecting timing.
          </div>
          <div>
            <span className="text-cyan-400 font-semibold">Gear Selection:</span> Automatically calculated based on speed using F1's 8-speed gearbox ratios.
          </div>
          <div>
            <span className="text-cyan-400 font-semibold">RPM:</span> Generated based on gear and speed, with realistic engine characteristics and noise.
          </div>
          <div>
            <span className="text-cyan-400 font-semibold">Tire Temperatures:</span> Increase with speed and braking, showing realistic thermal buildup during the lap.
          </div>
          <div>
            <span className="text-cyan-400 font-semibold">Sector Times:</span> Calculated from the lap time divided into three equal sectors with realistic variations.
          </div>
          <div className="pt-2 border-t border-gray-600">
            <span className="text-cyan-400 font-semibold">Sector Breakdown:</span> 
            <div className="mt-1 ml-2 space-y-1">
              <div>• <span className="text-yellow-400">Points:</span> Performance scoring (higher = better driving in that sector)</div>
              <div>• <span className="text-green-400">Percentage:</span> Sector completion progress (0-100% through the sector)</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
