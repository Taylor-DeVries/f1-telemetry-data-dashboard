'use client';

interface ThrottleBrakeBarProps {
  throttle: number; // 0-100
  brake: number; // 0-100
}

export default function ThrottleBrakeBar({ throttle, brake }: ThrottleBrakeBarProps) {
  return (
    <div className="space-y-4">
      {/* Throttle Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">THROTTLE</span>
          <span className="text-xs text-cyan-400 font-mono">{throttle.toFixed(1)}%</span>
        </div>
        <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-300"
            style={{ width: `${throttle}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-gray-600"></div>
          </div>
        </div>
      </div>

      {/* Brake Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400 uppercase tracking-wider font-mono">BRAKE</span>
          <span className="text-xs text-red-400 font-mono">{brake.toFixed(1)}%</span>
        </div>
        <div className="relative h-6 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-300"
            style={{ width: `${brake}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-gray-600"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
