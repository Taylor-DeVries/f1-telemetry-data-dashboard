'use client';

import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface DeltaTimeChartProps {
  lap1Data: any;
  lap2Data: any;
  driver1Name: string;
  driver2Name: string;
  height?: number;
}

export default function DeltaTimeChart({
  lap1Data,
  lap2Data,
  driver1Name,
  driver2Name,
  height = 200
}: DeltaTimeChartProps) {
  if (!lap1Data || !lap2Data) return null;

  // Calculate delta time (lap1 - lap2)
  const time1 = Object.values(lap1Data.full_data.time || {}) as number[];
  const time2 = Object.values(lap2Data.full_data.time || {}) as number[];
  const speed1 = Object.values(lap1Data.full_data.speed || {}) as number[];
  const speed2 = Object.values(lap2Data.full_data.speed || {}) as number[];

  const minLength = Math.min(time1.length, time2.length);
  const deltaTime = [];
  const xValues = [];

  for (let i = 0; i < minLength; i++) {
    const delta = time1[i] - time2[i];
    deltaTime.push(delta);
    xValues.push(i);
  }

  const data = [
    {
      x: xValues,
      y: deltaTime,
      type: 'scatter' as const,
      mode: 'lines' as const,
      name: `DELTA (${driver1Name} vs ${driver2Name})`,
      line: { 
        color: '#06B6D4', 
        width: 3 
      },
      fill: 'tonexty',
      fillcolor: 'rgba(6, 182, 212, 0.1)'
    }
  ];

  const layout = {
    title: {
      text: 'DELTA TIME',
      font: { color: 'white', size: 14 }
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
      title: 'DELTA (SECONDS)',
      gridcolor: 'rgba(255,255,255,0.1)',
      color: 'white',
      showgrid: true,
      zeroline: true,
      zerolinecolor: 'rgba(255,255,255,0.3)',
      zerolinewidth: 2
    },
    margin: { t: 40, b: 40, l: 80, r: 40 },
    height: height,
    annotations: [
      {
        x: 0.02,
        y: 0.95,
        xref: 'paper',
        yref: 'paper',
        text: 'FASTER',
        showarrow: false,
        font: { color: 'green', size: 12 },
        bgcolor: 'rgba(0,0,0,0.8)',
        bordercolor: 'green',
        borderwidth: 1
      },
      {
        x: 0.02,
        y: 0.05,
        xref: 'paper',
        yref: 'paper',
        text: 'SLOWER',
        showarrow: false,
        font: { color: 'red', size: 12 },
        bgcolor: 'rgba(0,0,0,0.8)',
        bordercolor: 'red',
        borderwidth: 1
      }
    ]
  };

  const config = {
    displayModeBar: false,
    responsive: true
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
      <Plot
        data={data}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
