import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { QuoteDisplay } from '../components/QuoteDisplay';
import { TypingInput } from '../components/TypingInput';
import { Timer } from '../components/Timer';
import { ResultsModal } from '../components/ResultsModal';
import { SettingsModal } from '../components/SettingsModal';
import { useTypingTest } from '../hooks/useTypingTest';
import { quotes } from '../utils/quotes';
import { storage } from '../utils/storage';
import { UserSettings } from '../types/index';

export const TestPage: React.FC = () => {
  const { state, actions, getTestResult, saveTestResult } = useTypingTest();
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(() => storage.getSettings());
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const savedSettings = storage.getSettings();
    setSettings(savedSettings);
  }, []);

  const startNewTest = () => {
    const randomQuote = quotes.getRandom();
    actions.resetTest();
    // Set up the quote but don't start the timer yet
    actions.startTest(randomQuote);
    actions.pauseTest(); // Immediately pause so it's ready for auto-start
    setShowResults(false);
    setTestResult(null);
  };

  const handleTestComplete = () => {
    const result = getTestResult();
    if (result) {
      saveTestResult();
      setTestResult(result);
      setShowResults(true);
    }
  };

  const handleSettingsChange = (newSettings: UserSettings) => {
    setSettings(newSettings);
  };

  const handleInputChange = (text: string) => {
    actions.updateTypedText(text);
  };

  useEffect(() => {
    if (state.isCompleted && !showResults) {
      handleTestComplete();
    }
  }, [state.isCompleted]);

  useEffect(() => {
    if (!state.quote) {
      const randomQuote = quotes.getRandom();
      actions.startTest(randomQuote);
      actions.pauseTest(); // Set up but don't start timer
    }
  }, []);

  const currentQuote = state.quote || quotes.getRandom();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Typing Speed Test</h2>
            <p className="text-gray-600">
              Start typing the quote below to begin the test automatically
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <QuoteDisplay
                quote={currentQuote.text}
                typedText={state.typedText}
                currentIndex={state.currentIndex}
                isActive={state.isActive}
              />
              
              <TypingInput
                value={state.typedText}
                onChange={handleInputChange}
                disabled={state.isCompleted}
                autoFocus={true}
                placeholder={state.isActive ? "Keep typing..." : "Start typing to begin the test automatically"}
              />
            </div>

            <div className="space-y-6">
              {state.isCompleted && state.startTime && state.endTime && (
                <Timer
                  timeRemaining={0}
                  isActive={false}
                  totalTime={settings.preferredDuration}
                  isCompleted={true}
                  elapsedTime={(state.endTime - state.startTime) / 1000}
                />
              )}

              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Live Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Characters:</span>
                    <span className="font-medium">{state.typedText.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Words:</span>
                    <span className="font-medium">
                      {state.typedText.trim().split(/\s+/).filter(word => word.length > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Errors:</span>
                    <span className={`font-medium ${state.errors > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {state.errors}
                    </span>
                  </div>
                  {state.isActive && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Progress:</span>
                      <span className="font-medium">
                        {Math.round((state.typedText.length / currentQuote.text.length) * 100)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {!state.isActive && !state.isCompleted && state.typedText.length === 0 && (
                  <button
                    onClick={startNewTest}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    New Quote
                  </button>
                )}
                
                {state.isActive && (
                  <div className="space-y-2">
                    <button
                      onClick={actions.pauseTest}
                      className="w-full bg-yellow-600 text-white px-4 py-3 rounded-md hover:bg-yellow-700 transition-colors font-medium"
                    >
                      Pause Test
                    </button>
                    <button
                      onClick={actions.resetTest}
                      className="w-full bg-gray-600 text-white px-4 py-3 rounded-md hover:bg-gray-700 transition-colors font-medium"
                    >
                      Reset Test
                    </button>
                  </div>
                )}

                {!state.isActive && state.startTime && state.typedText.length > 0 && (
                  <button
                    onClick={actions.resumeTest}
                    className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Resume Test
                  </button>
                )}

                {state.isCompleted && (
                  <button
                    onClick={startNewTest}
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Try Another Quote
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Tips for better typing:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Keep your fingers on the home row (ASDF JKL;)</li>
                  <li>• Look at the screen, not your keyboard</li>
                  <li>• Focus on accuracy first, speed will follow</li>
                  <li>• Take breaks to avoid fatigue</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ResultsModal
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        results={testResult}
        onNewTest={startNewTest}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};