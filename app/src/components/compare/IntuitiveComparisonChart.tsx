'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { TelemetryData } from '@/lib/api';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface IntuitiveComparisonChartProps {
  lap1Data: TelemetryData;
  lap2Data: TelemetryData;
  driver1Name: string;
  driver2Name: string;
  driver1Color: string;
  driver2Color: string;
  title: string;
  height?: number;
}

export default function IntuitiveComparisonChart({
  lap1Data,
  lap2Data,
  driver1Name,
  driver2Name,
  driver1Color,
  driver2Color,
  title,
  height = 300
}: IntuitiveComparisonChartProps) {
  const [selectedMetric, setSelectedMetric] = useState('speed');

  const metrics = [
    { key: 'speed', label: 'Speed (km/h)', icon: '🏎️' },
    { key: 'throttle', label: 'Throttle (%)', icon: '🚀' },
    { key: 'brake', label: 'Brake (%)', icon: '🛑' },
    { key: 'gear', label: 'Gear', icon: '⚙️' },
    { key: 'rpm', label: 'RPM', icon: '💨' }
  ];

  const getChartData = () => {
    if (!lap1Data?.full_data || !lap2Data?.full_data) return [];

    const lap1Values = Object.values(lap1Data.full_data[selectedMetric] || {}) as number[];
    const lap2Values = Object.values(lap2Data.full_data[selectedMetric] || {}) as number[];
    
    const maxLength = Math.max(lap1Values.length, lap2Values.length);
    const xAxis = Array.from({ length: maxLength }, (_, i) => (i / maxLength) * 100);

    return [
      {
        x: xAxis,
        y: lap1Values,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: driver1Name,
        line: { 
          color: driver1Color, 
          width: 3,
          shape: 'spline' as const
        },
        hovertemplate: `<b>${driver1Name}</b><br>` +
                      `Lap Progress: %{x:.1f}%<br>` +
                      `${metrics.find(m => m.key === selectedMetric)?.label}: %{y:.1f}<br>` +
                      `<extra></extra>`
      },
      {
        x: xAxis,
        y: lap2Values,
        type: 'scatter' as const,
        mode: 'lines' as const,
        name: driver2Name,
        line: { 
          color: driver2Color, 
          width: 3,
          shape: 'spline' as const
        },
        hovertemplate: `<b>${driver2Name}</b><br>` +
                      `Lap Progress: %{x:.1f}%<br>` +
                      `${metrics.find(m => m.key === selectedMetric)?.label}: %{y:.1f}<br>` +
                      `<extra></extra>`
      }
    ];
  };

  const layout = {
    title: {
      text: title,
      font: { color: 'white', size: 16 },
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
      title: metrics.find(m => m.key === selectedMetric)?.label || 'Value',
      titlefont: { color: 'white' },
      tickfont: { color: 'white' },
      gridcolor: '#374151',
      zerolinecolor: '#374151',
      showgrid: true
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    font: { color: 'white' },
    legend: {
      x: 0.02,
      y: 0.98,
      bgcolor: 'rgba(0,0,0,0.7)',
      bordercolor: '#374151',
      borderwidth: 1,
      font: { color: 'white' }
    },
    margin: { t: 60, b: 60, l: 80, r: 40 },
    height: height
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
      {/* Metric Selector */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">SELECT METRIC TO COMPARE</div>
        <div className="flex flex-wrap gap-2">
          {metrics.map(metric => (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedMetric === metric.key
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span className="mr-1">{metric.icon}</span>
              {metric.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-900 rounded-lg p-2">
        <Plot
          data={getChartData()}
          layout={layout}
          config={{
            displayModeBar: false,
            responsive: true
          }}
          style={{ width: '100%', height: `${height}px` }}
        />
      </div>

      {/* Chart Explanation */}
      <div className="mt-3 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: driver1Color }}></div>
            <span>{driver1Name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: driver2Color }}></div>
            <span>{driver2Name}</span>
          </div>
        </div>
        <p className="mt-2">
          <strong>How to read:</strong> X-axis shows lap progress (0% = start, 100% = finish). 
          Higher values generally mean better performance, except for brake percentage.
        </p>
      </div>
    </div>
  );
}
