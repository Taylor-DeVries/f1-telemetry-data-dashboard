'use client';

import { F1Track } from '@/data/f1Data';
import Image from 'next/image';

interface TrackImageProps {
  track: F1Track;
  teamColor: string;
}

export default function TrackImage({ track }: TrackImageProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-full">
      <div className="text-center mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">TRACK MAP</div>
        <div className="text-white font-bold text-xl">{track.name}</div>
        <div className="text-gray-300 text-sm">{track.country} • {track.length}km • {track.turns} turns</div>
      </div>
      
      <div className="relative">
        {/* Track Image */}
        <div className="w-full h-64 bg-gray-700 rounded-lg overflow-hidden border border-gray-600 relative">
          <Image
            src={`/tracks/${track.id}.png`}
            alt={`${track.name} track layout`}
            fill
            className="object-contain p-4 pb-16"
            onError={(e) => {
              // Fallback to placeholder if image doesn't exist
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full">
                    <div class="text-center">
                      <div class="w-16 h-16 mx-auto mb-2 bg-gray-600 rounded-full flex items-center justify-center">
                        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                        </svg>
                      </div>
                      <p class="text-gray-400 text-sm">Track Image</p>
                      <p class="text-gray-500 text-xs mt-1">Coming Soon</p>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
        
        {/* Track Info Overlay */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-black/80 backdrop-blur-sm rounded p-2 border border-gray-600">
            <div className="flex justify-between text-xs text-white">
              <span className="font-medium">Length: {track.length}km</span>
              <span className="font-medium">Turns: {track.turns}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
