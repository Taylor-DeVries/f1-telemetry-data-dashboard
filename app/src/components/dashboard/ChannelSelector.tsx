'use client';

interface ChannelSelectorProps {
  channels: string[];
  selectedChannels: string[];
  onChannelToggle: (channel: string) => void;
}

export default function ChannelSelector({ 
  channels, 
  selectedChannels, 
  onChannelToggle 
}: ChannelSelectorProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
          TELEMETRY CHANNELS
        </h3>
        <p className="text-xs text-gray-400">
          Select channels to display in the analysis below
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {channels.map(channel => (
          <button
            key={channel}
            onClick={() => onChannelToggle(channel)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all transform hover:scale-105 ${
              selectedChannels.includes(channel)
                ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white shadow-lg shadow-cyan-900/50 ring-2 ring-cyan-400'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
            }`}
          >
            {channel.toUpperCase()}
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {selectedChannels.length} of {channels.length} channels selected
      </div>
    </div>
  );
}
