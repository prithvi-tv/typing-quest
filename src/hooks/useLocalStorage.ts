import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

export function useLocalStorageState<T>(key: string, initialValue: T) {
  const [value, setValue, removeValue] = useLocalStorage(key, initialValue);
  
  const updateValue = useCallback(
    (updates: Partial<T>) => {
      setValue(prev => ({ ...prev, ...updates }));
    },
    [setValue]
  );

  return {
    value,
    setValue,
    updateValue,
    removeValue,
  };
}

export function useLocalStorageArray<T>(key: string, initialValue: T[] = []) {
  const [array, setArray, removeArray] = useLocalStorage(key, initialValue);

  const addItem = useCallback(
    (item: T) => {
      setArray(prev => [...prev, item]);
    },
    [setArray]
  );

  const removeItem = useCallback(
    (predicate: (item: T) => boolean) => {
      setArray(prev => prev.filter(item => !predicate(item)));
    },
    [setArray]
  );

  const updateItem = useCallback(
    (predicate: (item: T) => boolean, updates: Partial<T>) => {
      setArray(prev =>
        prev.map(item =>
          predicate(item) ? { ...item, ...updates } : item
        )
      );
    },
    [setArray]
  );

  const clearArray = useCallback(() => {
    setArray([]);
  }, [setArray]);

  const prependItem = useCallback(
    (item: T) => {
      setArray(prev => [item, ...prev]);
    },
    [setArray]
  );

  const limitArray = useCallback(
    (maxLength: number) => {
      setArray(prev => prev.slice(0, maxLength));
    },
    [setArray]
  );

  return {
    array,
    setArray,
    addItem,
    prependItem,
    removeItem,
    updateItem,
    clearArray,
    limitArray,
    removeArray,
  };
}