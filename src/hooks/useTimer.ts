/**
 * Custom hook for exam timer management
 * Handles countdown timer with warnings and automatic submission
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { formatTime } from '@/lib/exam';

export interface TimerWarning {
  type: 'warning' | 'critical';
  message: string;
  timeRemaining: number;
}

export interface TimerActions {
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  addTime: (seconds: number) => void;
  setTimeLimit: (seconds: number) => void;
}

export interface TimerData {
  // Time values
  timeRemaining: number;
  timeElapsed: number;
  totalTime: number;

  // Formatted time strings
  timeRemainingFormatted: string;
  timeElapsedFormatted: string;
  totalTimeFormatted: string;

  // Status flags
  isRunning: boolean;
  isPaused: boolean;
  isExpired: boolean;

  // Progress
  progressPercentage: number;

  // Warnings
  currentWarning: TimerWarning | null;
  hasWarnings: boolean;
}

export interface UseTimerOptions {
  initialTimeLimit?: number; // in seconds
  warningThresholds?: number[]; // warning times in seconds [600, 300] = 10min, 5min
  onTimeExpired?: () => void;
  onWarning?: (warning: TimerWarning) => void;
  autoStart?: boolean;
  persistKey?: string; // localStorage key for persistence
}

export interface UseTimerReturn {
  data: TimerData;
  actions: TimerActions;
}

const DEFAULT_WARNING_THRESHOLDS = [600, 300]; // 10 minutes, 5 minutes

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const {
    initialTimeLimit = 0,
    warningThresholds = DEFAULT_WARNING_THRESHOLDS,
    onTimeExpired,
    onWarning,
    autoStart = false,
    persistKey
  } = options;

  // Core state
  const [timeLimit, setTimeLimitState] = useState(initialTimeLimit);
  const [timeRemaining, setTimeRemaining] = useState(initialTimeLimit);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0); // Total time spent paused

  // Refs for tracking
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningsTriggeredRef = useRef<Set<number>>(new Set());
  const lastUpdateRef = useRef<Date | null>(null);

  // Derived state
  const timeElapsed = timeLimit - timeRemaining;
  const isExpired = timeRemaining <= 0 && timeLimit > 0;
  const progressPercentage = timeLimit > 0 ? Math.max(0, Math.min(100, (timeElapsed / timeLimit) * 100)) : 0;

  // Format time strings
  const timeRemainingFormatted = formatTime(Math.max(0, timeRemaining));
  const timeElapsedFormatted = formatTime(timeElapsed);
  const totalTimeFormatted = formatTime(timeLimit);

  // Warning logic
  const getCurrentWarning = useCallback((): TimerWarning | null => {
    if (!isRunning || timeRemaining <= 0) return null;

    for (const threshold of warningThresholds.sort((a, b) => a - b)) {
      if (timeRemaining <= threshold && !warningsTriggeredRef.current.has(threshold)) {
        const warning: TimerWarning = {
          type: threshold <= 300 ? 'critical' : 'warning', // 5 minutes or less is critical
          message: `${formatTime(threshold)} remaining`,
          timeRemaining: threshold
        };

        warningsTriggeredRef.current.add(threshold);
        return warning;
      }
    }

    return null;
  }, [isRunning, timeRemaining, warningThresholds]);

  const currentWarning = getCurrentWarning();
  const hasWarnings = warningThresholds.some(threshold => timeRemaining <= threshold);

  // Persistence functions
  const saveTimerState = useCallback(() => {
    if (!persistKey) return;

    const state = {
      timeLimit,
      timeRemaining,
      isRunning,
      isPaused,
      startTime: startTime?.toISOString(),
      pausedTime,
      warningsTriggered: Array.from(warningsTriggeredRef.current)
    };

    try {
      localStorage.setItem(`timer_${persistKey}`, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  }, [persistKey, timeLimit, timeRemaining, isRunning, isPaused, startTime, pausedTime]);

  const loadTimerState = useCallback(() => {
    if (!persistKey) return false;

    try {
      const saved = localStorage.getItem(`timer_${persistKey}`);
      if (!saved) return false;

      const state = JSON.parse(saved);

      setTimeLimitState(state.timeLimit || 0);
      setTimeRemaining(state.timeRemaining || 0);
      setIsRunning(state.isRunning || false);
      setIsPaused(state.isPaused || false);
      setStartTime(state.startTime ? new Date(state.startTime) : null);
      setPausedTime(state.pausedTime || 0);
      warningsTriggeredRef.current = new Set(state.warningsTriggered || []);

      return true;
    } catch (error) {
      console.error('Failed to load timer state:', error);
      return false;
    }
  }, [persistKey]);

  // Timer tick function
  const tick = useCallback(() => {
    const now = new Date();

    if (lastUpdateRef.current) {
      const deltaSeconds = Math.floor((now.getTime() - lastUpdateRef.current.getTime()) / 1000);

      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - deltaSeconds);

        // Check for expiration
        if (newTime <= 0 && prev > 0) {
          setIsRunning(false);
          if (onTimeExpired) {
            onTimeExpired();
          }
        }

        return newTime;
      });
    }

    lastUpdateRef.current = now;
  }, [onTimeExpired]);

  // Timer actions
  const start = useCallback(() => {
    if (timeLimit <= 0) return;

    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
    lastUpdateRef.current = new Date();
    warningsTriggeredRef.current.clear();
  }, [timeLimit]);

  const pause = useCallback(() => {
    if (!isRunning) return;

    setIsRunning(false);
    setIsPaused(true);
    lastUpdateRef.current = null;
  }, [isRunning]);

  const resume = useCallback(() => {
    if (!isPaused) return;

    setIsRunning(true);
    setIsPaused(false);
    lastUpdateRef.current = new Date();
  }, [isPaused]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(timeLimit);
    setStartTime(null);
    setPausedTime(0);
    lastUpdateRef.current = null;
    warningsTriggeredRef.current.clear();
  }, [timeLimit]);

  const addTime = useCallback((seconds: number) => {
    setTimeRemaining(prev => Math.max(0, prev + seconds));
    setTimeLimitState(prev => prev + seconds);
  }, []);

  const setTimeLimit = useCallback((seconds: number) => {
    const newLimit = Math.max(0, seconds);
    setTimeLimitState(newLimit);
    setTimeRemaining(newLimit);

    // Reset warnings when time limit changes
    warningsTriggeredRef.current.clear();
  }, []);

  // Effects

  // Load persisted state on mount
  useEffect(() => {
    if (persistKey) {
      const loaded = loadTimerState();
      if (loaded && autoStart && !isExpired) {
        // Resume timer if it was running
        if (isRunning && !isPaused) {
          lastUpdateRef.current = new Date();
        }
      }
    }
  }, [persistKey, loadTimerState, autoStart, isExpired, isRunning, isPaused]);

  // Auto-start if enabled
  useEffect(() => {
    if (autoStart && timeLimit > 0 && !isRunning && !isPaused && !isExpired) {
      start();
    }
  }, [autoStart, timeLimit, isRunning, isPaused, isExpired, start]);

  // Timer interval management
  useEffect(() => {
    if (isRunning && !isExpired) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, isExpired, tick]);

  // Warning notifications
  useEffect(() => {
    if (currentWarning && onWarning) {
      onWarning(currentWarning);
    }
  }, [currentWarning, onWarning]);

  // Auto-save state changes
  useEffect(() => {
    if (persistKey) {
      saveTimerState();
    }
  }, [timeRemaining, isRunning, isPaused, saveTimerState, persistKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Handle browser visibility changes (pause when tab is hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        // Optionally pause when tab becomes hidden
        // This can be configurable based on exam requirements
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning]);

  // Handle page unload (save state)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (persistKey) {
        saveTimerState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [persistKey, saveTimerState]);

  const data: TimerData = {
    timeRemaining,
    timeElapsed,
    totalTime: timeLimit,
    timeRemainingFormatted,
    timeElapsedFormatted,
    totalTimeFormatted,
    isRunning,
    isPaused,
    isExpired,
    progressPercentage,
    currentWarning,
    hasWarnings
  };

  const actions: TimerActions = {
    start,
    pause,
    resume,
    reset,
    addTime,
    setTimeLimit
  };

  return { data, actions };
}