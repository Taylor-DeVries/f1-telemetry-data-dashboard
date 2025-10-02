'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/components/FileUpload';
import DemoDataGenerator from '@/components/DemoDataGenerator';
import { TelemetryData } from '@/lib/api';

export default function Home() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showDemoGenerator, setShowDemoGenerator] = useState(false);
  const router = useRouter();

  const handleUploadSuccess = (data: TelemetryData) => {
    setError('');
    setSuccess('File uploaded successfully! Redirecting to dashboard...');
    
    // Store data in sessionStorage for the dashboard
    sessionStorage.setItem('telemetryData', JSON.stringify(data));
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  const handleUploadError = (errorMessage: string) => {
    setSuccess('');
    setError(errorMessage);
  };

  const handleDemoDataGenerated = (data: TelemetryData) => {
    setShowDemoGenerator(false);
    setError('');
    setSuccess('Demo data generated successfully! Redirecting to dashboard...');
    
    // Store data in sessionStorage for the dashboard
    sessionStorage.setItem('telemetryData', JSON.stringify(data));
    
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🏎️ F1 Telemetry Dashboard
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload your F1 telemetry data and analyze performance with interactive charts. 
            Compare laps, analyze sectors, and dive deep into racing data.
          </p>
        </div>

        {/* Upload Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <FileUpload 
              onUploadSuccess={handleUploadSuccess}
              onUploadError={handleUploadError}
            />
            
            {/* Demo Data Generator Button */}
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-800/50 text-gray-400">OR</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowDemoGenerator(true)}
                className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-900/50"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Try Demo Data Generator
              </button>
              <p className="text-gray-400 text-sm mt-2">
                No CSV? Generate realistic telemetry data to test the dashboard
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-200">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-200">{success}</p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-3">Interactive Charts</h3>
              <p className="text-gray-300">
                Visualize speed, throttle, brake, gear, and RPM data with interactive Plotly charts.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">🏁</div>
              <h3 className="text-xl font-semibold text-white mb-3">Lap Analysis</h3>
              <p className="text-gray-300">
                Compare different laps and analyze sector performance to improve your racing.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Updates</h3>
              <p className="text-gray-300">
                Simulate real-time telemetry updates for live race analysis and monitoring.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-400">
          <p>Built with Next.js, FastAPI, and Plotly.js</p>
        </div>
      </div>

      {/* Demo Data Generator Modal */}
      {showDemoGenerator && (
        <DemoDataGenerator
          onDataGenerated={handleDemoDataGenerated}
          onClose={() => setShowDemoGenerator(false)}
        />
      )}
    </div>
  );
}
