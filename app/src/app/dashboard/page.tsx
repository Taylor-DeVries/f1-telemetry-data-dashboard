'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TelemetryData } from '@/lib/api';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Dashboard() {
  const [telemetryData, setTelemetryData] = useState<TelemetryData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plotData, setPlotData] = useState<any[]>([]);
  const [showAnalysisGuide, setShowAnalysisGuide] = useState(false);
  const [showStrategyGuide, setShowStrategyGuide] = useState(false);
  const [showProTips, setShowProTips] = useState(false);
  const router = useRouter();

  // First useEffect: Load data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('telemetryData');
    if (storedData) {
      setTelemetryData(JSON.parse(storedData));
    } else {
      router.push('/');
    }
  }, [router]);

  // Second useEffect: Auto-select common telemetry columns
  useEffect(() => {
    if (telemetryData) {
      const commonColumns = ['time', 'speed', 'throttle', 'brake', 'gear', 'rpm'];
      const availableColumns = telemetryData.columns.filter(col => 
        commonColumns.some(common => col.toLowerCase().includes(common))
      );
      setSelectedColumns(availableColumns.slice(0, 4));
    }
  }, [telemetryData]);

  // Third useEffect: Update plot data when columns change
  useEffect(() => {
    if (selectedColumns.length > 0 && telemetryData?.head) {
      const traces = selectedColumns.map(column => {
        const values = Object.values(telemetryData.head[column] || {}) as number[];
        return {
          x: Array.from({ length: values.length }, (_, i) => i),
          y: values,
          type: 'scatter' as const,
          mode: 'lines' as const,
          name: column,
          line: { width: 2 }
        };
      });
      setPlotData(traces);
    }
  }, [selectedColumns, telemetryData]);

  // Early return AFTER all hooks
  if (!telemetryData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-red-600 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-4 border-red-400 opacity-20 mx-auto"></div>
          </div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-2">
            Loading Telemetry Data
          </h2>
          <p className="text-gray-400 animate-pulse">Initializing race analysis systems...</p>
        </div>
      </div>
    );
  }

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center space-x-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-red-400"></div>
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-400 to-orange-400">
              F1 TELEMETRY DASHBOARD
            </h1>
            <div className="h-1 w-12 bg-gradient-to-l from-red-600 to-red-400"></div>
          </div>
          <p className="text-gray-300 text-lg">
            Real-time performance analysis and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Columns</p>
                <p className="text-white text-3xl font-bold mt-1">{telemetryData.columns.length}</p>
              </div>
              <div className="bg-red-500/20 rounded-full p-3">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Data Points</p>
                <p className="text-white text-3xl font-bold mt-1">{Object.keys(telemetryData.head[telemetryData.columns[0]] || {}).length}</p>
              </div>
              <div className="bg-red-500/20 rounded-full p-3">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Selected Metrics</p>
                <p className="text-white text-3xl font-bold mt-1">{selectedColumns.length}</p>
              </div>
              <div className="bg-red-500/20 rounded-full p-3">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/80 rounded-lg p-4 border border-gray-700 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Analysis Ready</p>
                <p className="text-white text-3xl font-bold mt-1">✓</p>
              </div>
              <div className="bg-red-500/20 rounded-full p-3">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Analysis Explanation */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden mb-8 backdrop-blur-sm">
          <button
            onClick={() => setShowAnalysisGuide(!showAnalysisGuide)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">📊 How This Dashboard Analyzes Your Data</h3>
            </div>
            <svg
              className={`w-6 h-6 text-gray-400 transform transition-transform ${showAnalysisGuide ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showAnalysisGuide && (
            <div className="px-6 pb-6 pt-2">
              <div className="text-gray-300 space-y-2 text-sm">
                <p><span className="font-semibold text-red-400">Interactive Visualization:</span> Your telemetry data is parsed and displayed using Plotly.js charts, allowing you to zoom, pan, and hover over data points for detailed information.</p>
                <p><span className="font-semibold text-red-400">Real-Time Metrics:</span> Key performance indicators like speed, throttle, brake pressure, gear selection, and RPM are automatically detected and highlighted for quick analysis.</p>
                <p><span className="font-semibold text-red-400">Pattern Recognition:</span> By overlaying multiple metrics, you can identify correlations—like how throttle application affects RPM, or how braking zones impact tire temperatures.</p>
                <p><span className="font-semibold text-red-400">Engineering Insights:</span> Click on any column tag below to add/remove metrics from your analysis. Compare different data streams to optimize racing lines and performance.</p>
              </div>
            </div>
          )}
        </div>

        {/* Race Strategy Guide */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden mb-8 backdrop-blur-sm">
          <button
            onClick={() => setShowStrategyGuide(!showStrategyGuide)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">🏆 Optimal Race Strategy & Performance Guide</h3>
            </div>
            <svg
              className={`w-6 h-6 text-gray-400 transform transition-transform ${showStrategyGuide ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showStrategyGuide && (
            <div className="p-6 pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Optimal Race Strategy */}
          <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-500/20 rounded-full p-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-green-400">🏆 Optimal Race Strategy Analysis</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="bg-gray-900/30 rounded p-3">
                <p className="font-semibold text-green-300 mb-1">1️⃣ Identify Braking Zones</p>
                <p className="text-xs">Look for <span className="text-yellow-400 font-mono">speed</span> drops paired with <span className="text-yellow-400 font-mono">brake</span> spikes. Late braking = faster lap times, but watch tire temps!</p>
              </div>
              <div className="bg-gray-900/30 rounded p-3">
                <p className="font-semibold text-green-300 mb-1">2️⃣ Throttle Application Points</p>
                <p className="text-xs">Find where <span className="text-yellow-400 font-mono">throttle</span> reaches 100%. Earlier = better exit speed. Compare with <span className="text-yellow-400 font-mono">gear</span> changes for optimal shift points.</p>
              </div>
              <div className="bg-gray-900/30 rounded p-3">
                <p className="font-semibold text-green-300 mb-1">3️⃣ RPM Management</p>
                <p className="text-xs">Keep <span className="text-yellow-400 font-mono">RPM</span> in the power band (usually 70-90% of max). Consistent RPM = smooth driving = faster times.</p>
              </div>
            </div>
          </div>

          {/* Tire & Performance Analysis */}
          <div className="bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-orange-500/20 rounded-full p-2">
                <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-orange-400">🔥 Tire & Performance Optimization</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="bg-gray-900/30 rounded p-3">
                <p className="font-semibold text-orange-300 mb-1">4️⃣ Tire Temperature Balance</p>
                <p className="text-xs">Monitor <span className="text-yellow-400 font-mono">tire_temp_*</span> channels. Ideal: all 4 tires within 10°C. Unbalanced = setup issue or driving style adjustment needed.</p>
              </div>
              <div className="bg-gray-900/30 rounded p-3">
                <p className="font-semibold text-orange-300 mb-1">5️⃣ Speed Consistency</p>
                <p className="text-xs">Smooth <span className="text-yellow-400 font-mono">speed</span> traces = consistent laps. Jagged lines indicate mistakes or traffic. Focus on maintaining flow through corners.</p>
              </div>
              <div className="bg-gray-900/30 rounded p-3">
                <p className="font-semibold text-orange-300 mb-1">6️⃣ Gear Strategy</p>
                <p className="text-xs">Check <span className="text-yellow-400 font-mono">gear</span> selection in corners. Lower gear = more acceleration but slower corner speed. Find the balance!</p>
              </div>
            </div>
          </div>
        </div>
              </div>
          )}
        </div>

        {/* Advanced Tips */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden mb-8 backdrop-blur-sm">
          <button
            onClick={() => setShowProTips(!showProTips)}
            className="w-full flex items-center justify-between p-6 hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-red-500/20 rounded-full p-3 flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">⚡ Pro Tips for Optimal Performance</h3>
            </div>
            <svg
              className={`w-6 h-6 text-gray-400 transform transition-transform ${showProTips ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showProTips && (
            <div className="px-6 pb-6 pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                <div>
                  <p className="font-semibold text-red-400 mb-1">📈 Compare Multiple Laps</p>
                  <p className="text-xs">Upload different lap CSVs to overlay them. Look for differences in braking points, throttle application, and corner speeds.</p>
                </div>
                <div>
                  <p className="font-semibold text-red-400 mb-1">🎯 Focus on Slow Corners</p>
                  <p className="text-xs">Time gained in slow corners (gears 2-4) has the biggest impact. Analyze throttle and brake overlap in these zones.</p>
                </div>
                <div>
                  <p className="font-semibold text-red-400 mb-1">🔍 Zoom Into Critical Sections</p>
                  <p className="text-xs">Use chart zoom tools to examine specific corners or straights. Look for micro-improvements in every section.</p>
                </div>
                <div>
                  <p className="font-semibold text-red-400 mb-1">💡 Watch for Correlations</p>
                  <p className="text-xs">High tire temps + early braking = overheating. High RPM + low speed = wheelspin. Data reveals the story!</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Data Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4 flex items-center">
            <svg className="w-7 h-7 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Data Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <span className="bg-red-600 rounded-full w-2 h-2 mr-2"></span>
                Available Telemetry Channels ({telemetryData.columns.length})
              </h3>
              <p className="text-xs text-gray-400 mb-3">Click to toggle metrics in the charts below</p>
              <div className="flex flex-wrap gap-2">
                {telemetryData.columns.map(column => (
                  <span
                    key={column}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all transform hover:scale-105 ${
                      selectedColumns.includes(column)
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/50 ring-2 ring-red-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                    }`}
                    onClick={() => handleColumnToggle(column)}
                  >
                    {column}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <span className="bg-orange-600 rounded-full w-2 h-2 mr-2"></span>
                Sample Data (First 5 rows)
              </h3>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(telemetryData.head, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Timing Analysis */}
        {telemetryData.full_data && telemetryData.full_data.sector && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4 flex items-center">
              <svg className="w-7 h-7 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sector Timing Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((sectorNum) => {
                const sectorIndices = Object.entries(telemetryData.full_data.sector)
                  .filter(([, value]) => value === sectorNum)
                  .map(([index]) => parseInt(index));
                
                if (sectorIndices.length === 0) return null;
                
                const sectorTimes = sectorIndices.map(i => telemetryData.full_data.time[i]);
                const sectorTime = Math.max(...sectorTimes) - Math.min(...sectorTimes);
                
                const sectorSpeeds = sectorIndices.map(i => telemetryData.full_data.speed[i]);
                const avgSpeed = sectorSpeeds.reduce((a, b) => a + b, 0) / sectorSpeeds.length;
                const maxSpeed = Math.max(...sectorSpeeds);
                
                return (
                  <div key={sectorNum} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-red-400">Sector {sectorNum}</h3>
                      <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs font-mono">
                        {sectorIndices.length} pts
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">⏱️ Time:</span>
                        <span className="text-white font-bold text-lg">{sectorTime.toFixed(3)}s</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">📊 Avg Speed:</span>
                        <span className="text-red-300 font-semibold">{avgSpeed.toFixed(1)} km/h</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">⚡ Max Speed:</span>
                        <span className="text-orange-400 font-semibold">{maxSpeed.toFixed(1)} km/h</span>
                      </div>
                    </div>
                    
                    {/* Performance Bar */}
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                            style={{ width: `${(avgSpeed / maxSpeed) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{((avgSpeed / maxSpeed) * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="font-semibold text-red-400">💡 Insight:</span> Sector times help identify where to focus improvements. 
                Lower sector times with consistent speeds indicate optimal performance.
              </p>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              🏁 Live Telemetry Analysis
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-medium">LIVE</span>
              </div>
            </div>
          </div>
          
          {selectedColumns.length > 0 ? (
            <div className="space-y-6">
              {/* Main Chart */}
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <span className="bg-gradient-to-r from-red-500 to-orange-500 rounded w-1 h-4 mr-2"></span>
                  Multi-Channel Overlay Analysis
                </h3>
                <p className="text-xs text-gray-400 mb-4">All selected metrics plotted together to identify correlations and patterns</p>
                <div className="h-96 bg-gray-950/30 rounded-lg p-2">
                  <Plot
                    data={plotData}
                    layout={{
                      title: { text: '' },
                      xaxis: { 
                        title: { text: 'Data Point' },
                        gridcolor: '#374151',
                        color: '#9CA3AF'
                      },
                      yaxis: { 
                        title: { text: 'Value' },
                        gridcolor: '#374151',
                        color: '#9CA3AF'
                      },
                      hovermode: 'x unified',
                      showlegend: true,
                      paper_bgcolor: 'rgba(0,0,0,0)',
                      plot_bgcolor: 'rgba(0,0,0,0)',
                      font: { color: '#E5E7EB', family: 'system-ui' },
                      legend: { 
                        x: 0, 
                        y: 1,
                        bgcolor: 'rgba(0,0,0,0.5)',
                        bordercolor: '#4B5563',
                        borderwidth: 1
                      },
                      margin: { t: 20, r: 50, b: 50, l: 60 }
                    }}
                    config={{
                      responsive: true,
                      displayModeBar: true,
                      modeBarButtonsToRemove: ['pan2d', 'lasso2d', 'select2d'],
                      displaylogo: false
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              </div>

              {/* Individual Charts for each selected column */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {selectedColumns.map((column, index) => {
                  const values = Object.values(telemetryData.head[column] || {}) as number[];
                  const colors = ['#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={column} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: color }}></span>
                        {column.toUpperCase()}
                      </h4>
                      <div className="h-56 bg-gray-950/30 rounded-lg p-2">
                        <Plot
                          data={[{
                            x: Array.from({ length: values.length }, (_, i) => i),
                            y: values,
                            type: 'scatter',
                            mode: 'lines',
                            name: column,
                            line: { width: 3, color: color },
                            fill: 'tozeroy',
                            fillcolor: `${color}20`
                          }]}
                          layout={{
                            title: { text: '' },
                            xaxis: { 
                              title: { text: 'Data Point' },
                              gridcolor: '#374151',
                              color: '#9CA3AF',
                              showgrid: true
                            },
                            yaxis: { 
                              title: { text: column },
                              gridcolor: '#374151',
                              color: '#9CA3AF',
                              showgrid: true
                            },
                            paper_bgcolor: 'rgba(0,0,0,0)',
                            plot_bgcolor: 'rgba(0,0,0,0)',
                            font: { color: '#E5E7EB', size: 10 },
                            margin: { t: 10, r: 20, b: 40, l: 50 },
                            showlegend: false
                          }}
                          config={{
                            responsive: true,
                            displayModeBar: false
                          }}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-900/30 rounded-lg border-2 border-dashed border-gray-700">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-gray-400 text-lg font-medium">No Metrics Selected</p>
              <p className="text-gray-500 text-sm mt-2">
                Select telemetry channels from the data overview above to display charts
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-center space-x-4 flex-wrap gap-4">
          <button
            onClick={() => window.location.href = '/'}
            className="group relative inline-flex items-center px-6 py-3 border-2 border-red-600 text-sm font-bold rounded-lg text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-all hover:scale-105 shadow-lg shadow-red-900/50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload New Telemetry Data
          </button>
          <button
            onClick={() => window.location.href = '/compare'}
            className="group relative inline-flex items-center px-6 py-3 border-2 border-blue-600 text-sm font-bold rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all hover:scale-105 shadow-lg shadow-blue-900/50"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare Laps
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            💡 <span className="text-gray-400">Pro Tip:</span> Use the chart tools to zoom into specific sections and analyze critical moments in detail
          </p>
        </div>
      </div>
    </div>
  );
}
