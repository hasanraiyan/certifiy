/**
 * Custom hook for managing exam session state
 * Handles current question, answers, bookmarks, and exam status
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  ExamSession,
  ExamConfig,
  Answer,
  Question,
  ExamStatus,
  generateSessionId,
  validateSessionIntegrity,
  serializeExamSession,
  deserializeExamSession,
  SerializableExamSession
} from '@/lib/exam';

export interface ExamStateActions {
  // Navigation actions
  goToQuestion: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  
  // Answer actions
  saveAnswer: (questionId: string, selectedOptions: number[], timeSpent: number) => void;
  clearAnswer: (questionIndex: number) => void;
  
  // Bookmark actions
  toggleBookmark: (questionIndex: number) => void;
  clearAllBookmarks: () => void;
  
  // Session actions
  startExam: (config: ExamConfig, questions: Question[]) => void;
  pauseExam: () => void;
  resumeExam: () => void;
  completeExam: () => void;
  abandonExam: () => void;
  resetExam: () => void;
  
  // Persistence actions
  saveProgress: () => void;
  loadProgress: (sessionId: string) => boolean;
}

export interface ExamStateData {
  // Session data
  session: ExamSession | null;
  questions: Question[];
  
  // Current state
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  
  // Progress tracking
  totalQuestions: number;
  answeredQuestions: number;
  bookmarkedQuestions: number[];
  
  // Status flags
  isExamActive: boolean;
  isExamCompleted: boolean;
  isExamPaused: boolean;
  
  // Validation
  hasUnansweredQuestions: boolean;
  canSubmitExam: boolean;
}

export interface UseExamStateReturn {
  data: ExamStateData;
  actions: ExamStateActions;
}

const STORAGE_KEY_PREFIX = 'exam_session_';

export function useExamState(): UseExamStateReturn {
  // Core state
  const [session, setSession] = useState<ExamSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Refs for tracking
  const questionStartTimeRef = useRef<Date | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived state
  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;
  const answeredQuestions = session ? session.answers.size : 0;
  const bookmarkedQuestions = session ? Array.from(session.bookmarkedQuestions) : [];
  
  const isExamActive = session?.status === 'in-progress';
  const isExamCompleted = session?.status === 'completed';
  const isExamPaused = session?.status === 'setup';
  
  const hasUnansweredQuestions = answeredQuestions < totalQuestions;
  const canSubmitExam = !hasUnansweredQuestions || session?.examConfig.type === 'practice';

  // Auto-save functionality
  const setupAutoSave = useCallback(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
    }
    
    if (session && isExamActive) {
      autoSaveIntervalRef.current = setInterval(() => {
        saveProgress();
      }, 30000); // Auto-save every 30 seconds
    }
  }, [session, isExamActive]);

  // Navigation actions
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions && session) {
      // Save time spent on current question
      if (questionStartTimeRef.current && currentQuestion) {
        const timeSpent = Math.floor((Date.now() - questionStartTimeRef.current.getTime()) / 1000);
        const existingAnswer = session.answers.get(currentQuestionIndex);
        
        if (existingAnswer) {
          existingAnswer.timeSpent += timeSpent;
        }
      }
      
      setCurrentQuestionIndex(index);
      setSession(prev => prev ? { ...prev, currentQuestionIndex: index } : null);
      questionStartTimeRef.current = new Date();
    }
  }, [totalQuestions, session, currentQuestionIndex, currentQuestion]);

  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      goToQuestion(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, totalQuestions, goToQuestion]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      goToQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, goToQuestion]);

  // Answer actions
  const saveAnswer = useCallback((questionId: string, selectedOptions: number[], timeSpent: number) => {
    if (!session || !currentQuestion || currentQuestion.id !== questionId) return;

    const answer: Answer = {
      questionId,
      selectedOptions,
      timestamp: new Date(),
      timeSpent
    };

    setSession(prev => {
      if (!prev) return null;
      
      const newAnswers = new Map(prev.answers);
      newAnswers.set(currentQuestionIndex, answer);
      
      return {
        ...prev,
        answers: newAnswers
      };
    });
  }, [session, currentQuestion, currentQuestionIndex]);

  const clearAnswer = useCallback((questionIndex: number) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return null;
      
      const newAnswers = new Map(prev.answers);
      newAnswers.delete(questionIndex);
      
      return {
        ...prev,
        answers: newAnswers
      };
    });
  }, [session]);

  // Bookmark actions
  const toggleBookmark = useCallback((questionIndex: number) => {
    if (!session || questionIndex < 0 || questionIndex >= totalQuestions) return;

    setSession(prev => {
      if (!prev) return null;
      
      const newBookmarks = new Set(prev.bookmarkedQuestions);
      
      if (newBookmarks.has(questionIndex)) {
        newBookmarks.delete(questionIndex);
      } else {
        newBookmarks.add(questionIndex);
      }
      
      return {
        ...prev,
        bookmarkedQuestions: newBookmarks
      };
    });
  }, [session, totalQuestions]);

  const clearAllBookmarks = useCallback(() => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        bookmarkedQuestions: new Set()
      };
    });
  }, [session]);

  // Session actions
  const startExam = useCallback((config: ExamConfig, examQuestions: Question[]) => {
    const newSession: ExamSession = {
      id: generateSessionId(),
      userId: 'current-user', // TODO: Get from auth context
      examConfig: config,
      startTime: new Date(),
      currentQuestionIndex: 0,
      answers: new Map(),
      bookmarkedQuestions: new Set(),
      status: 'in-progress'
    };

    setSession(newSession);
    setQuestions(examQuestions);
    setCurrentQuestionIndex(0);
    questionStartTimeRef.current = new Date();
    
    // Save initial session
    const storageKey = STORAGE_KEY_PREFIX + newSession.id;
    localStorage.setItem(storageKey, JSON.stringify(serializeExamSession(newSession)));
  }, []);

  const pauseExam = useCallback(() => {
    if (!session || !isExamActive) return;

    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: 'setup' as ExamStatus
      };
    });
  }, [session, isExamActive]);

  const resumeExam = useCallback(() => {
    if (!session || session.status !== 'setup') return;

    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: 'in-progress' as ExamStatus
      };
    });
    
    questionStartTimeRef.current = new Date();
  }, [session]);

  const completeExam = useCallback(() => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: 'completed' as ExamStatus,
        endTime: new Date()
      };
    });
    
    // Clear auto-save interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  }, [session]);

  const abandonExam = useCallback(() => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        status: 'abandoned' as ExamStatus,
        endTime: new Date()
      };
    });
    
    // Clear auto-save interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  }, [session]);

  const resetExam = useCallback(() => {
    setSession(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    questionStartTimeRef.current = null;
    
    // Clear auto-save interval
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  }, []);

  // Persistence actions
  const saveProgress = useCallback(() => {
    if (!session) return;

    try {
      // Validate session integrity before saving
      if (!validateSessionIntegrity(session)) {
        console.error('Session integrity check failed, not saving');
        return;
      }

      const storageKey = STORAGE_KEY_PREFIX + session.id;
      const serializedSession = serializeExamSession(session);
      localStorage.setItem(storageKey, JSON.stringify(serializedSession));
      
      // Also save questions separately
      localStorage.setItem(storageKey + '_questions', JSON.stringify(questions));
    } catch (error) {
      console.error('Failed to save exam progress:', error);
    }
  }, [session, questions]);

  const loadProgress = useCallback((sessionId: string): boolean => {
    try {
      const storageKey = STORAGE_KEY_PREFIX + sessionId;
      const sessionData = localStorage.getItem(storageKey);
      const questionsData = localStorage.getItem(storageKey + '_questions');
      
      if (!sessionData || !questionsData) {
        return false;
      }

      const serializedSession: SerializableExamSession = JSON.parse(sessionData);
      const savedQuestions: Question[] = JSON.parse(questionsData);
      
      const restoredSession = deserializeExamSession(serializedSession);
      
      // Validate restored session
      if (!validateSessionIntegrity(restoredSession)) {
        console.error('Restored session failed integrity check');
        return false;
      }

      setSession(restoredSession);
      setQuestions(savedQuestions);
      setCurrentQuestionIndex(restoredSession.currentQuestionIndex);
      questionStartTimeRef.current = new Date();
      
      return true;
    } catch (error) {
      console.error('Failed to load exam progress:', error);
      return false;
    }
  }, []);

  // Effects
  useEffect(() => {
    setupAutoSave();
    
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, [setupAutoSave]);

  // Auto-save when session changes
  useEffect(() => {
    if (session && isExamActive) {
      saveProgress();
    }
  }, [session, isExamActive, saveProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveIntervalRef.current) {
        clearInterval(autoSaveIntervalRef.current);
      }
    };
  }, []);

  const data: ExamStateData = {
    session,
    questions,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answeredQuestions,
    bookmarkedQuestions,
    isExamActive,
    isExamCompleted,
    isExamPaused,
    hasUnansweredQuestions,
    canSubmitExam
  };

  const actions: ExamStateActions = {
    goToQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    saveAnswer,
    clearAnswer,
    toggleBookmark,
    clearAllBookmarks,
    startExam,
    pauseExam,
    resumeExam,
    completeExam,
    abandonExam,
    resetExam,
    saveProgress,
    loadProgress
  };

  return { data, actions };
}