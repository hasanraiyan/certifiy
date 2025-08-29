/**
 * Tests for exam data models, validation, and utilities
 */

import {
  ExamConfig,
  ExamSettings,
  Question,
  Answer,
  ExamSession,
  ExamResults,
  validateExamConfig,
  validateQuestion,
  validateAnswer,
  generateSessionId,
  calculateScore,
  determinePassStatus,
  isAnswerCorrect,
  formatTime,
  parseTimeToSeconds,
  serializeExamSession,
  deserializeExamSession,
  createDefaultExamSettings,
  ValidationError
} from '../index';

describe('Exam Data Models', () => {
  describe('ExamConfig validation', () => {
    it('should validate a valid ExamConfig', () => {
      const validConfig: ExamConfig = {
        id: 'test-exam-1',
        type: 'practice',
        examType: 'full-mock',
        timeLimit: 3600,
        settings: createDefaultExamSettings(),
        domain: 'Security',
        knowledgeArea: 'Network Security'
      };

      expect(() => validateExamConfig(validConfig)).not.toThrow();
    });

    it('should throw ValidationError for invalid ExamConfig', () => {
      const invalidConfig = {
        id: '',
        type: 'invalid-type',
        examType: 'full-mock',
        settings: createDefaultExamSettings()
      };

      expect(() => validateExamConfig(invalidConfig)).toThrow(ValidationError);
    });
  });

  describe('Question validation', () => {
    it('should validate a valid multiple-choice Question', () => {
      const validQuestion: Question = {
        id: 'q1',
        text: 'What is the capital of France?',
        type: 'multiple-choice',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        explanation: 'Paris is the capital of France.',
        domain: 'Geography',
        knowledgeArea: 'European Capitals',
        difficulty: 'easy'
      };

      expect(() => validateQuestion(validQuestion)).not.toThrow();
    });

    it('should validate a valid multiple-select Question', () => {
      const validQuestion: Question = {
        id: 'q2',
        text: 'Which of the following are programming languages?',
        type: 'multiple-select',
        options: ['JavaScript', 'HTML', 'Python', 'CSS'],
        correctAnswer: [0, 2],
        explanation: 'JavaScript and Python are programming languages.',
        domain: 'Technology',
        knowledgeArea: 'Programming',
        difficulty: 'medium'
      };

      expect(() => validateQuestion(validQuestion)).not.toThrow();
    });

    it('should throw ValidationError for invalid Question', () => {
      const invalidQuestion = {
        id: '',
        text: 'Invalid question',
        type: 'invalid-type',
        options: [],
        correctAnswer: -1,
        explanation: '',
        domain: '',
        knowledgeArea: '',
        difficulty: 'invalid'
      };

      expect(() => validateQuestion(invalidQuestion)).toThrow(ValidationError);
    });
  });

  describe('Answer validation', () => {
    it('should validate a valid Answer', () => {
      const validAnswer: Answer = {
        questionId: 'q1',
        selectedOptions: [2],
        timestamp: new Date(),
        timeSpent: 30
      };

      expect(() => validateAnswer(validAnswer)).not.toThrow();
    });

    it('should throw ValidationError for invalid Answer', () => {
      const invalidAnswer = {
        questionId: '',
        selectedOptions: 'invalid',
        timestamp: 'invalid-date',
        timeSpent: -1
      };

      expect(() => validateAnswer(invalidAnswer)).toThrow(ValidationError);
    });
  });

  describe('Utility functions', () => {
    it('should generate unique session IDs', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      
      expect(id1).toMatch(/^exam_[a-z0-9]+_[a-z0-9]+$/);
      expect(id2).toMatch(/^exam_[a-z0-9]+_[a-z0-9]+$/);
      expect(id1).not.toBe(id2);
    });

    it('should calculate score correctly', () => {
      expect(calculateScore(8, 10)).toBe(80);
      expect(calculateScore(0, 10)).toBe(0);
      expect(calculateScore(10, 10)).toBe(100);
      expect(calculateScore(0, 0)).toBe(0);
    });

    it('should determine pass status correctly', () => {
      expect(determinePassStatus(80, 70)).toBe(true);
      expect(determinePassStatus(65, 70)).toBe(false);
      expect(determinePassStatus(70, 70)).toBe(true);
    });

    it('should check answer correctness', () => {
      const question: Question = {
        id: 'q1',
        text: 'Test question',
        type: 'multiple-choice',
        options: ['A', 'B', 'C', 'D'],
        correctAnswer: 2,
        explanation: 'C is correct',
        domain: 'Test',
        knowledgeArea: 'Test',
        difficulty: 'easy'
      };

      const correctAnswer: Answer = {
        questionId: 'q1',
        selectedOptions: [2],
        timestamp: new Date(),
        timeSpent: 30
      };

      const incorrectAnswer: Answer = {
        questionId: 'q1',
        selectedOptions: [1],
        timestamp: new Date(),
        timeSpent: 30
      };

      expect(isAnswerCorrect(correctAnswer, question)).toBe(true);
      expect(isAnswerCorrect(incorrectAnswer, question)).toBe(false);
    });

    it('should format time correctly', () => {
      expect(formatTime(90)).toBe('1:30');
      expect(formatTime(3661)).toBe('1:01:01');
      expect(formatTime(30)).toBe('0:30');
    });

    it('should parse time to seconds correctly', () => {
      expect(parseTimeToSeconds('1:30')).toBe(90);
      expect(parseTimeToSeconds('1:01:01')).toBe(3661);
      expect(parseTimeToSeconds('0:30')).toBe(30);
    });
  });

  describe('Serialization', () => {
    it('should serialize and deserialize ExamSession correctly', () => {
      const originalSession: ExamSession = {
        id: 'session-1',
        userId: 'user-1',
        examConfig: {
          id: 'exam-1',
          type: 'practice',
          examType: 'full-mock',
          settings: createDefaultExamSettings()
        },
        startTime: new Date('2023-01-01T10:00:00Z'),
        endTime: new Date('2023-01-01T11:00:00Z'),
        currentQuestionIndex: 5,
        answers: new Map([[0, {
          questionId: 'q1',
          selectedOptions: [1],
          timestamp: new Date('2023-01-01T10:05:00Z'),
          timeSpent: 30
        }]]),
        bookmarkedQuestions: new Set([1, 3, 5]),
        status: 'in-progress'
      };

      const serialized = serializeExamSession(originalSession);
      const deserialized = deserializeExamSession(serialized);

      expect(deserialized.id).toBe(originalSession.id);
      expect(deserialized.startTime.getTime()).toBe(originalSession.startTime.getTime());
      expect(deserialized.answers.size).toBe(originalSession.answers.size);
      expect(deserialized.bookmarkedQuestions.size).toBe(originalSession.bookmarkedQuestions.size);
    });
  });
});

// Mock Jest functions for testing environment
declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  namespace expect {
    interface Matchers<R> {
      toBe(expected: unknown): R;
      toThrow(expected?: unknown): R;
      not: Matchers<R>;
      toMatch(expected: RegExp): R;
    }
  }
  function expect<T>(actual: T): expect.Matchers<T>;
}