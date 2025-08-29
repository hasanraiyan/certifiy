/**
 * Validation functions for exam data models
 */

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Validates ExamConfig object
 */
export function validateExamConfig(config) {
  if (!config || typeof config !== 'object') {
    throw new ValidationError('ExamConfig must be an object');
  }

  const c = config;

  if (!c.id || typeof c.id !== 'string' || c.id.trim().length === 0) {
    throw new ValidationError('ExamConfig.id must be a non-empty string', 'id');
  }

  if (!c.type || !['practice', 'test'].includes(c.type)) {
    throw new ValidationError('ExamConfig.type must be "practice" or "test"', 'type');
  }

  if (!c.examType || !['full-mock', 'domain-quiz', 'knowledge-area'].includes(c.examType)) {
    throw new ValidationError('ExamConfig.examType must be "full-mock", "domain-quiz", or "knowledge-area"', 'examType');
  }

  if (c.timeLimit !== undefined && (typeof c.timeLimit !== 'number' || c.timeLimit <= 0)) {
    throw new ValidationError('ExamConfig.timeLimit must be a positive number', 'timeLimit');
  }

  if (!c.settings || !validateExamSettings(c.settings)) {
    throw new ValidationError('ExamConfig.settings is invalid', 'settings');
  }

  if (c.domain !== undefined && (typeof c.domain !== 'string' || c.domain.trim().length === 0)) {
    throw new ValidationError('ExamConfig.domain must be a non-empty string if provided', 'domain');
  }

  if (c.knowledgeArea !== undefined && (typeof c.knowledgeArea !== 'string' || c.knowledgeArea.trim().length === 0)) {
    throw new ValidationError('ExamConfig.knowledgeArea must be a non-empty string if provided', 'knowledgeArea');
  }

  return true;
}

/**
 * Validates ExamSettings object
 */
export function validateExamSettings(settings) {
  if (!settings || typeof settings !== 'object') {
    throw new ValidationError('ExamSettings must be an object');
  }

  const s = settings;

  const booleanFields = [
    'showTimer', 'showProgress', 'allowReview', 
    'showExplanations', 'allowBookmarks', 'shuffleQuestions', 'shuffleAnswers'
  ];

  for (const field of booleanFields) {
    if (typeof s[field] !== 'boolean') {
      throw new ValidationError(`ExamSettings.${field} must be a boolean`, field);
    }
  }

  return true;
}

/**
 * Validates Question object
 */
export function validateQuestion(question) {
  if (!question || typeof question !== 'object') {
    throw new ValidationError('Question must be an object');
  }

  const q = question;

  if (!q.id || typeof q.id !== 'string' || q.id.trim().length === 0) {
    throw new ValidationError('Question.id must be a non-empty string', 'id');
  }

  if (!q.text || typeof q.text !== 'string' || q.text.trim().length === 0) {
    throw new ValidationError('Question.text must be a non-empty string', 'text');
  }

  if (!q.type || !['multiple-choice', 'multiple-select', 'true-false'].includes(q.type)) {
    throw new ValidationError('Question.type must be "multiple-choice", "multiple-select", or "true-false"', 'type');
  }

  if (!Array.isArray(q.options) || q.options.length === 0) {
    throw new ValidationError('Question.options must be a non-empty array', 'options');
  }

  if (!q.options.every(option => typeof option === 'string' && option.trim().length > 0)) {
    throw new ValidationError('Question.options must contain only non-empty strings', 'options');
  }

  // Validate correctAnswer based on question type
  if (q.type === 'multiple-choice' || q.type === 'true-false') {
    const options = q.options;
    if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer >= options.length) {
      throw new ValidationError('Question.correctAnswer must be a valid option index for single-answer questions', 'correctAnswer');
    }
  } else if (q.type === 'multiple-select') {
    if (!Array.isArray(q.correctAnswer) || q.correctAnswer.length === 0) {
      throw new ValidationError('Question.correctAnswer must be a non-empty array for multiple-select questions', 'correctAnswer');
    }
    const correctAnswers = q.correctAnswer;
    const options = q.options;
    if (!correctAnswers.every(answer => typeof answer === 'number' && answer >= 0 && answer < options.length)) {
      throw new ValidationError('Question.correctAnswer must contain valid option indices', 'correctAnswer');
    }
  }

  if (!q.explanation || typeof q.explanation !== 'string') {
    throw new ValidationError('Question.explanation must be a string', 'explanation');
  }

  if (!q.domain || typeof q.domain !== 'string' || q.domain.trim().length === 0) {
    throw new ValidationError('Question.domain must be a non-empty string', 'domain');
  }

  if (!q.knowledgeArea || typeof q.knowledgeArea !== 'string' || q.knowledgeArea.trim().length === 0) {
    throw new ValidationError('Question.knowledgeArea must be a non-empty string', 'knowledgeArea');
  }

  if (!q.difficulty || !['easy', 'medium', 'hard'].includes(q.difficulty)) {
    throw new ValidationError('Question.difficulty must be "easy", "medium", or "hard"', 'difficulty');
  }

  if (q.imageUrl !== undefined && (typeof q.imageUrl !== 'string' || q.imageUrl.trim().length === 0)) {
    throw new ValidationError('Question.imageUrl must be a non-empty string if provided', 'imageUrl');
  }

  return true;
}

/**
 * Validates Answer object
 */
export function validateAnswer(answer) {
  if (!answer || typeof answer !== 'object') {
    throw new ValidationError('Answer must be an object');
  }

  const a = answer;

  if (!a.questionId || typeof a.questionId !== 'string' || a.questionId.trim().length === 0) {
    throw new ValidationError('Answer.questionId must be a non-empty string', 'questionId');
  }

  if (!Array.isArray(a.selectedOptions)) {
    throw new ValidationError('Answer.selectedOptions must be an array', 'selectedOptions');
  }

  if (!a.selectedOptions.every(option => typeof option === 'number' && option >= 0)) {
    throw new ValidationError('Answer.selectedOptions must contain only non-negative numbers', 'selectedOptions');
  }

  if (!(a.timestamp instanceof Date) && typeof a.timestamp !== 'string') {
    throw new ValidationError('Answer.timestamp must be a Date object or ISO string', 'timestamp');
  }

  if (typeof a.timeSpent !== 'number' || a.timeSpent < 0) {
    throw new ValidationError('Answer.timeSpent must be a non-negative number', 'timeSpent');
  }

  return true;
}

/**
 * Validates answer format for specific question type
 */
export function validateAnswerForQuestionType(answer, question) {
  const errors = [];

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
      // Check for duplicate selections
      const uniqueOptions = new Set(answer.selectedOptions);
      if (uniqueOptions.size !== answer.selectedOptions.length) {
        errors.push('Multiple-select questions cannot have duplicate selections');
      }
      break;
    default:
      errors.push(`Unknown question type: ${question.type}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizes answer data to prevent tampering
 */
export function sanitizeAnswer(answer) {
  return {
    questionId: answer.questionId.trim(),
    selectedOptions: Array.from(new Set(answer.selectedOptions))
      .filter(option => Number.isInteger(option) && option >= 0)
      .sort(),
    timestamp: answer.timestamp instanceof Date ? answer.timestamp : new Date(answer.timestamp),
    timeSpent: Math.max(0, Math.floor(answer.timeSpent))
  };
}

/**
 * Validates answer completeness for exam submission
 */
export function validateAnswerCompleteness(answers, questions) {
  const missingQuestions = [];

  questions.forEach((_, index) => {
    if (!answers.has(index)) {
      missingQuestions.push(index);
    }
  });

  return {
    isComplete: missingQuestions.length === 0,
    missingQuestions
  };
}

/**
 * Validates ExamSession object
 */
export function validateExamSession(session) {
  if (!session || typeof session !== 'object') {
    throw new ValidationError('ExamSession must be an object');
  }

  const s = session;

  if (!s.id || typeof s.id !== 'string' || s.id.trim().length === 0) {
    throw new ValidationError('ExamSession.id must be a non-empty string', 'id');
  }

  if (!s.userId || typeof s.userId !== 'string' || s.userId.trim().length === 0) {
    throw new ValidationError('ExamSession.userId must be a non-empty string', 'userId');
  }

  if (!s.examConfig || !validateExamConfig(s.examConfig)) {
    throw new ValidationError('ExamSession.examConfig is invalid', 'examConfig');
  }

  if (!(s.startTime instanceof Date) && typeof s.startTime !== 'string') {
    throw new ValidationError('ExamSession.startTime must be a Date object or ISO string', 'startTime');
  }

  if (s.endTime !== undefined && !(s.endTime instanceof Date) && typeof s.endTime !== 'string') {
    throw new ValidationError('ExamSession.endTime must be a Date object or ISO string if provided', 'endTime');
  }

  if (typeof s.currentQuestionIndex !== 'number' || s.currentQuestionIndex < 0) {
    throw new ValidationError('ExamSession.currentQuestionIndex must be a non-negative number', 'currentQuestionIndex');
  }

  if (!(s.answers instanceof Map) && !Array.isArray(s.answers)) {
    throw new ValidationError('ExamSession.answers must be a Map or Array', 'answers');
  }

  if (!(s.bookmarkedQuestions instanceof Set) && !Array.isArray(s.bookmarkedQuestions)) {
    throw new ValidationError('ExamSession.bookmarkedQuestions must be a Set or Array', 'bookmarkedQuestions');
  }

  if (!s.status || !['setup', 'in-progress', 'review', 'completed', 'abandoned'].includes(s.status)) {
    throw new ValidationError('ExamSession.status must be a valid status', 'status');
  }

  return true;
}

/**
 * Validates ExamResults object
 */
export function validateExamResults(results) {
  if (!results || typeof results !== 'object') {
    throw new ValidationError('ExamResults must be an object');
  }

  const r = results;

  if (!r.sessionId || typeof r.sessionId !== 'string' || r.sessionId.trim().length === 0) {
    throw new ValidationError('ExamResults.sessionId must be a non-empty string', 'sessionId');
  }

  if (typeof r.totalQuestions !== 'number' || r.totalQuestions <= 0) {
    throw new ValidationError('ExamResults.totalQuestions must be a positive number', 'totalQuestions');
  }

  if (typeof r.answeredQuestions !== 'number' || r.answeredQuestions < 0) {
    throw new ValidationError('ExamResults.answeredQuestions must be a non-negative number', 'answeredQuestions');
  }

  if (typeof r.correctAnswers !== 'number' || r.correctAnswers < 0) {
    throw new ValidationError('ExamResults.correctAnswers must be a non-negative number', 'correctAnswers');
  }

  if (typeof r.score !== 'number' || r.score < 0 || r.score > 100) {
    throw new ValidationError('ExamResults.score must be a number between 0 and 100', 'score');
  }

  if (typeof r.passed !== 'boolean') {
    throw new ValidationError('ExamResults.passed must be a boolean', 'passed');
  }

  if (typeof r.timeSpent !== 'number' || r.timeSpent < 0) {
    throw new ValidationError('ExamResults.timeSpent must be a non-negative number', 'timeSpent');
  }

  if (!(r.domainScores instanceof Map) && !Array.isArray(r.domainScores)) {
    throw new ValidationError('ExamResults.domainScores must be a Map or Array', 'domainScores');
  }

  if (!Array.isArray(r.questionResults)) {
    throw new ValidationError('ExamResults.questionResults must be an array', 'questionResults');
  }

  return true;
}

/**
 * Validates DomainScore object
 */
export function validateDomainScore(domainScore) {
  if (!domainScore || typeof domainScore !== 'object') {
    throw new ValidationError('DomainScore must be an object');
  }

  const d = domainScore;

  if (!d.domain || typeof d.domain !== 'string' || d.domain.trim().length === 0) {
    throw new ValidationError('DomainScore.domain must be a non-empty string', 'domain');
  }

  if (typeof d.totalQuestions !== 'number' || d.totalQuestions <= 0) {
    throw new ValidationError('DomainScore.totalQuestions must be a positive number', 'totalQuestions');
  }

  if (typeof d.correctAnswers !== 'number' || d.correctAnswers < 0) {
    throw new ValidationError('DomainScore.correctAnswers must be a non-negative number', 'correctAnswers');
  }

  if (typeof d.score !== 'number' || d.score < 0 || d.score > 100) {
    throw new ValidationError('DomainScore.score must be a number between 0 and 100', 'score');
  }

  return true;
}

/**
 * Validates QuestionResult object
 */
export function validateQuestionResult(questionResult) {
  if (!questionResult || typeof questionResult !== 'object') {
    throw new ValidationError('QuestionResult must be an object');
  }

  const q = questionResult;

  if (!q.questionId || typeof q.questionId !== 'string' || q.questionId.trim().length === 0) {
    throw new ValidationError('QuestionResult.questionId must be a non-empty string', 'questionId');
  }

  if (typeof q.correct !== 'boolean') {
    throw new ValidationError('QuestionResult.correct must be a boolean', 'correct');
  }

  if (!Array.isArray(q.selectedAnswer)) {
    throw new ValidationError('QuestionResult.selectedAnswer must be an array', 'selectedAnswer');
  }

  if (!Array.isArray(q.correctAnswer)) {
    throw new ValidationError('QuestionResult.correctAnswer must be an array', 'correctAnswer');
  }

  if (typeof q.timeSpent !== 'number' || q.timeSpent < 0) {
    throw new ValidationError('QuestionResult.timeSpent must be a non-negative number', 'timeSpent');
  }

  if (!q.domain || typeof q.domain !== 'string' || q.domain.trim().length === 0) {
    throw new ValidationError('QuestionResult.domain must be a non-empty string', 'domain');
  }

  return true;
}