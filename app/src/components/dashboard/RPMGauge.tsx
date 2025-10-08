'use client';

interface RPMGaugeProps {
  rpm: number;
  maxRpm?: number;
  onRpmChange?: (newRpm: number) => void;
  isManualOverride?: boolean;
}

export default function RPMGauge({ 
  rpm, 
  maxRpm = 15000,
  onRpmChange,
  isManualOverride = false
}: RPMGaugeProps) {
  const percentage = (rpm / maxRpm) * 100;
  const rotation = (percentage / 100) * 180 - 90; // -90 to 90 degrees

  const handleRpmChange = (delta: number) => {
    if (onRpmChange) {
      const newRpm = Math.max(0, Math.min(maxRpm, rpm + delta));
      onRpmChange(newRpm);
    }
  };

  return (
    <div>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 mx-auto">
      {/* Outer Ring */}
      <div className="absolute inset-0 rounded-full border-4 sm:border-6 lg:border-8 border-gray-800"></div>
      
      {/* RPM Arc */}
      <div className="absolute inset-1 sm:inset-2 rounded-full border-4 sm:border-6 lg:border-8 border-transparent border-t-red-500 border-r-red-500"></div>
      
      {/* RPM Markings */}
      <div className="absolute inset-0">
        {[0, 25, 50, 75, 100].map((mark) => {
          const angle = (mark / 100) * 180 - 90;
          const x = 50 + 40 * Math.cos((angle * Math.PI) / 180);
          const y = 50 + 40 * Math.sin((angle * Math.PI) / 180);
          
          return (
            <div
              key={mark}
              className="absolute w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-500 rounded-full"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}
      </div>

      {/* RPM Labels */}
      <div className="absolute inset-0 text-xs text-red-500 font-mono">
        <div className="absolute text-xs sm:text-sm" style={{ left: '15%', top: '85%' }}>0</div>
        <div className="absolute text-xs sm:text-sm" style={{ left: '25%', top: '70%' }}>3</div>
        <div className="absolute text-xs sm:text-sm" style={{ left: '50%', top: '10%' }}>6</div>
        <div className="absolute text-xs sm:text-sm" style={{ left: '75%', top: '70%' }}>9</div>
        <div className="absolute text-xs sm:text-sm" style={{ left: '85%', top: '85%' }}>12</div>
      </div>

      {/* Needle */}
      <div 
        className="absolute w-0.5 sm:w-1 h-10 sm:h-12 lg:h-16 bg-red-500 origin-bottom"
        style={{
          left: '50%',
          top: '50%',
          transform: `translateX(-50%) rotate(${rotation}deg)`,
          transformOrigin: 'bottom center'
        }}
      />

      {/* Center Circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 bg-gray-800 rounded-full border border-gray-600 sm:border-2"></div>
      </div>

      {/* RPM Display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 sm:pt-12 lg:pt-16">
        <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono">
          {Math.round(rpm / 1000)}
        </div>
        <div className="text-xs text-gray-400 uppercase tracking-wider">
          RPM ×1000
        </div>
        {isManualOverride && (
          <div className="mt-1 text-xs text-yellow-400 font-semibold">
            MANUAL
          </div>
        )}
      </div>
    </div>
    
    {/* Control Buttons */}
    {onRpmChange && (
      <div className="flex justify-center space-x-1 sm:space-x-2 mt-2 sm:mt-4">
        <button
          onClick={() => handleRpmChange(-1000)}
          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
          title="Decrease RPM by 1000"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        </button>
        <button
          onClick={() => handleRpmChange(-100)}
          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
          title="Decrease RPM by 100"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          onClick={() => handleRpmChange(100)}
          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
          title="Increase RPM by 100"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          onClick={() => handleRpmChange(1000)}
          className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
          title="Increase RPM by 1000"
        >
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    )}
    </div>
  );
}
