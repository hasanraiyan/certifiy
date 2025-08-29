/**
 * Exam engine core module
 * Exports all types, validation functions, and utilities
 */

// Export all types
export * from './types';

// Export validation functions
export * from './validation';

// Export utility functions
export * from './utils';

// Export scoring functions
export * from './scoring';

// Export exam scoring service
export * from './exam-scoring-service';

// Re-export commonly used items for convenience
export {
  validateExamConfig,
  validateExamSettings,
  validateQuestion,
  validateAnswer,
  validateExamSession,
  validateExamResultsStructure,
  ValidationError,
  validateAnswerForQuestionType,
  sanitizeAnswer,
  validateAnswerCompleteness
} from './validation';

export {
  serializeExamSession,
  deserializeExamSession,
  serializeExamResults,
  deserializeExamResults,
  generateSessionId,
  calculateScore,
  determinePassStatus,
  calculateDomainScores,
  validateAnswerForQuestion,
  isAnswerCorrect,
  formatTime,
  parseTimeToSeconds,
  shuffleArray,
  deepClone,
  sanitizeInput,
  validateSessionIntegrity,
  createDefaultExamSettings,
  mergeExamSettings,
  calculateQuestionScore,
  calculatePartialCredit,
  validateAndScoreAnswer
} from './utils';

export {
  scoreAnswer,
  scoreExamSession,
  calculatePerformanceAnalytics,
  validateExamResults,
  createScoringConfig,
  DEFAULT_SCORING_CONFIG
} from './scoring';

export {
  ExamScoringService,
  createExamScoringService,
  getDefaultRequirements,
  CERTIFICATION_REQUIREMENTS
} from './exam-scoring-service';