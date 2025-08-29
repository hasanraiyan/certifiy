/**
 * Session validation utilities for ensuring exam data integrity
 * Handles corrupted data detection and validation
 */

import { ExamSession, Question, Answer, ExamConfig } from './types'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
  canRecover: boolean
  recoveryActions?: RecoveryAction[]
}

export interface ValidationError {
  code: string
  message: string
  field?: string
  severity: 'critical' | 'major' | 'minor'
}

export interface ValidationWarning {
  code: string
  message: string
  field?: string
  suggestion?: string
}

export interface RecoveryAction {
  type: 'fix' | 'reset' | 'remove' | 'default'
  description: string
  field?: string
  value?: any
}

/**
 * Comprehensive validation of exam session data
 */
export function validateExamSession(
  session: ExamSession,
  questions?: Question[]
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationWarning[] = []
  const recoveryActions: RecoveryAction[] = []

  // Validate basic session structure
  validateSessionStructure(session, errors, warnings, recoveryActions)
  
  // Validate exam configuration
  validateExamConfig(session.examConfig, errors, warnings, recoveryActions)
  
  // Validate session state
  validateSessionState(session, errors, warnings, recoveryActions)
  
  // Validate answers if provided
  if (questions) {
    validateAnswers(session, questions, errors, warnings, recoveryActions)
  }
  
  // Validate timestamps
  validateTimestamps(session, errors, warnings, recoveryActions)
  
  // Validate data consistency
  validateDataConsistency(session, errors, warnings, recoveryActions)

  const criticalErrors = errors.filter(e => e.severity === 'critical')
  const canRecover = criticalErrors.length === 0

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    canRecover,
    recoveryActions: recoveryActions.length > 0 ? recoveryActions : undefined
  }
}

/**
 * Validate basic session structure
 */
function validateSessionStructure(
  session: ExamSession,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recoveryActions: RecoveryAction[]
) {
  // Check required fields
  if (!session.id) {
    errors.push({
      code: 'MISSING_SESSION_ID',
      message: 'Session ID is missing',
      field: 'id',
      severity: 'critical'
    })
  }

  if (!session.userId) {
    errors.push({
      code: 'MISSING_USER_ID',
      message: 'User ID is missing',
      field: 'userId',
      severity: 'critical'
    })
  }

  if (!session.examConfig) {
    errors.push({
      code: 'MISSING_EXAM_CONFIG',
      message: 'Exam configuration is missing',
      field: 'examConfig',
      severity: 'critical'
    })
  }

  // Validate session ID format
  if (session.id && !/^[a-zA-Z0-9_-]+$/.test(session.id)) {
    errors.push({
      code: 'INVALID_SESSION_ID_FORMAT',
      message: 'Session ID contains invalid characters',
      field: 'id',
      severity: 'major'
    })
    
    recoveryActions.push({
      type: 'fix',
      description: 'Generate new valid session ID',
      field: 'id'
    })
  }

  // Check for required collections
  if (!session.answers) {
    warnings.push({
      code: 'MISSING_ANSWERS_MAP',
      message: 'Answers map is missing, initializing empty map',
      field: 'answers'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Initialize empty answers map',
      field: 'answers',
      value: new Map()
    })
  }

  if (!session.bookmarkedQuestions) {
    warnings.push({
      code: 'MISSING_BOOKMARKS_SET',
      message: 'Bookmarked questions set is missing, initializing empty set',
      field: 'bookmarkedQuestions'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Initialize empty bookmarks set',
      field: 'bookmarkedQuestions',
      value: new Set()
    })
  }
}

/**
 * Validate exam configuration
 */
function validateExamConfig(
  config: ExamConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recoveryActions: RecoveryAction[]
) {
  if (!config) return

  // Validate exam type
  const validExamTypes = ['practice', 'test']
  if (!validExamTypes.includes(config.type)) {
    errors.push({
      code: 'INVALID_EXAM_TYPE',
      message: `Invalid exam type: ${config.type}`,
      field: 'examConfig.type',
      severity: 'major'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Set exam type to practice',
      field: 'examConfig.type',
      value: 'practice'
    })
  }

  // Validate exam subtype
  const validExamSubtypes = ['full-mock', 'domain-quiz', 'knowledge-area']
  if (!validExamSubtypes.includes(config.examType)) {
    errors.push({
      code: 'INVALID_EXAM_SUBTYPE',
      message: `Invalid exam subtype: ${config.examType}`,
      field: 'examConfig.examType',
      severity: 'major'
    })
  }

  // Validate time limit for test mode
  if (config.type === 'test') {
    if (!config.timeLimit || config.timeLimit <= 0) {
      errors.push({
        code: 'INVALID_TIME_LIMIT',
        message: 'Test mode requires a valid time limit',
        field: 'examConfig.timeLimit',
        severity: 'major'
      })
      
      recoveryActions.push({
        type: 'default',
        description: 'Set default time limit based on exam type',
        field: 'examConfig.timeLimit',
        value: getDefaultTimeLimit(config.examType)
      })
    }
  }

  // Validate settings
  if (!config.settings) {
    warnings.push({
      code: 'MISSING_EXAM_SETTINGS',
      message: 'Exam settings are missing, using defaults',
      field: 'examConfig.settings'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Initialize default exam settings',
      field: 'examConfig.settings',
      value: getDefaultExamSettings()
    })
  }
}

/**
 * Validate session state
 */
function validateSessionState(
  session: ExamSession,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recoveryActions: RecoveryAction[]
) {
  // Validate status
  const validStatuses = ['in-progress', 'completed', 'abandoned']
  if (!validStatuses.includes(session.status)) {
    errors.push({
      code: 'INVALID_SESSION_STATUS',
      message: `Invalid session status: ${session.status}`,
      field: 'status',
      severity: 'major'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Set status to in-progress',
      field: 'status',
      value: 'in-progress'
    })
  }

  // Validate current question index
  if (session.currentQuestionIndex < 0) {
    errors.push({
      code: 'INVALID_QUESTION_INDEX',
      message: 'Current question index cannot be negative',
      field: 'currentQuestionIndex',
      severity: 'major'
    })
    
    recoveryActions.push({
      type: 'fix',
      description: 'Reset current question index to 0',
      field: 'currentQuestionIndex',
      value: 0
    })
  }
}

/**
 * Validate answers against questions
 */
function validateAnswers(
  session: ExamSession,
  questions: Question[],
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recoveryActions: RecoveryAction[]
) {
  if (!session.answers || !questions) return

  const questionIds = new Set(questions.map(q => q.id))
  const invalidAnswers: string[] = []

  // Check each answer
  session.answers.forEach((answer, questionIndex) => {
    const question = questions[questionIndex]
    
    if (!question) {
      warnings.push({
        code: 'ANSWER_WITHOUT_QUESTION',
        message: `Answer exists for question index ${questionIndex} but no question found`,
        field: `answers[${questionIndex}]`
      })
      
      invalidAnswers.push(questionIndex.toString())
      return
    }

    // Validate answer structure
    if (!answer.questionId || !questionIds.has(answer.questionId)) {
      errors.push({
        code: 'INVALID_ANSWER_QUESTION_ID',
        message: `Answer has invalid question ID: ${answer.questionId}`,
        field: `answers[${questionIndex}].questionId`,
        severity: 'major'
      })
      
      invalidAnswers.push(questionIndex.toString())
    }

    // Validate selected options
    if (!Array.isArray(answer.selectedOptions)) {
      errors.push({
        code: 'INVALID_SELECTED_OPTIONS',
        message: 'Selected options must be an array',
        field: `answers[${questionIndex}].selectedOptions`,
        severity: 'major'
      })
      
      recoveryActions.push({
        type: 'fix',
        description: 'Convert selected options to array',
        field: `answers[${questionIndex}].selectedOptions`
      })
    } else {
      // Check if selected options are valid for the question
      const maxOption = question.options.length - 1
      const invalidOptions = answer.selectedOptions.filter(opt => opt < 0 || opt > maxOption)
      
      if (invalidOptions.length > 0) {
        errors.push({
          code: 'INVALID_OPTION_INDICES',
          message: `Invalid option indices: ${invalidOptions.join(', ')}`,
          field: `answers[${questionIndex}].selectedOptions`,
          severity: 'major'
        })
        
        recoveryActions.push({
          type: 'fix',
          description: 'Remove invalid option indices',
          field: `answers[${questionIndex}].selectedOptions`
        })
      }

      // Validate answer type constraints
      if (question.type === 'multiple-choice' && answer.selectedOptions.length > 1) {
        warnings.push({
          code: 'MULTIPLE_CHOICE_MULTIPLE_SELECTIONS',
          message: 'Multiple choice question has multiple selections',
          field: `answers[${questionIndex}].selectedOptions`,
          suggestion: 'Keep only the first selection'
        })
        
        recoveryActions.push({
          type: 'fix',
          description: 'Keep only first selection for multiple choice',
          field: `answers[${questionIndex}].selectedOptions`
        })
      }
    }

    // Validate timestamp
    if (!answer.timestamp || !(answer.timestamp instanceof Date)) {
      warnings.push({
        code: 'INVALID_ANSWER_TIMESTAMP',
        message: 'Answer timestamp is missing or invalid',
        field: `answers[${questionIndex}].timestamp`
      })
      
      recoveryActions.push({
        type: 'default',
        description: 'Set current timestamp',
        field: `answers[${questionIndex}].timestamp`,
        value: new Date()
      })
    }
  })

  // Add recovery action to remove invalid answers
  if (invalidAnswers.length > 0) {
    recoveryActions.push({
      type: 'remove',
      description: `Remove ${invalidAnswers.length} invalid answers`,
      field: 'answers'
    })
  }
}

/**
 * Validate timestamps
 */
function validateTimestamps(
  session: ExamSession,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recoveryActions: RecoveryAction[]
) {
  const now = new Date()

  // Validate start time
  if (!session.startTime || !(session.startTime instanceof Date)) {
    errors.push({
      code: 'INVALID_START_TIME',
      message: 'Session start time is missing or invalid',
      field: 'startTime',
      severity: 'major'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Set current time as start time',
      field: 'startTime',
      value: now
    })
  } else if (session.startTime > now) {
    errors.push({
      code: 'FUTURE_START_TIME',
      message: 'Session start time is in the future',
      field: 'startTime',
      severity: 'major'
    })
    
    recoveryActions.push({
      type: 'fix',
      description: 'Set current time as start time',
      field: 'startTime',
      value: now
    })
  }

  // Validate end time if present
  if (session.endTime) {
    if (!(session.endTime instanceof Date)) {
      errors.push({
        code: 'INVALID_END_TIME',
        message: 'Session end time is invalid',
        field: 'endTime',
        severity: 'major'
      })
      
      recoveryActions.push({
        type: 'remove',
        description: 'Remove invalid end time',
        field: 'endTime'
      })
    } else if (session.startTime && session.endTime < session.startTime) {
      errors.push({
        code: 'END_BEFORE_START',
        message: 'Session end time is before start time',
        field: 'endTime',
        severity: 'major'
      })
      
      recoveryActions.push({
        type: 'remove',
        description: 'Remove invalid end time',
        field: 'endTime'
      })
    }
  }
}

/**
 * Validate data consistency
 */
function validateDataConsistency(
  session: ExamSession,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  recoveryActions: RecoveryAction[]
) {
  // Check if completed session has end time
  if (session.status === 'completed' && !session.endTime) {
    warnings.push({
      code: 'COMPLETED_WITHOUT_END_TIME',
      message: 'Completed session is missing end time',
      field: 'endTime',
      suggestion: 'Set end time to current time'
    })
    
    recoveryActions.push({
      type: 'default',
      description: 'Set current time as end time',
      field: 'endTime',
      value: new Date()
    })
  }

  // Check if in-progress session has end time
  if (session.status === 'in-progress' && session.endTime) {
    warnings.push({
      code: 'IN_PROGRESS_WITH_END_TIME',
      message: 'In-progress session has end time',
      field: 'endTime',
      suggestion: 'Remove end time or update status'
    })
    
    recoveryActions.push({
      type: 'remove',
      description: 'Remove end time from in-progress session',
      field: 'endTime'
    })
  }
}

/**
 * Apply recovery actions to fix session data
 */
export function applyRecoveryActions(
  session: ExamSession,
  actions: RecoveryAction[]
): ExamSession {
  const fixedSession = { ...session }

  for (const action of actions) {
    try {
      switch (action.type) {
        case 'fix':
        case 'default':
          if (action.field && action.value !== undefined) {
            setNestedProperty(fixedSession, action.field, action.value)
          }
          break
          
        case 'remove':
          if (action.field) {
            removeNestedProperty(fixedSession, action.field)
          }
          break
          
        case 'reset':
          if (action.field) {
            resetNestedProperty(fixedSession, action.field)
          }
          break
      }
    } catch (error) {
      console.error(`Failed to apply recovery action for ${action.field}:`, error)
    }
  }

  return fixedSession
}

// Helper functions

function getDefaultTimeLimit(examType: string): number {
  switch (examType) {
    case 'full-mock': return 240 * 60 // 4 hours
    case 'domain-quiz': return 90 * 60 // 1.5 hours
    case 'knowledge-area': return 60 * 60 // 1 hour
    default: return 60 * 60
  }
}

function getDefaultExamSettings() {
  return {
    showTimer: true,
    showProgress: true,
    allowReview: true,
    showExplanations: false,
    allowBookmarks: true,
    shuffleQuestions: false,
    shuffleAnswers: false
  }
}

function setNestedProperty(obj: Record<string, any>, path: string, value: any) {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {}
    }
    current = current[key]
  }
  
  current[keys[keys.length - 1]] = value
}

function removeNestedProperty(obj: Record<string, any>, path: string) {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current)) return
    current = current[key]
  }
  
  delete current[keys[keys.length - 1]]
}

function resetNestedProperty(obj: Record<string, any>, path: string) {
  const keys = path.split('.')
  let current = obj
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (!(key in current)) return
    current = current[key]
  }
  
  const lastKey = keys[keys.length - 1]
  if (Array.isArray(current[lastKey])) {
    current[lastKey] = []
  } else if (current[lastKey] instanceof Map) {
    current[lastKey] = new Map()
  } else if (current[lastKey] instanceof Set) {
    current[lastKey] = new Set()
  } else if (typeof current[lastKey] === 'object') {
    current[lastKey] = {}
  } else {
    current[lastKey] = null
  }
}

/**
 * Quick validation check for critical errors only
 */
export function hasValidSessionStructure(session: unknown): boolean {
  return !!(
    session &&
    typeof session === 'object' &&
    session.id &&
    session.userId &&
    session.examConfig &&
    session.startTime
  )
}

/**
 * Sanitize session data by removing potentially harmful content
 */
export function sanitizeSessionData(session: ExamSession): ExamSession {
  const sanitized = { ...session }

  // Remove any functions or undefined values
  const cleanObject = (obj: any): any => {
    if (obj === null || obj === undefined) return obj
    if (typeof obj === 'function') return null
    if (Array.isArray(obj)) return obj.map(cleanObject)
    if (obj instanceof Date) return obj
    if (obj instanceof Map) return new Map([...obj.entries()].map(([k, v]) => [k, cleanObject(v)]))
    if (obj instanceof Set) return new Set([...obj].map(cleanObject))
    
    if (typeof obj === 'object') {
      const cleaned: any = {}
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined && typeof value !== 'function') {
          cleaned[key] = cleanObject(value)
        }
      }
      return cleaned
    }
    
    return obj
  }

  return cleanObject(sanitized)
}