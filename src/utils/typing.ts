export interface TypingStats {
  wpm: number;
  accuracy: number;
  errors: number;
  charactersTyped: number;
  wordsTyped: number;
}

export const calculateWPM = (
  charactersTyped: number,
  durationSeconds: number
): number => {
  if (durationSeconds === 0) return 0;
  const minutes = durationSeconds / 60;
  const words = charactersTyped / 5;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (
  correctCharacters: number,
  totalCharacters: number
): number => {
  if (totalCharacters === 0) return 100;
  return Math.round((correctCharacters / totalCharacters) * 10000) / 100;
};

export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const validateCharacter = (
  typedChar: string,
  expectedChar: string
): boolean => {
  return typedChar === expectedChar;
};

export const compareTexts = (
  typedText: string,
  expectedText: string
): {
  correctCharacters: number;
  errors: number;
  totalCharacters: number;
} => {
  let correctCharacters = 0;
  let errors = 0;

  const maxLength = Math.max(typedText.length, expectedText.length);

  for (let i = 0; i < maxLength; i++) {
    const typedChar = typedText[i] || '';
    const expectedChar = expectedText[i] || '';

    if (typedChar === expectedChar) {
      correctCharacters++;
    } else {
      errors++;
    }
  }

  return {
    correctCharacters,
    errors,
    totalCharacters: expectedText.length,
  };
};

export const calculateTypingStats = (
  typedText: string,
  expectedText: string,
  durationSeconds: number
): TypingStats => {
  const comparison = compareTexts(typedText, expectedText);
  const charactersTyped = typedText.length;
  const wordsTyped = countWords(typedText);

  const wpm = calculateWPM(charactersTyped, durationSeconds);
  const accuracy = calculateAccuracy(
    comparison.correctCharacters,
    comparison.totalCharacters
  );

  return {
    wpm,
    accuracy,
    errors: comparison.errors,
    charactersTyped,
    wordsTyped,
  };
};

export const getCharacterStatus = (
  typedChar: string,
  expectedChar: string,
  index: number,
  typedLength: number
): 'correct' | 'incorrect' | 'pending' | 'extra' => {
  if (index >= typedLength) {
    return 'pending';
  }

  if (index >= expectedChar.length) {
    return 'extra';
  }

  return typedChar === expectedChar ? 'correct' : 'incorrect';
};

export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const calculateGrossWPM = (
  charactersTyped: number,
  durationSeconds: number
): number => {
  if (durationSeconds === 0) return 0;
  const minutes = durationSeconds / 60;
  const words = charactersTyped / 5;
  return Math.round(words / minutes);
};

export const calculateNetWPM = (
  charactersTyped: number,
  errors: number,
  durationSeconds: number
): number => {
  if (durationSeconds === 0) return 0;
  const minutes = durationSeconds / 60;
  const words = charactersTyped / 5;
  const errorWords = errors / 5;
  const netWords = words - errorWords;
  return Math.max(0, Math.round(netWords / minutes));
};