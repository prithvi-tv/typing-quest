export interface Quote {
  id: number;
  text: string;
  wordCount: number;
}

export interface TestResult {
  id: string;
  date: string;
  wpm: number;
  accuracy: number;
  duration: number;
  wordsTyped: number;
  charactersTyped: number;
  errors: number;
  quoteId: number;
}

export interface UserSettings {
  preferredDuration: number;
  lastTestDate: string;
}