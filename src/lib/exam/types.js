/**
 * Core data types for the exam engine system
 */

/**
 * @typedef {'practice' | 'test'} ExamType
 */

/**
 * @typedef {'full-mock' | 'domain-quiz' | 'knowledge-area'} ExamMode
 */

/**
 * @typedef {'multiple-choice' | 'multiple-select' | 'true-false'} QuestionType
 */

/**
 * @typedef {'easy' | 'medium' | 'hard'} Difficulty
 */

/**
 * @typedef {'setup' | 'in-progress' | 'review' | 'completed' | 'abandoned'} ExamStatus
 */

/**
 * Exam configuration interface
 * @typedef {Object} ExamConfig
 * @property {string} id
 * @property {ExamType} type
 * @property {ExamMode} examType
 * @property {number} [timeLimit] - in seconds
 * @property {ExamSettings} settings
 * @property {string} [domain]
 * @property {string} [knowledgeArea]
 */

/**
 * Exam settings interface
 * @typedef {Object} ExamSettings
 * @property {boolean} showTimer
 * @property {boolean} showProgress
 * @property {boolean} allowReview
 * @property {boolean} showExplanations
 * @property {boolean} allowBookmarks
 * @property {boolean} shuffleQuestions
 * @property {boolean} shuffleAnswers
 */

/**
 * Question interface
 * @typedef {Object} Question
 * @property {string} id
 * @property {string} text
 * @property {QuestionType} type
 * @property {string[]} options
 * @property {number | number[]} correctAnswer - single or multiple correct answers
 * @property {string} explanation
 * @property {string} domain
 * @property {string} knowledgeArea
 * @property {Difficulty} difficulty
 * @property {string} [imageUrl]
 */

/**
 * Answer interface
 * @typedef {Object} Answer
 * @property {string} questionId
 * @property {number[]} selectedOptions
 * @property {Date} timestamp
 * @property {number} timeSpent - in seconds
 */

/**
 * Exam session interface
 * @typedef {Object} ExamSession
 * @property {string} id
 * @property {string} userId
 * @property {ExamConfig} examConfig
 * @property {Date} startTime
 * @property {Date} [endTime]
 * @property {number} currentQuestionIndex
 * @property {Map<number, Answer>} answers
 * @property {Set<number>} bookmarkedQuestions
 * @property {ExamStatus} status
 */

/**
 * Serializable version of ExamSession that can be stored/transmitted as JSON
 * @typedef {Object} SerializableExamSession
 * @property {string} id
 * @property {string} userId
 * @property {ExamConfig} examConfig
 * @property {string} startTime
 * @property {string} [endTime]
 * @property {number} currentQuestionIndex
 * @property {Array<[number, Answer]>} answers
 * @property {number[]} bookmarkedQuestions
 * @property {ExamStatus} status
 */

/**
 * Domain score interface
 * @typedef {Object} DomainScore
 * @property {string} domain
 * @property {number} totalQuestions
 * @property {number} correctAnswers
 * @property {number} score - percentage
 */

/**
 * Question result interface
 * @typedef {Object} QuestionResult
 * @property {string} questionId
 * @property {boolean} correct
 * @property {number[]} selectedAnswer
 * @property {number[]} correctAnswer
 * @property {number} timeSpent
 * @property {string} domain
 */

/**
 * Validation error interface
 * @typedef {Object} ValidationError
 * @property {string} message
 * @property {string} [field]
 */

/**
 * Validation functions
 */
export function validateExamSession(data) {
  const errors = [];
  if (!data.id) errors.push({ message: "Missing session ID", field: "id" });
  if (!data.userId) errors.push({ message: "Missing user ID", field: "userId" });
  if (!data.examConfig) errors.push({ message: "Missing exam configuration", field: "examConfig" });
  return errors;
}

export function validateQuestion(data) {
  const errors = [];
  if (!data.id) errors.push({ message: "Missing question ID", field: "id" });
  if (!data.text) errors.push({ message: "Missing question text", field: "text" });
  if (!data.options || data.options.length === 0) errors.push({ message: "Missing answer options", field: "options" });
  return errors;
}

export function validateAnswer(data) {
  const errors = [];
  if (!data.questionId) errors.push({ message: "Missing question ID", field: "questionId" });
  if (!data.selectedOptions) errors.push({ message: "Missing selected options", field: "selectedOptions" });
  if (!data.timestamp) errors.push({ message: "Missing timestamp", field: "timestamp" });
  return errors;
}

export function validateExamConfig(data) {
  const errors = [];
  if (!data.id) errors.push({ message: "Missing config ID", field: "id" });
  if (!data.type) errors.push({ message: "Missing exam type", field: "type" });
  if (!data.examType) errors.push({ message: "Missing exam mode", field: "examType" });
  if (!data.settings) errors.push({ message: "Missing exam settings", field: "settings" });
  return errors;
}

export function validateExamResults(data) {
  const errors = [];
  if (!Array.isArray(data)) errors.push({ message: "Results must be an array", field: "results" });
  data.forEach((result, index) => {
    if (!result.questionId) errors.push({ message: `Missing question ID at index ${index}`, field: `results[${index}].questionId` });
    if (result.correct === undefined) errors.push({ message: `Missing correct flag at index ${index}`, field: `results[${index}].correct` });
  });
  return errors;
}

/**
 * Serialize an ExamSession into a JSON-friendly format
 */
export function serializeExamSession(session) {
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
 * Deserialize a SerializableExamSession back into an ExamSession
 */
export function deserializeExamSession(data) {
  return {
    id: data.id,
    userId: data.userId,
    examConfig: data.examConfig,
    startTime: new Date(data.startTime),
    endTime: data.endTime ? new Date(data.endTime) : undefined,
    currentQuestionIndex: data.currentQuestionIndex,
    answers: new Map(data.answers),
    bookmarkedQuestions: new Set(data.bookmarkedQuestions),
    status: data.status
  };
}

/**
 * Validate the integrity of a recovered session
 */
export function validateSessionIntegrity(session) {
  const errors = [];
  
  if (!session.id) errors.push({ message: "Missing session ID", field: "id" });
  if (!session.userId) errors.push({ message: "Missing user ID", field: "userId" });
  if (!session.examConfig) errors.push({ message: "Missing exam configuration", field: "examConfig" });
  if (!session.startTime) errors.push({ message: "Missing start time", field: "startTime" });
  if (session.currentQuestionIndex < 0) errors.push({ message: "Invalid question index", field: "currentQuestionIndex" });
  if (!session.answers) errors.push({ message: "Missing answers map", field: "answers" });
  if (!session.bookmarkedQuestions) errors.push({ message: "Missing bookmarked questions", field: "bookmarkedQuestions" });
  if (!session.status) errors.push({ message: "Missing session status", field: "status" });
  
  return errors;
}

/**
 * Exam results interface
 * @typedef {Object} ExamResults
 * @property {string} sessionId
 * @property {number} totalQuestions
 * @property {number} answeredQuestions
 * @property {number} correctAnswers
 * @property {number} score - percentage
 * @property {boolean} passed
 * @property {number} timeSpent
 * @property {Map<string, DomainScore>} domainScores
 * @property {QuestionResult[]} questionResults
 */

/**
 * Serializable versions of interfaces for JSON storage
 * @typedef {Object} SerializableExamResults
 * @property {string} sessionId
 * @property {number} totalQuestions
 * @property {number} answeredQuestions
 * @property {number} correctAnswers
 * @property {number} score
 * @property {boolean} passed
 * @property {number} timeSpent
 * @property {Array<[string, DomainScore]>} domainScores
 * @property {QuestionResult[]} questionResults
 */