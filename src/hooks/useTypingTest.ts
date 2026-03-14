import { useState, useEffect, useCallback } from 'react';
import { Quote, TestResult } from '../types/index';
import { calculateTypingStats, compareTexts } from '../utils/typing';
import { storage } from '../utils/storage';

export interface TypingTestState {
  quote: Quote | null;
  typedText: string;
  isActive: boolean;
  isCompleted: boolean;
  startTime: number | null;
  endTime: number | null;
  errors: number;
  currentIndex: number;
}

export interface TypingTestActions {
  startTest: (quote: Quote) => void;
  resetTest: () => void;
  updateTypedText: (text: string) => void;
  pauseTest: () => void;
  resumeTest: () => void;
}

export interface TypingTestResult {
  wpm: number;
  accuracy: number;
  errors: number;
  charactersTyped: number;
  wordsTyped: number;
  duration: number;
}

const initialState: TypingTestState = {
  quote: null,
  typedText: '',
  isActive: false,
  isCompleted: false,
  startTime: null,
  endTime: null,
  errors: 0,
  currentIndex: 0,
};

export const useTypingTest = () => {
  const [state, setState] = useState<TypingTestState>(initialState);

  const completeTest = useCallback(() => {
    const endTime = Date.now();
    
    setState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      endTime,
    }));
  }, []);

  const startTest = useCallback((quote: Quote) => {
    setState({
      ...initialState,
      quote,
    });
  }, []);

  const resetTest = useCallback(() => {
    setState(initialState);
  }, []);

  const updateTypedText = useCallback((text: string) => {
    setState(prev => {
      if (!prev.quote) return prev;

      // Auto-start test when user begins typing
      if (!prev.isActive && !prev.isCompleted && text.length > 0) {
        const startTime = Date.now();
        const newState = {
          ...prev,
          typedText: text,
          isActive: true,
          startTime,
        };

        const comparison = compareTexts(text, prev.quote.text);
        const newErrors = comparison.errors;
        const currentIndex = text.length;

        return {
          ...newState,
          errors: newErrors,
          currentIndex,
        };
      }

      if (!prev.isActive || !prev.quote) return prev;

      const comparison = compareTexts(text, prev.quote.text);
      const newErrors = comparison.errors;
      const currentIndex = text.length;

      // Check if test is completed by reaching end of quote
      if (currentIndex >= prev.quote.text.length) {
        return {
          ...prev,
          typedText: text,
          errors: newErrors,
          currentIndex,
          isActive: false,
          isCompleted: true,
          endTime: Date.now(),
        };
      }

      return {
        ...prev,
        typedText: text,
        errors: newErrors,
        currentIndex,
      };
    });
  }, []);

  const pauseTest = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, []);

  const resumeTest = useCallback(() => {
    setState(prev => {
      if (prev.isCompleted) return prev;
      
      return {
        ...prev,
        isActive: true,
      };
    });
  }, []);

  const getTestResult = useCallback((): TypingTestResult | null => {
    if (!state.quote || !state.startTime) return null;

    const actualDuration = state.endTime 
      ? (state.endTime - state.startTime) / 1000
      : 0;

    const stats = calculateTypingStats(
      state.typedText,
      state.quote.text,
      actualDuration
    );

    return {
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      charactersTyped: stats.charactersTyped,
      wordsTyped: stats.wordsTyped,
      duration: actualDuration,
    };
  }, [state]);

  const saveTestResult = useCallback(() => {
    const result = getTestResult();
    if (!result || !state.quote) return null;

    const testResult: TestResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      wpm: result.wpm,
      accuracy: result.accuracy,
      duration: result.duration,
      wordsTyped: result.wordsTyped,
      charactersTyped: result.charactersTyped,
      errors: result.errors,
      quoteId: state.quote.id,
    };

    storage.saveResult(testResult);
    storage.updateSettings({ lastTestDate: testResult.date });
    
    return testResult;
  }, [getTestResult, state.quote]);

  // Effect to handle test completion when quote is fully typed
  useEffect(() => {
    if (state.isCompleted && state.isActive) {
      completeTest();
    }
  }, [state.isCompleted, state.isActive, completeTest]);

  const actions: TypingTestActions = {
    startTest,
    resetTest,
    updateTypedText,
    pauseTest,
    resumeTest,
  };

  return {
    state,
    actions,
    getTestResult,
    saveTestResult,
  };
};