'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DemoDataGenerator from '@/components/DemoDataGenerator';
import LapComparisonGenerator from '@/components/LapComparisonGenerator';
import { TelemetryData } from '@/lib/api';

export default function Home() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showDemoGenerator, setShowDemoGenerator] = useState(false);
  const [showComparisonGenerator, setShowComparisonGenerator] = useState(false);
  const [analysisType, setAnalysisType] = useState<'single' | 'comparison'>('single');
  const router = useRouter();

  const handleDemoDataGenerated = (data: TelemetryData) => {
    setShowDemoGenerator(false);
    setError('');
    setSuccess('Demo data generated successfully! Redirecting to dashboard...');
    
    // Store data in sessionStorage for the dashboard
    sessionStorage.setItem('telemetryData', JSON.stringify(data));
    
    // Redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleComparisonDataGenerated = (lap1Data: TelemetryData, lap2Data: TelemetryData) => {
    setShowComparisonGenerator(false);
    setError('');
    setSuccess('Comparison data generated successfully! Redirecting to comparison dashboard...');
    
    // Store both lap data in sessionStorage
    sessionStorage.setItem('lap1Data', JSON.stringify(lap1Data));
    sessionStorage.setItem('lap2Data', JSON.stringify(lap2Data));
    
    // Redirect to comparison dashboard
    setTimeout(() => {
      router.push('/compare');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
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
          <div className="h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            F1 Telemetry Analysis
          </h1>
          <p className="text-gray-400 text-xl mb-8 max-w-3xl mx-auto">
            telemetry analysis with realistic demo data. Choose your analysis type below.
          </p>
        </div>

        {/* Analysis Options with Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Single Driver Analysis Preview */}
          <div className="group cursor-pointer" onClick={() => {
            setAnalysisType('single');
            setShowDemoGenerator(true);
          }}>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 transform hover:scale-105">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Single Driver Analysis</h3>
                    <p className="text-red-100 text-sm">Comprehensive telemetry dashboard</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6">
                {/* Features List */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time telemetry visualization
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Interactive gauge controls
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sector timing analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Live mode simulation
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors">
                    Start Analysis
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lap Comparison Preview */}
          <div className="group cursor-pointer" onClick={() => setShowComparisonGenerator(true)}>
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all duration-300 transform hover:scale-105">
              {/* Preview Header */}
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Lap Comparison</h3>
                    <p className="text-cyan-100 text-sm">Side-by-side driver analysis</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6">

                {/* Features List */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Side-by-side driver comparison
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Delta time analysis
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Performance metrics
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Interactive charts
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors">
                    Start Comparison
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Dashboard Features</h3>
            <p className="text-gray-400 mb-6 max-w-3xl mx-auto">
              Experience realistic Formula 1 telemetry data with interactive dashboards, 
              real-time simulations, and comprehensive analysis tools used by professional race engineers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-2">Real-time Data</h4>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-2">Interactive Controls</h4>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 className="text-white font-semibold mb-2">Track Analysis</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mt-8 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mt-8 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-200">{success}</p>
            </div>
          </div>
        )}
      </div>

      {/* Demo Data Generator Modal */}
      {showDemoGenerator && (
        <DemoDataGenerator
          onDataGenerated={handleDemoDataGenerated}
          onClose={() => setShowDemoGenerator(false)}
        />
      )}

      {/* Lap Comparison Generator Modal */}
      {showComparisonGenerator && (
        <LapComparisonGenerator
          onDataGenerated={handleComparisonDataGenerated}
          onClose={() => setShowComparisonGenerator(false)}
        />
      )}
    </div>
  );
}
