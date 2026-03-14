import { useState, useEffect, useCallback, useRef } from 'react';
import { Quote, TestResult } from '../types/index';
import { calculateTypingStats, compareTexts } from '../utils/typing';
import { storage } from '../utils/storage';

export interface TypingTestState {
  quote: Quote | null;
  typedText: string;
  isActive: boolean;
  isCompleted: boolean;
  timeRemaining: number;
  startTime: number | null;
  endTime: number | null;
  errors: number;
  currentIndex: number;
}

export interface TypingTestActions {
  startTest: (quote: Quote, duration: number) => void;
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
  timeRemaining: 0,
  startTime: null,
  endTime: null,
  errors: 0,
  currentIndex: 0,
};

export const useTypingTest = () => {
  const [state, setState] = useState<TypingTestState>(initialState);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const testDurationRef = useRef<number>(60);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const completeTest = useCallback(() => {
    clearTimer();
    const endTime = Date.now();
    
    setState(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      endTime,
    }));
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    
    timerRef.current = setInterval(() => {
      setState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          return {
            ...prev,
            timeRemaining: 0,
            isActive: false,
            isCompleted: true,
            endTime: Date.now(),
          };
        }
        
        return {
          ...prev,
          timeRemaining: newTimeRemaining,
        };
      });
    }, 1000);
  }, [clearTimer]);

  const startTest = useCallback((quote: Quote, duration: number) => {
    testDurationRef.current = duration;
    const startTime = Date.now();
    
    setState({
      ...initialState,
      quote,
      isActive: true,
      timeRemaining: duration,
      startTime,
    });
    
    startTimer();
  }, [startTimer]);

  const resetTest = useCallback(() => {
    clearTimer();
    setState(initialState);
  }, [clearTimer]);

  const updateTypedText = useCallback((text: string) => {
    setState(prev => {
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
    clearTimer();
    setState(prev => ({
      ...prev,
      isActive: false,
    }));
  }, [clearTimer]);

  const resumeTest = useCallback(() => {
    setState(prev => {
      if (prev.isCompleted || prev.timeRemaining <= 0) return prev;
      
      const newState = {
        ...prev,
        isActive: true,
      };
      
      startTimer();
      return newState;
    });
  }, [startTimer]);

  const getTestResult = useCallback((): TypingTestResult | null => {
    if (!state.quote || !state.startTime) return null;

    const actualDuration = state.endTime 
      ? (state.endTime - state.startTime) / 1000
      : testDurationRef.current - state.timeRemaining;

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

  // Effect to handle test completion when time runs out
  useEffect(() => {
    if (state.timeRemaining === 0 && state.isActive) {
      completeTest();
    }
  }, [state.timeRemaining, state.isActive, completeTest]);

  // Effect to handle test completion when quote is fully typed
  useEffect(() => {
    if (state.isCompleted && state.isActive) {
      completeTest();
    }
  }, [state.isCompleted, state.isActive, completeTest]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

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