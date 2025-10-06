'use client';

interface GearDisplayProps {
  gear: number;
  maxGear?: number;
}

export default function GearDisplay({ gear, maxGear = 8 }: GearDisplayProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Gear Number */}
      <div className="relative">
        <div className="w-20 h-20 bg-gray-900 border-2 border-gray-700 rounded-full flex items-center justify-center">
          <span className="text-3xl font-black text-white font-mono">
            {gear}
          </span>
        </div>
        {/* Gear indicator dots */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {Array.from({ length: maxGear }, (_, i) => (
            <div
              key={i}
              className={`w-1 h-1 rounded-full ${
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
