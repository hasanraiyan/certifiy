/**
 * Advanced data validation utilities for exam data integrity
 * Handles corrupted data detection and repair
 */

import {
  ExamSession,
  Question,
  Answer,
  ExamConfig,
  ExamResults,
  validateExamSession,
  validateQuestion,
  validateAnswer,
  validateExamConfig,
  validateExamResults,
  ValidationError
} from './types'

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
  warnings: string[]
  repairableIssues: RepairableIssue[]
}

export interface RepairableIssue {
  type: 'missing_answer' | 'invalid_timestamp' | 'corrupted_bookmark' | 'invalid_index' | 'missing_question'
  description: string
  severity: 'low' | 'medium' | 'high'
  canAutoRepair: boolean
  repairAction?: () => void
}

export interface DataIntegrityReport {
  sessionIntegrity: ValidationResult
  questionsIntegrity: ValidationResult
  answersIntegrity: ValidationResult
  overallHealth: 'healthy' | 'warning' | 'corrupted' | 'critical'
  repairRecommendations: string[]
}

/**
 * Comprehensive validation of exam session data
 */
export function validateExamData(
  session: ExamSession,
  questions: Question[],
  strictMode = false
): DataIntegrityReport {
  const sessionValidation = validateSessionData(session, questions, strictMode)
  const questionsValidation = validateQuestionsData(questions, strictMode)
  const answersValidation = validateAnswersData(session, questions, strictMode)

  // Determine overall health
  let overallHealth: 'healthy' | 'warning' | 'corrupted' | 'critical' = 'healthy'
  
  const totalErrors = sessionValidation.errors.length + 
                     questionsValidation.errors.length + 
                     answersValidation.errors.length

  const totalWarnings = sessionValidation.warnings.length + 
                       questionsValidation.warnings.length + 
                       answersValidation.warnings.length

  if (totalErrors > 0) {
    overallHealth = totalErrors > 5 ? 'critical' : 'corrupted'
  } else if (totalWarnings > 0) {
    overallHealth = 'warning'
  }

  // Generate repair recommendations
  const repairRecommendations = generateRepairRecommendations(
    sessionValidation,
    questionsValidation,
    answersValidation
  )

  return {
    sessionIntegrity: sessionValidation,
    questionsIntegrity: questionsValidation,
    answersIntegrity: answersValidation,
    overallHealth,
    repairRecommendations
  }
}

/**
 * Validate session data integrity
 */
function validateSessionData(
  session: ExamSession,
  questions: Question[],
  strictMode: boolean
): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: string[] = []
  const repairableIssues: RepairableIssue[] = []

  try {
    // Basic session validation
    validateExamSession(session)
  } catch (error) {
    if (error instanceof ValidationError) {
      errors.push(error)
    }
  }

  // Check session consistency
  if (session.currentQuestionIndex >= questions.length) {
    const issue: RepairableIssue = {
      type: 'invalid_index',
      description: `Current question index (${session.currentQuestionIndex}) exceeds questions array length (${questions.length})`,
      severity: 'high',
      canAutoRepair: true,
      repairAction: () => {
        session.currentQuestionIndex = Math.min(session.currentQuestionIndex, questions.length - 1)
      }
    }
    repairableIssues.push(issue)
  }

  if (session.currentQuestionIndex < 0) {
    const issue: RepairableIssue = {
      type: 'invalid_index',
      description: 'Current question index is negative',
      severity: 'medium',
      canAutoRepair: true,
      repairAction: () => {
        session.currentQuestionIndex = 0
      }
    }
    repairableIssues.push(issue)
  }

  // Check bookmark integrity
  const invalidBookmarks = Array.from(session.bookmarkedQuestions).filter(
    index => index < 0 || index >= questions.length
  )

  if (invalidBookmarks.length > 0) {
    const issue: RepairableIssue = {
      type: 'corrupted_bookmark',
      description: `Found ${invalidBookmarks.length} invalid bookmark indices`,
      severity: 'low',
      canAutoRepair: true,
      repairAction: () => {
        invalidBookmarks.forEach(index => session.bookmarkedQuestions.delete(index))
      }
    }
    repairableIssues.push(issue)
  }

  // Check time consistency
  if (session.endTime && session.startTime && session.endTime < session.startTime) {
    warnings.push('End time is before start time')
  }

  // Check answer indices consistency
  const invalidAnswerIndices = Array.from(session.answers.keys()).filter(
    index => index < 0 || index >= questions.length
  )

  if (invalidAnswerIndices.length > 0) {
    const issue: RepairableIssue = {
      type: 'invalid_index',
      description: `Found ${invalidAnswerIndices.length} answers with invalid question indices`,
      severity: 'medium',
      canAutoRepair: true,
      repairAction: () => {
        invalidAnswerIndices.forEach(index => session.answers.delete(index))
      }
    }
    repairableIssues.push(issue)
  }

  // Strict mode checks
  if (strictMode) {
    // Check for missing required fi