'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import DemoDataGenerator from '@/components/DemoDataGenerator';
import { TelemetryData } from '@/lib/api';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function CompareLaps() {
  const [lap1Data, setLap1Data] = useState<TelemetryData | null>(null);
  const [lap2Data, setLap2Data] = useState<TelemetryData | null>(null);
  const [selectedMetric, setSelectedMetric] = useState('speed');
  const [showGeneratorFor, setShowGeneratorFor] = useState<1 | 2 | null>(null);
  const router = useRouter();

  const handleFileUpload = async (file: File, lapNumber: 1 | 2) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (lapNumber === 1) {
        setLap1Data(data);
      } else {
        setLap2Data(data);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleDemoDataGenerated = (data: TelemetryData) => {
    if (showGeneratorFor === 1) {
      setLap1Data(data);
    } else if (showGeneratorFor === 2) {
      setLap2Data(data);
    }
    setShowGeneratorFor(null);
  };

  const getComparisonPlot = () => {
    if (!lap1Data || !lap2Data || !selectedMetric) return null;

    const lap1Values = Object.values(lap1Data.head[selectedMetric] || {}) as number[];
    const lap2Values = Object.values(lap2Data.head[selectedMetric] || {}) as number[];

    return {
      data: [
        {
          x: Array.from({ length: lap1Values.length }, (_, i) => i),
          y: lap1Values,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: 'Lap 1',
          line: { width: 3, color: '#EF4444' }
        },
        {
          x: Array.from({ length: lap2Values.length }, (_, i) => i),
          y: lap2Values,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: 'Lap 2',
          line: { width: 3, color: '#F97316' }
        }
      ],
      layout: {
        title: { text: `${selectedMetric.toUpperCase()} Comparison` },
        xaxis: { title: { text: 'Data Point' }, gridcolor: '#374151', color: '#9CA3AF' },
        yaxis: { title: { text: selectedMetric }, gridcolor: '#374151', color: '#9CA3AF' },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#E5E7EB' },
        legend: { x: 0, y: 1 },
        hovermode: 'x unified' as const
      }
    };
  };

  const plot = getComparisonPlot();
  const commonMetrics = lap1Data && lap2Data ? 
    lap1Data.columns.filter((col: string) => lap2Data.columns.includes(col)) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-blue-400 to-purple-400 mb-4">
            LAP COMPARISON
          </h1>
          <p className="text-gray-300 text-lg">
            Upload two laps and compare telemetry side-by-side
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Lap 1 Upload */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center">
              <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">1</span>
              Lap 1 {lap1Data && '✓'}
            </h3>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 1)}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-red-600 file:text-white
                hover:file:bg-red-700 file:cursor-pointer"
            />
            {lap1Data && (
              <p className="text-red-400 text-sm mt-2">
                ✓ Loaded: {lap1Data.columns.length} channels
              </p>
            )}
            
            {/* Demo Generator Button for Lap 1 */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-800 text-gray-500">OR</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowGeneratorFor(1)}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Demo Lap 1
              </button>
            </div>
          </div>

          {/* Lap 2 Upload */}
          <div className="bg-gray-800/80 border border-gray-700 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-2">2</span>
              Lap 2 {lap2Data && '✓'}
            </h3>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files[0], 2)}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-600 file:text-white
                hover:file:bg-blue-700 file:cursor-pointer"
            />
            {lap2Data && (
              <p className="text-blue-400 text-sm mt-2">
                ✓ Loaded: {lap2Data.columns.length} channels
              </p>
            )}
            
            {/* Demo Generator Button for Lap 2 */}
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-gray-800 text-gray-500">OR</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowGeneratorFor(2)}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Demo Lap 2
              </button>
            </div>
          </div>
        </div>

        {/* Metric Selector */}
        {commonMetrics.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h3 className="text-lg font-bold text-white mb-4">Select Metric to Compare</h3>
            <div className="flex flex-wrap gap-2">
              {commonMetrics.map((metric: string) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${
                    selectedMetric === metric
                      ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white shadow-lg ring-2 ring-red-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {metric}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Chart */}
        {plot && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <div className="h-96 bg-gray-950/30 rounded-lg p-4">
              <Plot
                data={plot.data}
                layout={plot.layout}
                config={{ responsive: true, displaylogo: false }}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-bold rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Demo Data Generator Modal */}
      {showGeneratorFor && (
        <DemoDataGenerator
          onDataGenerated={handleDemoDataGenerated}
          onClose={() => setShowGeneratorFor(null)}
        />
      )}
    </div>
  );
}

