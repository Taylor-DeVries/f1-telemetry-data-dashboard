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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            F1 Telemetry Analysis
          </h1>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
            Professional Formula 1 telemetry analysis with realistic demo data
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              onClick={() => {
                setAnalysisType('single');
                setShowDemoGenerator(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 text-lg"
            >
              Single Driver Analysis
            </button>
            
            <button
              onClick={() => setShowComparisonGenerator(true)}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 text-lg"
            >
              Lap Comparison
            </button>
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
