/**
 * Custom hook for exam data persistence
 * Handles save/load functionality, session validation, and cleanup
 */

import { useState, useCallback, useEffect } from 'react';
import {
  ExamSession,
  ExamResults,
  Question,
  serializeExamSession,
  deserializeExamSession,
  serializeExamResults,
  deserializeExamResults,
  validateSessionIntegrity,
  SerializableExamSession,
  SerializableExamResults
} from '@/lib/exam';

export interface SavedSession {
  id: string;
  userId: string;
  examType: string;
  startTime: Date;
  lastSaved: Date;
  isCompleted: boolean;
  questionsCount: number;
  answeredCount: number;
}

export interface PersistenceActions {
  // Session management
  saveSession: (session: ExamSession, questions: Question[]) => Promise<boolean>;
  loadSession: (sessionId: string) => Promise<{ session: ExamSession; questions: Question[] } | null>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  
  // Results management
  saveResults: (results: ExamResults) => Promise<boolean>;
  loadResults: (sessionId: string) => Promise<ExamResults | null>;
  
  // Session discovery
  listSavedSessions: () => Promise<SavedSession[]>;
  findSessionsByUser: (userId: string) => Promise<SavedSession[]>;
  
  // Cleanup operations
  cleanupExpiredSessions: (maxAgeHours?: number) => Promise<number>;
  cleanupCompletedSessions: (keepRecentHours?: number) => Promise<number>;
  
  // Validation and integrity
  validateStoredSession: (sessionId: string) => Promise<boolean>;
  repairSession: (sessionId: string) => Promise<boolean>;
  
  // Bulk operations
  exportSessionData: (sessionId: string) => Promise<string | null>;
  importSessionData: (data: string) => Promise<boolean>;
}

export interface PersistenceData {
  // Status
  isLoading: boolean;
  lastError: string | null;
  
  // Statistics
  totalSessions: number;
  activeSessions: number;
  completedSessions: number;
  
  // Storage info
  storageUsed: number; // in bytes
  storageAvailable: boolean;
}

export interface UsePersistenceOptions {
  autoCleanup?: boolean;
  maxSessionAge?: number; // hours
  compressionEnabled?: boolean;
  encryptionEnabled?: boolean;
}

export interface UseExamPersistenceReturn {
  data: PersistenceData;
  actions: PersistenceActions;
}

const STORAGE_KEYS = {
  SESSION_PREFIX: 'exam_session_',
  QUESTIONS_PREFIX: 'exam_questions_',
  RESULTS_PREFIX: 'exam_results_',
  METADATA_PREFIX: 'exam_meta_',
  INDEX: 'exam_sessions_index'
} as const;

const DEFAULT_MAX_AGE_HOURS = 24 * 7; // 7 days
const DEFAULT_KEEP_COMPLETED_HOURS = 24; // 1 day

export function useExamPersistence(options: UsePersistenceOptions = {}): UseExamPersistenceReturn {
  const {
    autoCleanup = true,
    maxSessionAge = DEFAULT_MAX_AGE_HOURS,
    compressionEnabled = false,
    encryptionEnabled = false
  } = options;

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [storageStats, setStorageStats] = useState({
    totalSessions: 0,
    activeSessions: 0,
    completedSessions: 0,
    storageUsed: 0
  });

  // Utility functions
  const clearError = useCallback(() => setLastError(null), []);
  
  const handleError = useCallback((error: unknown, operation: string) => {
    const message = error instanceof Error ? error.message : 'Unknown error';
    setLastError(`${operation}: ${message}`);
    console.error(`Persistence error in ${operation}:`, error);
  }, []);

  const getStorageKey = useCallback((type: keyof typeof STORAGE_KEYS, id: string) => {
    return STORAGE_KEYS[type] + id;
  }, []);

  const isStorageAvailable = useCallback((): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }, []);

  const calculateStorageUsage = useCallback((): number => {
    let totalSize = 0;
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('exam_')) {
          const value = localStorage.getItem(key);
          if (value) {
            totalSize += key.length + value.length;
          }
        }
      }
    } catch (error) {
      console.error('Failed to calculate storage usage:', error);
    }
    
    return totalSize;
  }, []);

  const updateStorageStats = useCallback(async () => {
    try {
      const sessions = await listSavedSessions();
      const activeSessions = sessions.filter(s => !s.isCompleted).length;
      const completedSessions = sessions.filter(s => s.isCompleted).length;
      const storageUsed = calculateStorageUsage();

      setStorageStats({
        totalSessions: sessions.length,
        activeSessions,
        completedSessions,
        storageUsed
      });
    } catch (error) {
      handleError(error, 'updateStorageStats');
    }
  }, [calculateStorageUsage, handleError]);

  // Session index management
  const getSessionIndex = useCallback((): string[] => {
    try {
      const index = localStorage.getItem(STORAGE_KEYS.INDEX);
      return index ? JSON.parse(index) : [];
    } catch {
      return [];
    }
  }, []);

  const updateSessionIndex = useCallback((sessionId: string, remove = false) => {
    try {
      const index = getSessionIndex();
      
      if (remove) {
        const filtered = index.filter(id => id !== sessionId);
        localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(filtered));
      } else {
        if (!index.includes(sessionId)) {
          index.push(sessionId);
          localStorage.setItem(STORAGE_KEYS.INDEX, JSON.stringify(index));
        }
      }
    } catch (error) {
      handleError(error, 'updateSessionIndex');
    }
  }, [getSessionIndex, handleError]);

  // Core persistence actions
  const saveSession = useCallback(async (session: ExamSession, questions: Question[]): Promise<boolean> => {
    if (!isStorageAvailable()) {
      setLastError('Local storage is not available');
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      // Validate session integrity
      if (!validateSessionIntegrity(session)) {
        throw new Error('Session failed integrity validation');
      }

      // Serialize session data
      const serializedSession = serializeExamSession(session);
      
      // Create metadata
      const metadata = {
        id: session.id,
        userId: session.userId,
        examType: session.examConfig.examType,
        startTime: session.startTime.toISOString(),
        lastSaved: new Date().toISOString(),
        isCompleted: session.status === 'completed',
        questionsCount: questions.length,
        answeredCount: session.answers.size
      };

      // Save to localStorage
      const sessionKey = getStorageKey('SESSION_PREFIX', session.id);
      const questionsKey = getStorageKey('QUESTIONS_PREFIX', session.id);
      const metadataKey = getStorageKey('METADATA_PREFIX', session.id);

      localStorage.setItem(sessionKey, JSON.stringify(serializedSession));
      localStorage.setItem(questionsKey, JSON.stringify(questions));
      localStorage.setItem(metadataKey, JSON.stringify(metadata));

      // Update session index
      updateSessionIndex(session.id);
      
      await updateStorageStats();
      return true;
    } catch (error) {
      handleError(error, 'saveSession');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isStorageAvailable, clearError, getStorageKey, updateSessionIndex, updateStorageStats, handleError]);

  const loadSession = useCallback(async (sessionId: string): Promise<{ session: ExamSession; questions: Question[] } | null> => {
    if (!isStorageAvailable()) {
      setLastError('Local storage is not available');
      return null;
    }

    setIsLoading(true);
    clearError();

    try {
      const sessionKey = getStorageKey('SESSION_PREFIX', sessionId);
      const questionsKey = getStorageKey('QUESTIONS_PREFIX', sessionId);

      const sessionData = localStorage.getItem(sessionKey);
      const questionsData = localStorage.getItem(questionsKey);

      if (!sessionData || !questionsData) {
        throw new Error('Session or questions data not found');
      }

      const serializedSession: SerializableExamSession = JSON.parse(sessionData);
      const questions: Question[] = JSON.parse(questionsData);

      const session = deserializeExamSession(serializedSession);

      // Validate restored session
      if (!validateSessionIntegrity(session)) {
        throw new Error('Restored session failed integrity validation');
      }

      return { session, questions };
    } catch (error) {
      handleError(error, 'loadSession');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isStorageAvailable, clearError, getStorageKey, handleError]);

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    setIsLoading(true);
    clearError();

    try {
      const sessionKey = getStorageKey('SESSION_PREFIX', sessionId);
      const questionsKey = getStorageKey('QUESTIONS_PREFIX', sessionId);
      const metadataKey = getStorageKey('METADATA_PREFIX', sessionId);
      const resultsKey = getStorageKey('RESULTS_PREFIX', sessionId);

      // Remove all related data
      localStorage.removeItem(sessionKey);
      localStorage.removeItem(questionsKey);
      localStorage.removeItem(metadataKey);
      localStorage.removeItem(resultsKey);

      // Update session index
      updateSessionIndex(sessionId, true);
      
      await updateStorageStats();
      return true;
    } catch (error) {
      handleError(error, 'deleteSession');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, getStorageKey, updateSessionIndex, updateStorageStats, handleError]);

  const saveResults = useCallback(async (results: ExamResults): Promise<boolean> => {
    if (!isStorageAvailable()) {
      setLastError('Local storage is not available');
      return false;
    }

    setIsLoading(true);
    clearError();

    try {
      const serializedResults = serializeExamResults(results);
      const resultsKey = getStorageKey('RESULTS_PREFIX', results.sessionId);
      
      localStorage.setItem(resultsKey, JSON.stringify(serializedResults));
      return true;
    } catch (error) {
      handleError(error, 'saveResults');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isStorageAvailable, clearError, getStorageKey, handleError]);

  const loadResults = useCallback(async (sessionId: string): Promise<ExamResults | null> => {
    if (!isStorageAvailable()) {
      setLastError('Local storage is not available');
      return null;
    }

    setIsLoading(true);
    clearError();

    try {
      const resultsKey = getStorageKey('RESULTS_PREFIX', sessionId);
      const resultsData = localStorage.getItem(resultsKey);

      if (!resultsData) {
        return null;
      }

      const serializedResults: SerializableExamResults = JSON.parse(resultsData);
      return deserializeExamResults(serializedResults);
    } catch (error) {
      handleError(error, 'loadResults');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isStorageAvailable, clearError, getStorageKey, handleError]);

  const listSavedSessions = useCallback(async (): Promise<SavedSession[]> => {
    setIsLoading(true);
    clearError();

    try {
      const sessionIds = getSessionIndex();
      const sessions: SavedSession[] = [];

      for (const sessionId of sessionIds) {
        try {
          const metadataKey = getStorageKey('METADATA_PREFIX', sessionId);
          const metadataData = localStorage.getItem(metadataKey);
          
          if (metadataData) {
            const metadata = JSON.parse(metadataData);
            sessions.push({
              ...metadata,
              startTime: new Date(metadata.startTime),
              lastSaved: new Date(metadata.lastSaved)
            });
          }
        } catch (error) {
          console.warn(`Failed to load metadata for session ${sessionId}:`, error);
        }
      }

      return sessions.sort((a, b) => b.lastSaved.getTime() - a.lastSaved.getTime());
    } catch (error) {
      handleError(error, 'listSavedSessions');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [clearError, getSessionIndex, getStorageKey, handleError]);

  const findSessionsByUser = useCallback(async (userId: string): Promise<SavedSession[]> => {
    const allSessions = await listSavedSessions();
    return allSessions.filter(session => session.userId === userId);
  }, [listSavedSessions]);

  const cleanupExpiredSessions = useCallback(async (maxAgeHours = maxSessionAge): Promise<number> => {
    setIsLoading(true);
    clearError();

    try {
      const sessions = await listSavedSessions();
      const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
      let cleanedCount = 0;

      for (const session of sessions) {
        if (session.lastSaved < cutoffTime && !session.isCompleted) {
          await deleteSession(session.id);
          cleanedCount++;
        }
      }

      await updateStorageStats();
      return cleanedCount;
    } catch (error) {
      handleError(error, 'cleanupExpiredSessions');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [maxSessionAge, clearError, listSavedSessions, deleteSession, updateStorageStats, handleError]);

  const cleanupCompletedSessions = useCallback(async (keepRecentHours = DEFAULT_KEEP_COMPLETED_HOURS): Promise<number> => {
    setIsLoading(true);
    clearError();

    try {
      const sessions = await listSavedSessions();
      const cutoffTime = new Date(Date.now() - keepRecentHours * 60 * 60 * 1000);
      let cleanedCount = 0;

      for (const session of sessions) {
        if (session.isCompleted && session.lastSaved < cutoffTime) {
          await deleteSession(session.id);
          cleanedCount++;
        }
      }

      await updateStorageStats();
      return cleanedCount;
    } catch (error) {
      handleError(error, 'cleanupCompletedSessions');
      return 0;
    } finally {
      setIsLoading(false);
    }
  }, [clearError, listSavedSessions, deleteSession, updateStorageStats, handleError]);

  const validateStoredSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      const data = await loadSession(sessionId);
      return data !== null;
    } catch {
      return false;
    }
  }, [loadSession]);

  const repairSession = useCallback(async (sessionId: string): Promise<boolean> => {
    // This is a placeholder for session repair logic
    // In a real implementation, this might attempt to fix corrupted data
    try {
      const isValid = await validateStoredSession(sessionId);
      if (!isValid) {
        await deleteSession(sessionId);
      }
      return isValid;
    } catch (error) {
      handleError(error, 'repairSession');
      return false;
    }
  }, [validateStoredSession, deleteSession, handleError]);

  const exportSessionData = useCallback(async (sessionId: string): Promise<string | null> => {
    try {
      const sessionData = await loadSession(sessionId);
      const resultsData = await loadResults(sessionId);
      
      if (!sessionData) return null;

      const exportData = {
        session: sessionData.session,
        questions: sessionData.questions,
        results: resultsData,
        exportedAt: new Date().toISOString()
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      handleError(error, 'exportSessionData');
      return null;
    }
  }, [loadSession, loadResults, handleError]);

  const importSessionData = useCallback(async (data: string): Promise<boolean> => {
    try {
      const importData = JSON.parse(data);
      
      if (!importData.session || !importData.questions) {
        throw new Error('Invalid import data format');
      }

      const success = await saveSession(importData.session, importData.questions);
      
      if (success && importData.results) {
        await saveResults(importData.results);
      }

      return success;
    } catch (error) {
      handleError(error, 'importSessionData');
      return false;
    }
  }, [saveSession, saveResults, handleError]);

  // Effects
  useEffect(() => {
    updateStorageStats();
  }, [updateStorageStats]);

  useEffect(() => {
    if (autoCleanup) {
      // Run cleanup on mount
      cleanupExpiredSessions();
    }
  }, [autoCleanup, cleanupExpiredSessions]);

  const data: PersistenceData = {
    isLoading,
    lastError,
    totalSessions: storageStats.totalSessions,
    activeSessions: storageStats.activeSessions,
    completedSessions: storageStats.completedSessions,
    storageUsed: storageStats.storageUsed,
    storageAvailable: isStorageAvailable()
  };

  const actions: PersistenceActions = {
    saveSession,
    loadSession,
    deleteSession,
    saveResults,
    loadResults,
    listSavedSessions,
    findSessionsByUser,
    cleanupExpiredSessions,
    cleanupCompletedSessions,
    validateStoredSession,
    repairSession,
    exportSessionData,
    importSessionData
  };

  return { data, actions };
}