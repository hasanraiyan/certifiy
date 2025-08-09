/**
 * Comprehensive scoring algorithms for exam engine
 */

import {
  Question,
  Answer,
  ExamResults,
  QuestionResult,
  DomainScore,
  ExamSession,
  ExamConfig
} from './types';
import {
  calculateQuestionScore,
  calculatePartialCredit,
  validateAndScoreAnswer,
  calculateDomainScores
} from './utils';
import { validateAnswerForQuestionType, sanitizeAnswer } from './validation';

/**
 * Scoring configuration interface
 */
export interface ScoringConfig {
  passingThreshold: number; // Percentage required to pass (default: 70)
  partialCreditEnabled: boolean; // Enable partial credit for multiple select
  penalizeIncorrect: boolean; // Penalize incorrect answers in multiple select
  timeBonus: boolean; // Award bonus points for fast completion
  domainWeighting: Map<string, number>; // Weight different domains differently
}

/**
 * Default scoring configuration
 */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  passingThreshold: 70,
  partialCreditEnabled: true,
  penalizeIncorrect: false,
  timeBonus: false,
  domainWeighting: new Map()
};

/**
 * Comprehensive answer validation and scoring
 */
export function scoreAnswer(
  answer: Answer,
  question: Question,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): QuestionResult {
  // Sanitize answer to prevent tampering
  const sanitizedAnswer = sanitizeAnswer(answer);
  
  // Validate answer format
  const validation = validateAnswerForQuestionType(sanitizedAnswer, question);
  
  if (!validation.isValid) {
    return {
      questionId: question.id,
      correct: false,
      selectedAnswer: sanitizedAnswer.selectedOptions,
      correctAnswer: Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer],
      timeSpent: sanitizedAnswer.timeSpent,
      domain: question.domain
    };
  }

  // Calculate score based on question type and configuration
  let score = 0;
  const correctAnswer = Array.isArray(question.correctAnswer) 
    ? question.correctAnswer 
    : [question.correctAnswer];

  switch (question.type) {
    case 'multiple-choice':
    case 'true-false':
      score = calculateBinaryScore(sanitizedAnswer.selectedOptions, correctAnswer);
      break;
    
    case 'multiple-select':
      if (config.partialCreditEnabled) {
        score = calculateAdvancedPartialCredit(
          sanitizedAnswer.selectedOptions, 
          correctAnswer, 
          config.penalizeIncorrect
        );
      } else {
        score = calculateBinaryScore(sanitizedAnswer.selectedOptions, correctAnswer);
      }
      break;
  }

  return {
    questionId: question.id,
    correct: score === 1,
    selectedAnswer: sanitizedAnswer.selectedOptions,
    correctAnswer: correctAnswer,
    timeSpent: sanitizedAnswer.timeSpent,
    domain: question.domain
  };
}

/**
 * Binary scoring (all or nothing)
 */
function calculateBinaryScore(selectedOptions: number[], correctOptions: number[]): number {
  const selectedSet = new Set(selectedOptions.sort());
  const correctSet = new Set(correctOptions.sort());
  
  if (selectedSet.size !== correctSet.size) {
    return 0;
  }
  
  const selectedArray = Array.from(selectedSet);
  for (let i = 0; i < selectedArray.length; i++) {
    if (!correctSet.has(selectedArray[i])) {
      return 0;
    }
  }
  
  return 1;
}

/**
 * Advanced partial credit calculation with penalty options
 */
function calculateAdvancedPartialCredit(
  selectedOptions: number[], 
  correctOptions: number[], 
  penalizeIncorrect: boolean = false
): number {
  if (selectedOptions.length === 0) {
    return 0;
  }

  const selectedSet = new Set(selectedOptions);
  const correctSet = new Set(correctOptions);
  
  const correctSelections = selectedOptions.filter(option => correctSet.has(option)).length;
  const incorrectSelections = selectedOptions.filter(option => !correctSet.has(option)).length;
  
  let score: number;
  
  if (penalizeIncorrect) {
    // Penalty formula: (correct - incorrect) / total_correct
    score = (correctSelections - incorrectSelections) / correctOptions.length;
  } else {
    // Standard partial credit: correct / total_correct
    score = correctSelections / correctOptions.length;
  }
  
  return Math.max(0, Math.min(1, score));
}

/**
 * Scores an entire exam session
 */
export function scoreExamSession(
  session: ExamSession,
  questions: Question[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ExamResults {
  const questionResults: QuestionResult[] = [];
  let totalScore = 0;
  let answeredQuestions = 0;

  // Score each question
  questions.forEach((question, index) => {
    const answer = session.answers.get(index);
    
    if (answer) {
      const result = scoreAnswer(answer, question, config);
      questionResults.push(result);
      
      // Apply domain weighting if configured
      const domainWeight = config.domainWeighting.get(question.domain) || 1;
      const weightedScore = calculateQuestionScore(answer, question) * domainWeight;
      totalScore += weightedScore;
      answeredQuestions++;
    } else {
      // Unanswered question
      questionResults.push({
        questionId: question.id,
        correct: false,
        selectedAnswer: [],
        correctAnswer: Array.isArray(question.correctAnswer) 
          ? question.correctAnswer 
          : [question.correctAnswer],
        timeSpent: 0,
        domain: question.domain
      });
    }
  });

  // Calculate overall score
  const rawScore = questions.length > 0 ? (totalScore / questions.length) * 100 : 0;
  
  // Apply time bonus if enabled
  let finalScore = rawScore;
  if (config.timeBonus && session.endTime && session.startTime) {
    finalScore = applyTimeBonus(rawScore, session, questions.length);
  }

  // Calculate domain scores
  const domainScores = calculateDomainScores(questionResults);

  // Determine pass/fail status
  const passed = finalScore >= config.passingThreshold;

  // Calculate time spent
  const timeSpent = session.endTime && session.startTime 
    ? Math.floor((session.endTime.getTime() - session.startTime.getTime()) / 1000)
    : 0;

  return {
    sessionId: session.id,
    totalQuestions: questions.length,
    answeredQuestions,
    correctAnswers: questionResults.filter(r => r.correct).length,
    score: Math.round(finalScore * 100) / 100, // Round to 2 decimal places
    passed,
    timeSpent,
    domainScores,
    questionResults
  };
}

/**
 * Applies time bonus to exam score
 */
function applyTimeBonus(
  baseScore: number, 
  session: ExamSession, 
  totalQuestions: number
): number {
  if (!session.endTime || !session.startTime || !session.examConfig.timeLimit) {
    return baseScore;
  }

  const timeSpent = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
  const timeLimit = session.examConfig.timeLimit;
  
  // Calculate time efficiency (0-1 scale)
  const timeEfficiency = Math.max(0, (timeLimit - timeSpent) / timeLimit);
  
  // Apply modest time bonus (max 5% bonus)
  const timeBonus = timeEfficiency * 5;
  
  return Math.min(100, baseScore + timeBonus);
}

/**
 * Calculates detailed performance analytics
 */
export function calculatePerformanceAnalytics(
  results: ExamResults,
  questions: Question[]
): {
  overallPerformance: {
    score: number;
    passed: boolean;
    accuracy: number;
    completionRate: number;
  };
  domainPerformance: Array<{
    domain: string;
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
    averageTimePerQuestion: number;
  }>;
  difficultyPerformance: Array<{
    difficulty: string;
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
  }>;
  timeAnalytics: {
    totalTime: number;
    averageTimePerQuestion: number;
    fastestQuestion: number;
    slowestQuestion: number;
  };
} {
  const questionMap = new Map(questions.map(q => [q.id, q]));
  
  // Overall performance
  const accuracy = results.totalQuestions > 0 
    ? (results.correctAnswers / results.totalQuestions) * 100 
    : 0;
  const completionRate = results.totalQuestions > 0 
    ? (results.answeredQuestions / results.totalQuestions) * 100 
    : 0;

  // Domain performance
  const domainPerformance = Array.from(results.domainScores.entries()).map(([domain, domainScore]) => {
    const domainQuestions = results.questionResults.filter(r => r.domain === domain);
    const totalTime = domainQuestions.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageTimePerQuestion = domainQuestions.length > 0 ? totalTime / domainQuestions.length : 0;

    return {
      domain,
      score: domainScore.score,
      accuracy: domainScore.score,
      totalQuestions: domainScore.totalQuestions,
      correctAnswers: domainScore.correctAnswers,
      averageTimePerQuestion: Math.round(averageTimePerQuestion)
    };
  });

  // Difficulty performance
  const difficultyMap = new Map<string, { total: number; correct: number }>();
  results.questionResults.forEach(result => {
    const question = questionMap.get(result.questionId);
    if (question) {
      const existing = difficultyMap.get(question.difficulty) || { total: 0, correct: 0 };
      existing.total++;
      if (result.correct) existing.correct++;
      difficultyMap.set(question.difficulty, existing);
    }
  });

  const difficultyPerformance = Array.from(difficultyMap.entries()).map(([difficulty, stats]) => ({
    difficulty,
    score: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
    totalQuestions: stats.total,
    correctAnswers: stats.correct
  }));

  // Time analytics
  const questionTimes = results.questionResults.map(r => r.timeSpent).filter(t => t > 0);
  const averageTimePerQuestion = questionTimes.length > 0 
    ? questionTimes.reduce((sum, time) => sum + time, 0) / questionTimes.length 
    : 0;
  const fastestQuestion = questionTimes.length > 0 ? Math.min(...questionTimes) : 0;
  const slowestQuestion = questionTimes.length > 0 ? Math.max(...questionTimes) : 0;

  return {
    overallPerformance: {
      score: results.score,
      passed: results.passed,
      accuracy: Math.round(accuracy * 100) / 100,
      completionRate: Math.round(completionRate * 100) / 100
    },
    domainPerformance,
    difficultyPerformance,
    timeAnalytics: {
      totalTime: results.timeSpent,
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      fastestQuestion,
      slowestQuestion
    }
  };
}

/**
 * Validates exam results integrity
 */
export function validateExamResults(
  results: ExamResults,
  session: ExamSession,
  questions: Question[]
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check basic consistency
  if (results.sessionId !== session.id) {
    errors.push('Results session ID does not match session');
  }

  if (results.totalQuestions !== questions.length) {
    errors.push('Total questions count mismatch');
  }

  if (results.questionResults.length !== questions.length) {
    errors.push('Question results count mismatch');
  }

  // Check score consistency
  const correctCount = results.questionResults.filter(r => r.correct).length;
  if (results.correctAnswers !== correctCount) {
    errors.push('Correct answers count mismatch');
  }

  // Check domain scores consistency
  const calculatedDomainScores = calculateDomainScores(results.questionResults);
  const domainEntries = Array.from(results.domainScores.entries());
  for (let i = 0; i < domainEntries.length; i++) {
    const [domain, score] = domainEntries[i];
    const calculated = calculatedDomainScores.get(domain);
    if (!calculated || Math.abs(calculated.score - score.score) > 0.01) {
      errors.push(`Domain score mismatch for ${domain}`);
    }
  }

  // Check score range
  if (results.score < 0 || results.score > 100) {
    errors.push('Score out of valid range (0-100)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Creates a scoring configuration for different exam types
 */
export function createScoringConfig(examConfig: ExamConfig): ScoringConfig {
  const config = { ...DEFAULT_SCORING_CONFIG };

  // Adjust settings based on exam type
  switch (examConfig.type) {
    case 'practice':
      config.partialCreditEnabled = true;
      config.penalizeIncorrect = false;
      config.timeBonus = false;
      break;
    
    case 'test':
      config.partialCreditEnabled = false; // Stricter scoring for tests
      config.penalizeIncorrect = false;
      config.timeBonus = false;
      break;
  }

  // Adjust based on exam mode
  switch (examConfig.examType) {
    case 'full-mock':
      config.passingThreshold = 70;
      break;
    case 'domain-quiz':
      config.passingThreshold = 60; // Lower threshold for focused practice
      break;
    case 'knowledge-area':
      config.passingThreshold = 65;
      break;
  }

  return config;
}