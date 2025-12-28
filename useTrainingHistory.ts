import { useState, useEffect, useCallback } from 'react';

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  minePositions: number[];
  mineCount: number;
}

const STORAGE_KEY = 'mines_training_history';
const MAX_HISTORY_SIZE = 50;

export function useTrainingHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const entries: HistoryEntry[] = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setHistory(entries);
      }
    } catch (error) {
      console.error('Failed to load training history:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever history changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save training history:', error);
      }
    }
  }, [history, isLoaded]);

  const addEntry = useCallback((minePositions: number[], mineCount: number) => {
    const newEntry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      minePositions: [...minePositions].sort((a, b) => a - b),
      mineCount
    };

    setHistory(prev => {
      const updated = [newEntry, ...prev];
      // Keep only the last MAX_HISTORY_SIZE entries
      return updated.slice(0, MAX_HISTORY_SIZE);
    });

    return newEntry;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const getRecentPatterns = useCallback((count: number = 3): number[][] => {
    return history.slice(0, count).map(entry => entry.minePositions);
  }, [history]);

  // Calculate training level based on history size
  const trainingLevel = Math.min(Math.floor(history.length / 5), 10);
  const trainingProgress = Math.min((history.length / 50) * 100, 100);

  return {
    history,
    isLoaded,
    addEntry,
    clearHistory,
    getRecentPatterns,
    trainingLevel,
    trainingProgress,
    totalEntries: history.length
  };
}
