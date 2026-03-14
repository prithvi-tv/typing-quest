import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types/index';
import { storage } from '../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsChange,
}) => {
  const [settings, setSettings] = useState<UserSettings>({
    preferredDuration: 60,
    lastTestDate: '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentSettings = storage.getSettings();
      setSettings(currentSettings);
      setHasChanges(false);
    }
  }, [isOpen]);

  const handleDurationChange = (duration: number) => {
    setSettings(prev => ({
      ...prev,
      preferredDuration: duration,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    storage.saveSettings(settings);
    onSettingsChange?.(settings);
    setHasChanges(false);
    onClose();
  };

  const handleCancel = () => {
    const currentSettings = storage.getSettings();
    setSettings(currentSettings);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    const defaultSettings: UserSettings = {
      preferredDuration: 60,
      lastTestDate: '',
    };
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all test results? This action cannot be undone.')) {
      storage.clearAllResults();
      const resetSettings: UserSettings = {
        preferredDuration: 60,
        lastTestDate: '',
      };
      storage.saveSettings(resetSettings);
      setSettings(resetSettings);
      setHasChanges(false);
      alert('All data has been cleared successfully.');
    }
  };

  const durationOptions = [
    { value: 15, label: '15 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 120, label: '2 minutes' },
    { value: 300, label: '5 minutes' },
  ];

  const stats = storage.getResultStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Test Duration</h3>
              <div className="grid grid-cols-1 gap-2">
                {durationOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={option.value}
                      checked={settings.preferredDuration === option.value}
                      onChange={() => handleDurationChange(option.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalTests}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Total Tests</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.averageWpm}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Avg WPM</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.averageAccuracy}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Avg Accuracy</div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.bestWpm}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Best WPM</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Data Management</h3>
              <div className="space-y-3">
                <button
                  onClick={handleReset}
                  className="w-full px-4 py-2 text-left text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Reset Settings to Default
                </button>
                
                <button
                  onClick={clearAllData}
                  className="w-full px-4 py-2 text-left text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  Clear All Test Results
                </button>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Clearing all data will permanently delete your test history and cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Save Changes
            </button>
            
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};