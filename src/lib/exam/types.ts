/**
 * Core data types for the exam engine system
 */

export type ExamType = 'practice' | 'test';
export type ExamMode = 'full-mock' | 'domain-quiz' | 'knowledge-area';
export type QuestionType = 'multiple-choice' | 'multiple-select' | 'true-false';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExamStatus = 'setup' | 'in-progress' | 'review' | 'completed' | 'abandoned';

/**
 * Exam configuration interface
 */
export interface ExamConfig {
  id: string;
  type: ExamType;
  examType: ExamMode;
  timeLimit?: number; // in seconds
  settings: ExamSettings;
  domain?: string;
  knowledgeArea?: string;
}

/**
 * Exam settings interface
 */
export interface ExamSettings {
  showTimer: boolean;
  showProgress: boolean;
  allowReview: boolean;
  showExplanations: boolean;
  allowBookmarks: boolean;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
}

/**
 * Question interface
 */
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswer: number | number[]; // single or multiple correct answers
  explanation: string;
  domain: string;
  knowledgeArea: string;
  difficulty: Difficulty;
  imageUrl?: string;
}

/**
 * Answer interface
 */
export interface Answer {
  questionId: string;
  selectedOptions: number[];
  timestamp: Date;
  timeSpent: number; // in seconds
}

/**
 * Exam session interface
 */
export interface ExamSession {
  id: string;
  userId: string;
  examConfig: ExamConfig;
  startTime: Date;
  endTime?: Date;
  currentQuestionIndex: number;
  answers: Map<number, Answer>;
  bookmarkedQuestions: Set<number>;
  status: ExamStatus;
}

/**
 * Domain score interface
 */
export interface DomainScore {
  domain: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number; // percentage
}

/**
 * Question result interface
 */
export interface QuestionResult {
  questionId: string;
  correct: boolean;
  selectedAnswer: number[];
  correctAnswer: number[];
  timeSpent: number;
  domain: string;
}

/**
 * Exam results interface
 */
export interface ExamResults {
  sessionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number; // percentage
  passed: boolean;
  timeSpent: number;
  domainScores: Map<string, DomainScore>;
  questionResults: QuestionResult[];
}

/**
 * Serializable versions of interfaces for JSON storage
 */
export interface SerializableExamSession {
  id: string;
  userId: string;
  examConfig: ExamConfig;
  startTime: string;
  endTime?: string;
  currentQuestionIndex: number;
  answers: Array<[number, Answer]>;
  bookmarkedQuestions: number[];
  status: ExamStatus;
}

export interface SerializableExamResults {
  sessionId: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  timeSpent: number;
  domainScores: Array<[string, DomainScore]>;
  questionResults: QuestionResult[];
}