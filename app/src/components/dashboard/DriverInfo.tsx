'use client';

interface DriverInfoProps {
  driverName?: string;
  teamName?: string;
  lapTime?: string;
  maxSpeed?: number;
  teamColor?: string;
  teamSecondaryColor?: string;
  currentSpeed?: number;
  currentRpm?: number;
  currentGear?: number;
}

export default function DriverInfo({ 
  driverName = "Lewis HAMILTON",
  teamName = "MERCEDES-AMG",
  lapTime = "1:29.158",
  maxSpeed = 320,
  teamColor = "#00D2BE",
  // teamSecondaryColor = "#00A8A3",
  currentSpeed = 0,
  currentRpm = 0,
  currentGear = 1
}: DriverInfoProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-full">
      {/* Driver Name */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">DRIVER</div>
        <div className="text-white font-bold text-lg">
          {driverName.split(' ').map((part, index) => (
            <span key={index}>
              {index === 0 ? part : <span style={{ color: teamColor }}>{part}</span>}
              {index === 0 && ' '}
            </span>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider">{teamName}</div>
      </div>

      {/* Lap Time */}
      <div className="mb-3">
        <div className="text-xs text-gray-400 uppercase tracking-wider">LAP TIME</div>
        <div className="text-white font-mono text-lg">{lapTime}</div>
      </div>

      {/* Max Speed */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider">MAX SPEED</div>
        <div className="text-white font-mono text-lg">{maxSpeed} km/h</div>
      </div>

      {/* Current Telemetry */}
      <div className="space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">CURRENT STATUS</div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">SPEED</span>
          <span className="text-white font-mono">{Math.round(currentSpeed)} km/h</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">RPM</span>
          <span className="text-white font-mono">{Math.round(currentRpm)}</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">GEAR</span>
          <span className="text-white font-mono">{currentGear}</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 space-y-2">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">SESSION INFO</div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">SESSION</span>
          <span className="text-white font-mono">QUALIFYING</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">LAP</span>
          <span className="text-white font-mono">1/3</span>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">FUEL</span>
          <span className="text-white font-mono">100%</span>
        </div>
      </div>
    </div>
  );
}
