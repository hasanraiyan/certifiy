/**
 * Utility functions for data transformation and serialization
 */

import {
  ExamSession,
  ExamResults,
  SerializableExamSession,
  SerializableExamResults,
  Answer,
  DomainScore,
  Question,
  QuestionResult
} from './types';

/**
 * Converts ExamSession to serializable format for JSON storage
 */
export function serializeExamSession(session: ExamSession): SerializableExamSession {
  return {
    id: session.id,
    userId: session.userId,
    examConfig: session.examConfig,
    startTime: session.startTime.toISOString(),
    endTime: session.endTime?.toISOString(),
    currentQuestionIndex: session.currentQuestionIndex,
    answers: Array.from(session.answers.entries()),
    bookmarkedQuestions: Array.from(session.bookmarkedQuestions),
    status: session.status
  };
}

/**
 * Converts serializable format back to ExamSession
 */
export function deserializeExamSession(serialized: SerializableExamSession): ExamSession {
  return {
    id: serialized.id,
    userId: serialized.userId,
    examConfig: serialized.examConfig,
    startTime: new Date(serialized.startTime),
    endTime: serialized.endTime ? new Date(serialized.endTime) : undefined,
    currentQuestionIndex: serialized.currentQuestionIndex,
    answers: new Map(serialized.answers.map(([key, answer]) => [
      key,
      {
        ...answer,
        timestamp: new Date(answer.timestamp)
      }
    ])),
    bookmarkedQuestions: new Set(serialized.bookmarkedQuestions),
    status: serialized.status
  };
}

/**
 * Converts ExamResults to serializable format for JSON storage
 */
export function serializeExamResults(results: ExamResults): SerializableExamResults {
  return {
    sessionId: results.sessionId,
    totalQuestions: results.totalQuestions,
    answeredQuestions: results.answeredQuestions,
    correctAnswers: results.correctAnswers,
    score: results.score,
    passed: results.passed,
    timeSpent: results.timeSpent,
    domainScores: Array.from(results.domainScores.entries()),
    questionResults: results.questionResults
  };
}

/**
 * Converts serializable format back to ExamResults
 */
export function deserializeExamResults(serialized: SerializableExamResults): ExamResults {
  return {
    sessionId: serialized.sessionId,
    totalQuestions: serialized.totalQuestions,
    answeredQuestions: serialized.answeredQuestions,
    correctAnswers: serialized.correctAnswers,
    score: serialized.score,
    passed: serialized.passed,
    timeSpent: serialized.timeSpent,
    domainScores: new Map(serialized.domainScores),
    questionResults: serialized.questionResults
  };
}

/**
 * Generates a unique session ID
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `exam_${timestamp}_${randomPart}`;
}

/**
 * Calculates exam score based on correct answers
 */
export function calculateScore(correctAnswers: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

/**
 * Determines if exam is passed based on score and passing threshold
 */
export function determinePassStatus(score: number, passingThreshold: number = 70): boolean {
  return score >= passingThreshold;
}

/**
 * Calculates domain scores from question results
 */
export function calculateDomainScores(questionResults: QuestionResult[]): Map<string, DomainScore> {
  const domainMap = new Map<string, DomainScore>();

  questionResults.forEach(result => {
    const existing = domainMap.get(result.domain);
    
    if (existing) {
      existing.totalQuestions += 1;
      if (result.correct) {
        existing.correctAnswers += 1;
      }
      existing.score = calculateScore(existing.correctAnswers, existing.totalQuestions);
    } else {
      domainMap.set(result.domain, {
        domain: result.domain,
        totalQuestions: 1,
        correctAnswers: result.correct ? 1 : 0,
        score: result.correct ? 100 : 0
      });
    }
  });

  return domainMap;
}

/**
 * Validates answer against question
 */
export function validateAnswerForQuestion(answer: Answer, question: Question): boolean {
  if (answer.questionId !== question.id) {
    return false;
  }

  // Check if selected options are valid indices
  const validIndices = answer.selectedOptions.every(
    option => option >= 0 && option < question.options.length
  );

  if (!validIndices) {
    return false;
  }

  // Check answer count based on question type
  switch (question.type) {
    case 'multiple-choice':
    case 'true-false':
      return answer.selectedOptions.length === 1;
    case 'multiple-select':
      return answer.selectedOptions.length > 0;
    default:
      return false;
  }
}

/**
 * Checks if answer is correct
 */
export function isAnswerCorrect(answer: Answer, question: Question): boolean {
  if (!validateAnswerForQuestion(answer, question)) {
    return false;
  }

  const correctAnswer = Array.isArray(question.correctAnswer) 
    ? question.correctAnswer 
    : [question.correctAnswer];

  const selectedAnswer = answer.selectedOptions.sort();
  const correctSorted = correctAnswer.sort();

  return selectedAnswer.length === correctSorted.length &&
         selectedAnswer.every((option, index) => option === correctSorted[index]);
}

/**
 * Calculates score for a single question with partial credit support
 */
export function calculateQuestionScore(answer: Answer, question: Question): number {
  const correctAnswer = Array.isArray(question.correctAnswer) 
    ? question.correctAnswer 
    : [question.correctAnswer];

  switch (question.type) {
    case 'multiple-choice':
    case 'true-false':
      // Binary scoring: 1 for correct, 0 for incorrect
      return isAnswerCorrect(answer, question) ? 1 : 0;

    case 'multiple-select':
      // Partial credit scoring for multiple select questions
      return calculatePartialCredit(answer.selectedOptions, correctAnswer);

    default:
      return 0;
  }
}

/**
 * Calculates partial credit for multiple select questions
 */
export function calculatePartialCredit(selectedOptions: number[], correctOptions: number[]): number {
  if (selectedOptions.length === 0) {
    return 0;
  }

  const selectedSet = new Set(selectedOptions);
  const correctSet = new Set(correctOptions);
  
  // Calculate intersection (correct selections)
  const correctSelections = selectedOptions.filter(option => correctSet.has(option)).length;
  
  // Calculate incorrect selections
  const incorrectSelections = selectedOptions.filter(option => !correctSet.has(option)).length;
  
  // Calculate missed correct options
  const missedCorrect = correctOptions.filter(option => !selectedSet.has(option)).length;

  // Partial credit formula: (correct - incorrect) / total_correct, minimum 0
  const score = Math.max(0, (correctSelections - incorrectSelections) / correctOptions.length);
  
  return score;
}

/**
 * Validates and scores an answer against a question
 * Note: This is a basic validation. For full validation, use validateAnswerForQuestionType from validation.ts
 */
export function validateAndScoreAnswer(answer: Answer, question: Question): {
  isValid: boolean;
  score: number;
  errors: string[];
  feedback: string;
} {
  const errors: string[] = [];

  // Basic validation
  if (answer.questionId !== question.id) {
    errors.push('Answer questionId does not match question id');
  }

  // Check if selected options are valid indices
  const invalidOptions = answer.selectedOptions.filter(
    option => option < 0 || option >= question.options.length
  );
  if (invalidOptions.length > 0) {
    errors.push(`Invalid option indices: ${invalidOptions.join(', ')}`);
  }

  // Check answer count based on question type
  switch (question.type) {
    case 'multiple-choice':
    case 'true-false':
      if (answer.selectedOptions.length !== 1) {
        errors.push(`${question.type} questions must have exactly one selected option`);
      }
      break;
    case 'multiple-select':
      if (answer.selectedOptions.length === 0) {
        errors.push('Multiple-select questions must have at least one selected option');
      }
      break;
  }
  
  if (errors.length > 0) {
    return {
      isValid: false,
      score: 0,
      errors,
      feedback: 'Answer format is invalid'
    };
  }

  const score = calculateQuestionScore(answer, question);
  const isCorrect = score === 1;
  
  let feedback = '';
  if (question.type === 'multiple-select' && score > 0 && score < 1) {
    feedback = `Partial credit: ${Math.round(score * 100)}%`;
  } else if (isCorrect) {
    feedback = 'Correct';
  } else {
    feedback = 'Incorrect';
  }

  return {
    isValid: true,
    score,
    errors: [],
    feedback
  };
}

/**
 * Formats time in seconds to human-readable format
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Parses time string to seconds
 */
export function parseTimeToSeconds(timeString: string): number {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  throw new Error('Invalid time format. Expected MM:SS or HH:MM:SS');
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Creates a deep copy of an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Map) {
    const clonedMap = new Map();
    obj.forEach((value, key) => {
      clonedMap.set(deepClone(key), deepClone(value));
    });
    return clonedMap as T;
  }

  if (obj instanceof Set) {
    const clonedSet = new Set();
    obj.forEach(value => {
      clonedSet.add(deepClone(value));
    });
    return clonedSet as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  const clonedObj = {} as T;
  Object.keys(obj).forEach(key => {
    (clonedObj as any)[key] = deepClone((obj as any)[key]);
  });

  return clonedObj;
}

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates exam session integrity
 */
export function validateSessionIntegrity(session: ExamSession): boolean {
  // Check if session has valid timestamps
  if (session.endTime && session.endTime < session.startTime) {
    return false;
  }

  // Check if current question index is valid
  if (session.currentQuestionIndex < 0) {
    return false;
  }

  // Check if answers are valid
  const answerEntries = Array.from(session.answers.entries());
  for (let i = 0; i < answerEntries.length; i++) {
    const [questionIndex, answer] = answerEntries[i];
    if (questionIndex < 0 || answer.timeSpent < 0) {
      return false;
    }
  }

  // Check if bookmarked questions are valid indices
  const bookmarkedArray = Array.from(session.bookmarkedQuestions);
  for (let i = 0; i < bookmarkedArray.length; i++) {
    if (bookmarkedArray[i] < 0) {
      return false;
    }
  }

  return true;
}

/**
 * Creates default exam settings
 */
export function createDefaultExamSettings(): import('./types').ExamSettings {
  return {
    showTimer: true,
    showProgress: true,
    allowReview: true,
    showExplanations: false,
    allowBookmarks: true,
    shuffleQuestions: false,
    shuffleAnswers: false
  };
}

/**
 * Merges exam settings with defaults
 */
export function mergeExamSettings(
  settings: Partial<import('./types').ExamSettings>
): import('./types').ExamSettings {
  const defaults = createDefaultExamSettings();
  return { ...defaults, ...settings };
}