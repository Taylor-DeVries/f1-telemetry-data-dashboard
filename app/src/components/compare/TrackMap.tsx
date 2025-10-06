'use client';

import { F1Track } from '@/data/f1Data';

interface TrackMapProps {
  track: F1Track;
  teamColor: string;
}

export default function TrackMap({ track, teamColor }: TrackMapProps) {
  // Generate turn numbers based on track turns
  const turnNumbers = Array.from({ length: track.turns }, (_, i) => i + 1);
  
  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6">
      <div className="text-center mb-4">
        <div className="text-cyan-400 font-bold text-lg mb-1">TRACK MAP</div>
        <div className="text-white font-bold text-xl">{track.name}</div>
        <div className="text-gray-300 text-sm">{track.country} • {track.length}km • {track.turns} turns</div>
      </div>
      
      <div className="relative">
        {/* Track SVG */}
        <svg 
          viewBox="0 0 300 200" 
          className="w-full h-48 mx-auto"
          style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.3))' }}
        >
          {/* Track outline */}
          <path
            d={track.layout}
            fill="none"
            stroke="white"
            strokeWidth="3"
            className="opacity-30"
          />
          
          {/* Track racing line */}
          <path
            d={track.layout}
            fill="none"
            stroke={teamColor}
            strokeWidth="2"
            className="opacity-80"
          />
          
          {/* Turn numbers */}
          {turnNumbers.map((turn, index) => {
            const angle = (index / track.turns) * 360;
            const radius = 80;
            const x = 150 + radius * Math.cos((angle - 90) * Math.PI / 180);
            const y = 100 + radius * Math.sin((angle - 90) * Math.PI / 180);
            
            return (
              <g key={turn}>
                <circle
                  cx={x}
                  cy={y}
                  r="8"
                  fill="white"
                  stroke={teamColor}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={y + 2}
                  textAnchor="middle"
                  className="text-xs font-bold fill-black"
                >
                  {turn}
                </text>
              </g>
            );
          })}
          
          {/* Speed zones */}
          <g>
            {/* Low speed zones */}
            <rect x="50" y="50" width="60" height="20" fill="rgba(239, 68, 68, 0.3)" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1" rx="2" />
            <text x="80" y="63" textAnchor="middle" className="text-xs font-bold fill-white">LOW SPEED</text>
            
            {/* Medium speed zones */}
            <rect x="190" y="50" width="80" height="20" fill="rgba(245, 158, 11, 0.3)" stroke="rgba(245, 158, 11, 0.6)" strokeWidth="1" rx="2" />
            <text x="230" y="63" textAnchor="middle" className="text-xs font-bold fill-white">MEDIUM SPEED</text>
          </g>
        </svg>
      </div>
    </div>
  );
}
