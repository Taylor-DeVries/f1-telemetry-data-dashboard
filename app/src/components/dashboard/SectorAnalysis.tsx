'use client';

interface SectorData {
  sector: number;
  time: number;
  avgSpeed: number;
  maxSpeed: number;
  dataPoints: number;
}

interface SectorAnalysisProps {
  sectors: SectorData[];
}

export default function SectorAnalysis({ sectors }: SectorAnalysisProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider flex items-center">
          <div className="w-1 h-4 sm:h-6 bg-cyan-400 mr-2 sm:mr-3"></div>
          SECTOR TIMING BREAKDOWN
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {sectors.map((sector) => (
          <div key={sector.sector} className="bg-black border border-gray-700 rounded-lg p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold text-cyan-400">SECTOR {sector.sector}</h3>
              <span className="bg-cyan-500/20 text-cyan-300 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-mono">
                {sector.dataPoints} pts
              </span>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">TIME</span>
                <span className="text-white font-bold text-sm sm:text-base lg:text-lg font-mono">
                  {sector.time.toFixed(3)}s
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">AVG SPEED</span>
                <span className="text-cyan-300 font-semibold font-mono text-xs sm:text-sm">
                  {sector.avgSpeed.toFixed(1)} km/h
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">MAX SPEED</span>
                <span className="text-orange-400 font-semibold font-mono text-xs sm:text-sm">
                  {sector.maxSpeed.toFixed(1)} km/h
                </span>
              </div>
            </div>
            
            {/* Performance Bar */}
            <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-700">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <div className="flex-1 bg-gray-800 rounded-full h-1.5 sm:h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-orange-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(sector.avgSpeed / sector.maxSpeed) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 font-mono">
                  {((sector.avgSpeed / sector.maxSpeed) * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black border border-gray-700 rounded-lg">
        <p className="text-xs sm:text-sm text-gray-300">
          <span className="font-semibold text-cyan-400">💡 INSIGHT:</span> Sector times help identify where to focus improvements. 
          Lower sector times with consistent speeds indicate optimal performance.
        </p>
      </div>
    </div>
  );
}
