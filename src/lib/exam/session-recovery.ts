/**
 * Session recovery utilities for handling browser crashes and unexpected exits
 */

import {
  ExamSession,
  Question,
  ExamResults,
  serializeExamSession,
  deserializeExamSession,
  validateSessionIntegrity,
  SerializableExamSession
} from './types'

export interface RecoveryData {
  session: ExamSession
  questions: Question[]
  lastSaved: Date
  recoveryId: string
  browserInfo: {
    userAgent: string
    timestamp: string
    url: string
  }
}

export interface RecoveryOptions {
  maxRecoveryAge?: number // hours
  validateIntegrity?: boolean
  autoCleanup?: boolean
}

export interface SessionRecoveryResult {
  success: boolean
  session?: ExamSession
  questions?: Question[]
  error?: string
  recoveryId?: string
  lastSaved?: Date
}

const RECOVERY_STORAGE_KEY = 'exam_recovery_'
const RECOVERY_INDEX_KEY = 'exam_recovery_index'
const DEFAULT_MAX_RECOVERY_AGE = 24 // 24 hours

/**
 * Save session data for recovery purposes
 */
export function saveSessionForRecovery(
  session: ExamSession,
  questions: Question[],
  options: RecoveryOptions = {}
): boolean {
  try {
    const recoveryId = generateRecoveryId()
    
    const recoveryData: RecoveryData = {
      session,
      questions,
      lastSaved: new Date(),
      recoveryId,
      browserInfo: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      }
    }

    // Validate session integrity before saving
    if (options.validateIntegrity !== false && !validateSessionIntegrity(session)) {
      console.error('Session integrity check failed, not saving for recovery')
      return false
    }

    // Serialize the session for storage
    const serializedSession = serializeExamSession(session)
    const storageData = {
      ...recoveryData,
      session: serializedSession
    }

    // Save to localStorage
    const storageKey = RECOVERY_STORAGE_KEY + session.id
    localStorage.setItem(storageKey, JSON.stringify(storageData))

    // Update recovery index
    updateRecoveryIndex(session.id, recoveryId)

    // Auto-cleanup old recovery data if enabled
    if (options.autoCleanup !== false) {
      cleanupOldRecoveryData(options.maxRecoveryAge)
    }

    return true
  } catch (error) {
    console.error('Failed to save session for recovery:', error)
    return false
  }
}

/**
 * Attempt to recover a session
 */
export function recoverSession(
  sessionId: string,
  options: RecoveryOptions = {}
): SessionRecoveryResult {
  try {
    const storageKey = RECOVERY_STORAGE_KEY + sessionId
    const recoveryDataStr = localStorage.getItem(storageKey)

    if (!recoveryDataStr) {
      return {
        success: false,
        error: 'No recovery data found for session'
      }
    }

    const recoveryData = JSON.parse(recoveryDataStr)
    
    // Check if recovery data is too old
    const lastSaved = new Date(recoveryData.lastSaved)
    const maxAge = options.maxRecoveryAge || DEFAULT_MAX_RECOVERY_AGE
    const cutoffTime = new Date(Date.now() - maxAge * 60 * 60 * 1000)
    
    if (lastSaved < cutoffTime) {
      return {
        success: false,
        error: 'Recovery data is too old'
      }
    }

    // Deserialize the session
    const session = deserializeExamSession(recoveryData.session as SerializableExamSession)
    
    // Validate session integrity if requested
    if (options.validateIntegrity !== false && !validateSessionIntegrity(session)) {
      return {
        success: false,
        error: 'Recovered session failed integrity validation'
      }
    }

    return {
      success: true,
      session,
      questions: recoveryData.questions,
      recoveryId: recoveryData.recoveryId,
      lastSaved
    }
  } catch (error) {
    console.error('Failed to recover session:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown recovery error'
    }
  }
}

/**
 * List all available recovery sessions
 */
export function listRecoverableSessions(): Array<{
  sessionId: string
  recoveryId: string
  lastSaved: Date
  examType: string
  status: string
}> {
  try {
    const index = getRecoveryIndex()
    const recoverableSessions = []

    for (const sessionId of index) {
      try {
        const storageKey = RECOVERY_STORAGE_KEY + sessionId
        const recoveryDataStr = localStorage.getItem(storageKey)
        
        if (recoveryDataStr) {
          const recoveryData = JSON.parse(recoveryDataStr)
          const session = recoveryData.session as SerializableExamSession
          
          recoverableSessions.push({
            sessionId,
            recoveryId: recoveryData.recoveryId,
            lastSaved: new Date(recoveryData.lastSaved),
            examType: session.examConfig.examType,
            status: session.status
          })
        }
      } catch (error) {
        console.warn(`Failed to parse recovery data for session ${sessionId}:`, error)
      }
    }

    // Sort by last saved (most recent first)
    return recoverableSessions.sort((a, b) => b.lastSaved.getTime() - a.lastSaved.getTime())
  } catch (error) {
    console.error('Failed to list recoverable sessions:', error)
    return []
  }
}

/**
 * Delete recovery data for a session
 */
export function deleteRecoveryData(sessionId: string): boolean {
  try {
    const storageKey = RECOVERY_STORAGE_KEY + sessionId
    localStorage.removeItem(storageKey)
    
    // Update recovery index
    const index = getRecoveryIndex()
    const updatedIndex = index.filter(id => id !== sessionId)
    localStorage.setItem(RECOVERY_INDEX_KEY, JSON.stringify(updatedIndex))
    
    return true
  } catch (error) {
    console.error('Failed to delete recovery data:', error)
    return false
  }
}

/**
 * Clean up old recovery data
 */
export function cleanupOldRecoveryData(maxAgeHours = DEFAULT_MAX_RECOVERY_AGE): number {
  try {
    const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000)
    const index = getRecoveryIndex()
    let cleanedCount = 0

    for (const sessionId of index) {
      try {
        const storageKey = RECOVERY_STORAGE_KEY + sessionId
        const recoveryDataStr = localStorage.getItem(storageKey)
        
        if (recoveryDataStr) {
          const recoveryData = JSON.parse(recoveryDataStr)
          const lastSaved = new Date(recoveryData.lastSaved)
          
          if (lastSaved < cutoffTime) {
            localStorage.removeItem(storageKey)
            cleanedCount++
          }
        }
      } catch (error) {
        console.warn(`Failed to check recovery data for session ${sessionId}:`, error)
        // Remove invalid entries
        localStorage.removeItem(RECOVERY_STORAGE_KEY + sessionId)
        cleanedCount++
      }
    }

    // Update index to remove cleaned sessions
    if (cleanedCount > 0) {
      const remainingSessions = []
      
      for (const sessionId of index) {
        const storageKey = RECOVERY_STORAGE_KEY + sessionId
        if (localStorage.getItem(storageKey)) {
          remainingSessions.push(sessionId)
        }
      }
      
      localStorage.setItem(RECOVERY_INDEX_KEY, JSON.stringify(remainingSessions))
    }

    return cleanedCount
  } catch (error) {
    console.error('Failed to cleanup old recovery data:', error)
    return 0
  }
}

/**
 * Check if a session has recovery data available
 */
export function hasRecoveryData(sessionId: string): boolean {
  try {
    const storageKey = RECOVERY_STORAGE_KEY + sessionId
    return localStorage.getItem(storageKey) !== null
  } catch {
    return false
  }
}

/**
 * Validate recovery data integrity
 */
export function validateRecoveryData(sessionId: string): boolean {
  try {
    const recoveryResult = recoverSession(sessionId, { validateIntegrity: true })
    return recoveryResult.success
  } catch {
    return false
  }
}

/**
 * Export recovery data for debugging or support
 */
export function exportRecoveryData(sessionId: string): string | null {
  try {
    const storageKey = RECOVERY_STORAGE_KEY + sessionId
    const recoveryDataStr = localStorage.getItem(storageKey)
    
    if (!recoveryDataStr) {
      return null
    }

    const recoveryData = JSON.parse(recoveryDataStr)
    
    // Add export metadata
    const exportData = {
      ...recoveryData,
      exportedAt: new Date().toISOString(),
      exportVersion: '1.0'
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('Failed to export recovery data:', error)
    return null
  }
}

/**
 * Import recovery data (for support/debugging purposes)
 */
export function importRecoveryData(data: string): boolean {
  try {
    const recoveryData = JSON.parse(data)
    
    if (!recoveryData.session || !recoveryData.questions) {
      throw new Error('Invalid recovery data format')
    }

    const sessionId = recoveryData.session.id
    const storageKey = RECOVERY_STORAGE_KEY + sessionId
    
    // Remove export metadata before storing
    const { exportedAt, exportVersion, ...cleanData } = recoveryData
    
    localStorage.setItem(storageKey, JSON.stringify(cleanData))
    updateRecoveryIndex(sessionId, recoveryData.recoveryId)
    
    return true
  } catch (error) {
    console.error('Failed to import recovery data:', error)
    return false
  }
}

// Helper functions

function generateRecoveryId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function getRecoveryIndex(): string[] {
  try {
    const indexStr = localStorage.getItem(RECOVERY_INDEX_KEY)
    return indexStr ? JSON.parse(indexStr) : []
  } catch {
    return []
  }
}

function updateRecoveryIndex(sessionId: string, recoveryId: string): void {
  try {
    const index = getRecoveryIndex()
    
    if (!index.includes(sessionId)) {
      index.push(sessionId)
      localStorage.setItem(RECOVERY_INDEX_KEY, JSON.stringify(index))
    }
  } catch (error) {
    console.error('Failed to update recovery index:', error)
  }
}

/**
 * Set up automatic session recovery on page load
 */
export function setupAutoRecovery(): void {
  // Check for unfinished sessions on page load
  window.addEventListener('load', () => {
    const recoverableSessions = listRecoverableSessions()
    
    if (recoverableSessions.length > 0) {
      console.log(`Found ${recoverableSessions.length} recoverable exam sessions`)
      
      // Store recovery info for the app to handle
      sessionStorage.setItem('exam_recovery_available', JSON.stringify(recoverableSessions))
    }
  })

  // Set up beforeunload handler to save current session
  window.addEventListener('beforeunload', () => {
    // This will be handled by the exam components themselves
    // We just ensure any pending saves are completed
    try {
      // Force save any pending exam data
      const event = new CustomEvent('exam:forceSave')
      window.dispatchEvent(event)
    } catch (error) {
      console.error('Failed to force save on beforeunload:', error)
    }
  })
}

/**
 * Get recovery information for display to user
 */
export function getRecoveryInfo(sessionId: string): {
  canRecover: boolean
  lastSaved?: Date
  questionsAnswered?: number
  totalQuestions?: number
  examType?: string
} {
  try {
    const recoveryResult = recoverSession(sessionId, { validateIntegrity: false })
    
    if (!recoveryResult.success || !recoveryResult.session) {
      return { canRecover: false }
    }

    return {
      canRecover: true,
      lastSaved: recoveryResult.lastSaved,
      questionsAnswered: recoveryResult.session.answers.size,
      totalQuestions: recoveryResult.questions?.length,
      examType: recoveryResult.session.examConfig.examType
    }
  } catch {
    return { canRecover: false }
  }
}