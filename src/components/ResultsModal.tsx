import React from 'react';
import { Link } from 'react-router-dom';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    wpm: number;
    accuracy: number;
    errors: number;
    charactersTyped: number;
    wordsTyped: number;
    duration: number;
  } | null;
  onNewTest: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  results,
  onNewTest,
}) => {
  if (!isOpen || !results) return null;

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 95) return 'text-green-600';
    if (accuracy >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWpmColor = (wpm: number): string => {
    if (wpm >= 60) return 'text-green-600';
    if (wpm >= 40) return 'text-blue-600';
    if (wpm >= 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Test Complete!</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className={`text-3xl font-bold ${getWpmColor(results.wpm)}`}>
                  {results.wpm}
                </div>
                <div className="text-sm text-gray-600 mt-1">WPM</div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className={`text-3xl font-bold ${getAccuracyColor(results.accuracy)}`}>
                  {results.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Accuracy</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Duration</span>
                <span className="font-medium">{formatDuration(results.duration)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Words Typed</span>
                <span className="font-medium">{results.wordsTyped}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Characters Typed</span>
                <span className="font-medium">{results.charactersTyped}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Errors</span>
                <span className={`font-medium ${results.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {results.errors}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Performance Rating</h3>
              <div className="flex items-center space-x-2">
                {results.wpm >= 60 && results.accuracy >= 95 ? (
                  <>
                    <span className="text-2xl">🏆</span>
                    <span className="text-green-600 font-medium">Excellent!</span>
                  </>
                ) : results.wpm >= 40 && results.accuracy >= 85 ? (
                  <>
                    <span className="text-2xl">⭐</span>
                    <span className="text-blue-600 font-medium">Great job!</span>
                  </>
                ) : results.wpm >= 20 && results.accuracy >= 75 ? (
                  <>
                    <span className="text-2xl">👍</span>
                    <span className="text-yellow-600 font-medium">Good work!</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">💪</span>
                    <span className="text-gray-600 font-medium">Keep practicing!</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={onNewTest}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              New Test
            </button>
            
            <Link
              to="/history"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium text-center"
              onClick={onClose}
            >
              View History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};