'use client';

interface F1HeaderProps {
  trackName?: string;
  sessionType?: string;
  lapTime?: string;
  weather?: string;
  teamColor?: string;
}

export default function F1Header({ 
}: F1HeaderProps) {
  return (
    <div className="bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center py-4">
          {/* F1 Logo */}
          <div className="flex items-center space-x-4">
            <div className="text-white font-black text-2xl">
              <span className="text-red-600">F1</span>
            </div>
            <div className="h-8 w-px bg-gray-600"></div>
            <div className="text-white font-bold text-lg">
              TELEMETRY DASHBOARD
            </div>
          </div>
        </div>

        {/* Bottom Header Bar */}
        <div className="h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
      </div>
    </div>
  );
}
