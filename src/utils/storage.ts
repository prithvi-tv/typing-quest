import { TestResult, UserSettings } from '../types/index';

const RESULTS_KEY = 'typing_quest_results';
const SETTINGS_KEY = 'typing_quest_settings';

const DEFAULT_SETTINGS: UserSettings = {
  preferredDuration: 60,
  lastTestDate: '',
};

export const storage = {
  // Results operations
  getResults: (): TestResult[] => {
    try {
      const data = localStorage.getItem(RESULTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading results from localStorage:', error);
      return [];
    }
  },

  saveResult: (result: TestResult): void => {
    try {
      const results = storage.getResults();
      results.unshift(result);
      // Keep only last 100 results
      const trimmedResults = results.slice(0, 100);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(trimmedResults));
    } catch (error) {
      console.error('Error saving result to localStorage:', error);
    }
  },

  deleteResult: (id: string): void => {
    try {
      const results = storage.getResults();
      const filtered = results.filter(r => r.id !== id);
      localStorage.setItem(RESULTS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting result from localStorage:', error);
    }
  },

  clearAllResults: (): void => {
    try {
      localStorage.removeItem(RESULTS_KEY);
    } catch (error) {
      console.error('Error clearing results from localStorage:', error);
    }
  },

  // Settings operations
  getSettings: (): UserSettings => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch (error) {
      console.error('Error reading settings from localStorage:', error);
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings: (settings: UserSettings): void => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to localStorage:', error);
    }
  },

  updateSettings: (updates: Partial<UserSettings>): void => {
    try {
      const current = storage.getSettings();
      const updated = { ...current, ...updates };
      storage.saveSettings(updated);
    } catch (error) {
      console.error('Error updating settings in localStorage:', error);
    }
  },

  // Utility methods
  getLastResults: (count: number = 10): TestResult[] => {
    return storage.getResults().slice(0, count);
  },

  getResultStats: () => {
    const results = storage.getResults();
    if (results.length === 0) {
      return {
        totalTests: 0,
        averageWpm: 0,
        averageAccuracy: 0,
        bestWpm: 0,
      };
    }

    const totalTests = results.length;
    const averageWpm = results.reduce((sum, r) => sum + r.wpm, 0) / totalTests;
    const averageAccuracy = results.reduce((sum, r) => sum + r.accuracy, 0) / totalTests;
    const bestWpm = Math.max(...results.map(r => r.wpm));

    return {
      totalTests,
      averageWpm: Math.round(averageWpm),
      averageAccuracy: Math.round(averageAccuracy * 100) / 100,
      bestWpm,
    };
  },
};