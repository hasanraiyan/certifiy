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
 * Validation error interface
 */
export interface ValidationError {
  message: string;
  field?: string;
}

/**
 * Validation functions
 */
export function validateExamSession(data: ExamSession): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.id) errors.push({ message: "Missing session ID", field: "id" });
  if (!data.userId) errors.push({ message: "Missing user ID", field: "userId" });
  if (!data.examConfig) errors.push({ message: "Missing exam configuration", field: "examConfig" });
  return errors;
}

export function validateQuestion(data: Question): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.id) errors.push({ message: "Missing question ID", field: "id" });
  if (!data.text) errors.push({ message: "Missing question text", field: "text" });
  if (!data.options || data.options.length === 0) errors.push({ message: "Missing answer options", field: "options" });
  return errors;
}

export function validateAnswer(data: Answer): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.questionId) errors.push({ message: "Missing question ID", field: "questionId" });
  if (!data.selectedOptions) errors.push({ message: "Missing selected options", field: "selectedOptions" });
  if (!data.timestamp) errors.push({ message: "Missing timestamp", field: "timestamp" });
  return errors;
}

export function validateExamConfig(data: ExamConfig): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!data.id) errors.push({ message: "Missing config ID", field: "id" });
  if (!data.type) errors.push({ message: "Missing exam type", field: "type" });
  if (!data.examType) errors.push({ message: "Missing exam mode", field: "examType" });
  if (!data.settings) errors.push({ message: "Missing exam settings", field: "settings" });
  return errors;
}

export function validateExamResults(data: QuestionResult[]): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!Array.isArray(data)) errors.push({ message: "Results must be an array", field: "results" });
  data.forEach((result, index) => {
    if (!result.questionId) errors.push({ message: `Missing question ID at index ${index}`, field: `results[${index}].questionId` });
    if (result.correct === undefined) errors.push({ message: `Missing correct flag at index ${index}`, field: `results[${index}].correct` });
  });
  return errors;
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