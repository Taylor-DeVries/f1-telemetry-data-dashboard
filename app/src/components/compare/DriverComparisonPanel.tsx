'use client';

import { F1Driver } from '@/data/f1Data';

interface DriverComparisonPanelProps {
  driver: F1Driver;
  lapTime: string;
  maxSpeed: number;
  fullThrottle: number;
  heavyBraking: number;
  cornering: number;
  side: 'left' | 'right';
}

export default function DriverComparisonPanel({
  driver,
  lapTime,
  maxSpeed,
  fullThrottle,
  heavyBraking,
  cornering
  // side
}: DriverComparisonPanelProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      {/* Driver Info */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">DRIVER</div>
        <div className="text-white font-bold text-lg">
          {driver.name.split(' ').map((part, index) => (
            <span key={index}>
              {index === 0 ? part : <span style={{ color: driver.teamColor }}>{part}</span>}
              {index === 0 && ' '}
            </span>
          ))}
        </div>
        <div className="text-gray-300 text-sm mt-1">{driver.team}</div>
      </div>

      {/* Lap Time */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider">LAP TIME</div>
        <div className="text-white font-mono text-lg">{lapTime}</div>
      </div>

      {/* Max Speed */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider">MAX SPEED</div>
        <div className="text-white font-mono text-lg">{maxSpeed} km/h</div>
      </div>

      {/* Lap Time Breakdown */}
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-3">% LAP TIME BREAKDOWN</div>
        
        <div className="space-y-3">
          {/* Full Throttle */}
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>FULL THROTTLE</span>
              <span>{fullThrottle}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${fullThrottle}%` }}
              ></div>
            </div>
          </div>

          {/* Heavy Braking */}
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>HEAVY BRAKING</span>
              <span>{heavyBraking}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${heavyBraking}%` }}
              ></div>
            </div>
          </div>

          {/* Cornering */}
          <div>
            <div className="flex justify-between text-xs text-gray-300 mb-1">
              <span>CORNERING</span>
              <span>{cornering}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${cornering}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
