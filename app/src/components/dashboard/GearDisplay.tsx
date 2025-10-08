'use client';

interface GearDisplayProps {
  gear: number;
  maxGear?: number;
}

export default function GearDisplay({ gear, maxGear = 8 }: GearDisplayProps) {
  return (
    <div className="flex flex-col items-center space-y-1 sm:space-y-2">
      {/* Gear Number */}
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 border border-gray-700 sm:border-2 rounded-full flex items-center justify-center">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono">
            {gear}
          </span>
        </div>
        {/* Gear indicator dots */}
        <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-0.5 sm:space-x-1">
          {Array.from({ length: maxGear }, (_, i) => (
            <div
              key={i}
              className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full ${
                i < gear ? 'bg-white' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Gear Label */}
      <div className="text-xs text-gray-400 uppercase tracking-wider font-mono">
        GEAR
      </div>
    </div>
  );
}
