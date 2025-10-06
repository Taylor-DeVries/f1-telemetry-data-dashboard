'use client';

import dynamic from 'next/dynamic';
import { TelemetryData } from '@/lib/api';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface SimpleDeltaChartProps {
  lap1Data: TelemetryData;
  lap2Data: TelemetryData;
  driver1Name: string;
  driver2Name: string;
  height?: number;
}

export default function SimpleDeltaChart({
  lap1Data,
  lap2Data,
  driver1Name,
  driver2Name,
  height = 200
}: SimpleDeltaChartProps) {
  const getDeltaData = () => {
    if (!lap1Data?.full_data || !lap2Data?.full_data) return [];

    const lap1Times = Object.values(lap1Data.full_data.time || {}) as number[];
    const lap2Times = Object.values(lap2Data.full_data.time || {}) as number[];
    
    const maxLength = Math.min(lap1Times.length, lap2Times.length);
    const xAxis = Array.from({ length: maxLength }, (_, i) => (i / maxLength) * 100);
    
    // Calculate cumulative time difference (positive = driver 1 is ahead)
    const deltaTimes = [];
    for (let i = 0; i < maxLength; i++) {
      const delta = (lap1Times[i] || 0) - (lap2Times[i] || 0);
      deltaTimes.push(delta);
    }

    return [
      {
        x: xAxis,
        y: deltaTimes,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: `Time Difference`,
        line: { 
          color: '#00D2BE', 
          width: 3,
          shape: 'spline' as const
        },
        fill: 'tonexty' as const,
        fillcolor: 'rgba(0, 210, 190, 0.1)',
        hovertemplate: `<b>Time Difference</b><br>` +
                      `Lap Progress: %{x:.1f}%<br>` +
                      `Delta: %{y:.3f}s<br>` +
                      `<extra></extra>`
      }
    ];
  };

  const layout = {
    title: {
      text: `Time Difference: ${driver1Name} vs ${driver2Name}`,
      font: { color: 'white', size: 14 },
      x: 0.5
    },
    xaxis: {
      title: 'Lap Progress (%)',
      titlefont: { color: 'white' },
      tickfont: { color: 'white' },
      gridcolor: '#374151',
      zerolinecolor: '#374151',
      showgrid: true
    },
    yaxis: {
      title: 'Time Difference (seconds)',
      titlefont: { color: 'white' },
      tickfont: { color: 'white' },
      gridcolor: '#374151',
      showgrid: true,
      zeroline: true,
      zerolinecolor: '#6B7280'
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'white' },
    margin: { t: 50, b: 50, l: 80, r: 40 },
    height: height,
    shapes: [
      {
        type: 'line' as const,
        x0: 0,
        x1: 100,
        y0: 0,
        y1: 0,
        line: {
          color: '#6B7280',
          width: 2,
          dash: 'dash' as const
        }
      }
    ]
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
      <div className="bg-gray-900 rounded-lg p-2">
        <Plot
          data={getDeltaData() as Plotly.Data[]}
          layout={layout}
          config={{
            displayModeBar: false,
            responsive: true
          }}
          style={{ width: '100%', height: `${height}px` }}
        />
      </div>
      
      {/* Explanation */}
      <div className="mt-3 text-xs text-gray-400">
        <p>
          <strong>How to read:</strong> 
          • <span className="text-green-400">Above zero line</span> = {driver1Name} is ahead
          • <span className="text-red-400">Below zero line</span> = {driver2Name} is ahead
          • <span className="text-gray-400">Dashed line</span> = Equal time
        </p>
      </div>
    </div>
  );
}
