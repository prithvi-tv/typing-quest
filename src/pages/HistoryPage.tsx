import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { ResultsList } from '../components/ResultsList';
import { SettingsModal } from '../components/SettingsModal';
import { storage } from '../utils/storage';
import { TestResult, UserSettings } from '../types/index';

export const HistoryPage: React.FC = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [showAllResults, setShowAllResults] = useState(false);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = () => {
    const allResults = storage.getResults();
    setResults(allResults);
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const clearAllResults = () => {
    if (window.confirm('Are you sure you want to delete all test results? This action cannot be undone.')) {
      storage.clearAllResults();
      setResults([]);
    }
  };

  const stats = storage.getResultStats();
  const displayResults = showAllResults ? results : results.slice(0, 10);

  const getRecentPerformance = () => {
    if (results.length < 2) return null;
    
    const recent = results.slice(0, 5);
    const older = results.slice(5, 10);
    
    if (older.length === 0) return null;
    
    const recentAvgWpm = recent.reduce((sum, r) => sum + r.wpm, 0) / recent.length;
    const olderAvgWpm = older.reduce((sum, r) => sum + r.wpm, 0) / older.length;
    
    const improvement = recentAvgWpm - olderAvgWpm;
    
    return {
      improvement: Math.round(improvement),
      isImproving: improvement > 0,
    };
  };

  const performance = getRecentPerformance();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
              <p className="text-gray-600 mt-1">
                Track your typing progress over time
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                to="/"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Take New Test
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Tests</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTests}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Average WPM</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageWpm}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageAccuracy}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Best WPM</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.bestWpm}</p>
                </div>
              </div>
            </div>
          </div>

          {performance && (
            <div className={`rounded-lg border p-4 ${
              performance.isImproving 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center">
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                  performance.isImproving 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {performance.isImproving ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${
                    performance.isImproving ? 'text-green-800' : 'text-red-800'
                  }`}>
                    Recent Performance Trend
                  </p>
                  <p className={`text-lg font-bold ${
                    performance.isImproving ? 'text-green-900' : 'text-red-900'
                  }`}>
                    {performance.isImproving ? '+' : ''}{performance.improvement} WPM vs previous tests
                  </p>
                </div>
              </div>
            </div>
          )}

          {results.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No test results yet</h3>
              <p className="text-gray-500 mb-6">
                Take your first typing test to start tracking your progress.
              </p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Take Your First Test
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Test Results ({results.length})
                </h2>
                <div className="flex items-center space-x-3">
                  {results.length > 10 && (
                    <button
                      onClick={() => setShowAllResults(!showAllResults)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                    >
                      {showAllResults ? 'Show Recent Only' : `Show All ${results.length} Results`}
                    </button>
                  )}
                  {results.length > 0 && (
                    <button
                      onClick={clearAllResults}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              <ResultsList
                results={displayResults}
                showQuoteText={true}
                maxResults={showAllResults ? results.length : 10}
              />
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">Understanding your results:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>WPM (Words Per Minute):</strong> Standard measure of typing speed (1 word = 5 characters)</li>
                    <li>• <strong>Accuracy:</strong> Percentage of characters typed correctly</li>
                    <li>• <strong>Errors:</strong> Number of incorrect characters typed</li>
                    <li>• <strong>Good targets:</strong> 40+ WPM with 95%+ accuracy for general use</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};