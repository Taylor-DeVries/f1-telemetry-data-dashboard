'use client';

import dynamic from 'next/dynamic';
import { F1Driver } from '@/data/f1Data';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface TelemetryComparisonChartProps {
  data1: Plotly.Data[];
  data2: Plotly.Data[];
  driver1: F1Driver;
  driver2: F1Driver;
  title: string;
  height?: number;
}

export default function TelemetryComparisonChart({
  data1,
  data2,
  driver1,
  driver2,
  title,
  height = 400
}: TelemetryComparisonChartProps) {
  if (!data1.length || !data2.length) return null;

  // Combine data for comparison
  const combinedData = [
    ...data1.map(trace => ({
      ...trace,
      line: { ...(trace as Plotly.ScatterData).line, color: driver1.teamColor, width: 3 },
      name: `${driver1.name} - ${trace.name}`
    })),
    ...data2.map(trace => ({
      ...trace,
      line: { ...(trace as Plotly.ScatterData).line, color: driver2.teamColor, width: 3 },
      name: `${driver2.name} - ${trace.name}`
    }))
  ];

  const layout = {
    title: {
      text: title,
      font: { color: 'white', size: 16 }
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'white' },
    xaxis: {
      title: 'LAP PROGRESS',
      gridcolor: 'rgba(255,255,255,0.1)',
      color: 'white',
      showgrid: true
    },
    yaxis: {
      title: 'SPEED (KM/H)',
      gridcolor: 'rgba(255,255,255,0.1)',
      color: 'white',
      showgrid: true
    },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(0,0,0,0.8)',
      bordercolor: 'rgba(255,255,255,0.2)',
      borderwidth: 1,
      font: { color: 'white' }
    },
    margin: { t: 60, b: 60, l: 80, r: 40 },
    height: height
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
      <Plot
        data={combinedData as Plotly.Data[]}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
