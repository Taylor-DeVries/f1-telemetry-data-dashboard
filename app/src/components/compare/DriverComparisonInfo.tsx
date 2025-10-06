'use client';

import { F1Driver } from '@/data/f1Data';

interface DriverComparisonInfoProps {
  driver1: F1Driver;
  driver2: F1Driver;
  lapTime1?: string;
  lapTime2?: string;
  gap?: string;
}

export default function DriverComparisonInfo({ 
  driver1, 
  driver2, 
  lapTime1 = "1:29.158",
  lapTime2 = "1:29.340",
  gap = "-0.182s"
}: DriverComparisonInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Driver 1 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider">DRIVER 1</div>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: driver1.teamColor }}
          >
            <span className="text-white font-bold text-sm">1</span>
          </div>
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">DRIVER</div>
          <div className="text-white font-bold text-lg">
            {driver1.name.split(' ').map((part, index) => (
              <span key={index}>
                {index === 0 ? part : <span style={{ color: driver1.teamColor }}>{part}</span>}
                {index === 0 && ' '}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider">{driver1.team}</div>
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider">LAP TIME</div>
          <div className="text-white font-mono text-lg">{lapTime1}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">GAP</div>
          <div 
            className="font-mono text-sm"
            style={{ color: gap.startsWith('-') ? driver1.teamColor : '#FF6B35' }}
          >
            {gap}
          </div>
        </div>
      </div>

      {/* Driver 2 */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-gray-400 uppercase tracking-wider">DRIVER 2</div>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: driver2.teamColor }}
          >
            <span className="text-white font-bold text-sm">2</span>
          </div>
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">DRIVER</div>
          <div className="text-white font-bold text-lg">
            {driver2.name.split(' ').map((part, index) => (
              <span key={index}>
                {index === 0 ? part : <span style={{ color: driver2.teamColor }}>{part}</span>}
                {index === 0 && ' '}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="text-xs text-gray-400 uppercase tracking-wider">{driver2.team}</div>
        </div>

        <div className="mb-2">
          <div className="text-xs text-gray-400 uppercase tracking-wider">LAP TIME</div>
          <div className="text-white font-mono text-lg">{lapTime2}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400 uppercase tracking-wider">GAP</div>
          <div 
            className="font-mono text-sm"
            style={{ color: gap.startsWith('-') ? '#FF6B35' : driver2.teamColor }}
          >
            {gap.startsWith('-') ? gap.replace('-', '+') : gap}
          </div>
        </div>
      </div>
    </div>
  );
}
