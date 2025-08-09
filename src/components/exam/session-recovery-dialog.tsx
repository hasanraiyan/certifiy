"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { AlertTriangleIcon, ClockIcon, BookOpenIcon, RefreshCwIcon, TrashIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { 
  recoverSession, 
  listRecoverableSessions, 
  deleteRecoveryData, 
  getRecoveryInfo,
  cleanupOldRecoveryData 
} from "@/lib/exam/session-recovery"
import { ExamSession, Question } from "@/lib/exam/types"

interface SessionRecoveryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSessionRecovered: (session: ExamSession, questions: Question[]) => void
  onNewSession: () => void
  currentSessionId?: string
}

interface RecoverableSessionInfo {
  sessionId: string
  recoveryId: string
  lastSaved: Date
  examType: string
  status: string
  questionsAnswered?: number
  totalQuestions?: number
  canRecover: boolean
}

/**
 * Dialog for recovering interrupted exam sessions
 * Handles browser crashes, accidental navigation, and other session interruptions
 */
export function SessionRecoveryDialog({
  isOpen,
  onClose,
  onSessionRecovered,
  onNewSession,
  currentSessionId
}: SessionRecoveryDialogProps) {
  const [recoverableSessions, setRecoverableSessions] = useState<RecoverableSessionInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  // Load recoverable sessions when dialog opens
  useEffect(() => {
    if (isOpen) {
      loadRecoverableSessions()
    }
  }, [isOpen])

  const loadRecoverableSessions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Clean up old recovery data first
      const cleanedCount = cleanupOldRecoveryData(24) // 24 hours
      if (cleanedCount > 0) {
        console.log(`Cleaned up ${cleanedCount} old recovery sessions`)
      }

      // Get list of recoverable sessions
      const sessions = listRecoverableSessions()
      
      // Get detailed info for each session
      const sessionInfoPromises = sessions.map(async (session) => {
        const info = getRecoveryInfo(session.sessionId)
        return {
          ...session,
          ...info
        }
      })

      const sessionInfos = await Promise.all(sessionInfoPromises)
      
      // Filter out sessions that can't be recovered
      const validSessions = sessionInfos.filter(session => session.canRecover)
      
      setRecoverableSessions(validSessions)
      
      // Auto-select current session if available
      if (currentSessionId && validSessions.some(s => s.sessionId === currentSessionId)) {
        setSelectedSessionId(currentSessionId)
      } else if (validSessions.length === 1) {
        setSelectedSessionId(validSessions[0].sessionId)
      }
    } catch (err) {
      console.error('Failed to load recoverable sessions:', err)
      setError('Failed to load recovery data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecoverSession = async (sessionId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const recoveryResult = recoverSession(sessionId, {
        validateIntegrity: true,
        maxRecoveryAge: 24
      })

      if (recoveryResult.success && recoveryResult.session && recoveryResult.questions) {
        onSessionRecovered(recoveryResult.session, recoveryResult.questions)
        onClose()
      } else {
        setError(recoveryResult.error || 'Failed to recover session')
      }
    } catch (err) {
      console.error('Failed to recover session:', err)
      setError('An unexpected error occurred while recovering the session')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteSession = async (sessionId: string) => {
    try {
      const deleted = deleteRecoveryData(sessionId)
      if (deleted) {
        setRecoverableSessions(prev => prev.filter(s => s.sessionId !== sessionId))
        if (selectedSessionId === sessionId) {
          setSelectedSessionId(null)
        }
      }
    } catch (err) {
      console.error('Failed to delete recovery data:', err)
    }
  }

  const handleStartNewSession = () => {
    onNewSession()
    onClose()
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  const getExamTypeLabel = (examType: string) => {
    switch (examType) {
      case 'full-mock': return 'Full Mock Exam'
      case 'domain-quiz': return 'Domain Quiz'
      case 'knowledge-area': return 'Knowledge Area Quiz'
      default: return examType
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'abandoned': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="h-5 w-5 text-orange-600" />
            Session Recovery
          </DialogTitle>
          <DialogDescription>
            We found interrupted exam sessions that can be recovered. Choose an option below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <RefreshCwIcon className="h-4 w-4 animate-spin" />
                <span>Loading recovery data...</span>
              </div>
            </div>
          ) : recoverableSessions.length === 0 ? (
            <div className="text-center py-8">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions to Recover</h3>
              <p className="text-gray-600 mb-4">
                No interrupted exam sessions were found that can be recovered.
              </p>
              <Button onClick={handleStartNewSession}>
                Start New Session
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold">Recoverable Sessions</h3>
                
                {recoverableSessions.map((session) => (
                  <Card 
                    key={session.sessionId}
                    className={`cursor-pointer transition-colors ${
                      selectedSessionId === session.sessionId 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedSessionId(session.sessionId)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium">{getExamTypeLabel(session.examType)}</h4>
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="h-3 w-3" />
                              <span>{formatTimeAgo(session.lastSaved)}</span>
                            </div>
                            
                            {session.questionsAnswered !== undefined && session.totalQuestions && (
                              <div className="flex items-center gap-1">
                                <BookOpenIcon className="h-3 w-3" />
                                <span>
                                  {session.questionsAnswered} of {session.totalQuestions} answered
                                </span>
                              </div>
                            )}
                          </div>

                          {session.questionsAnswered !== undefined && session.totalQuestions && (
                            <div className="mt-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ 
                                    width: `${(session.questionsAnswered / session.totalQuestions) * 100}%` 
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSession(session.sessionId)
                          }}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <Button
                  onClick={() => selectedSessionId && handleRecoverSession(selectedSessionId)}
                  disabled={!selectedSessionId || isLoading}
                  className="flex-1"
                >
                  <RefreshCwIcon className="h-4 w-4 mr-2" />
                  Recover Selected Session
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleStartNewSession}
                  className="flex-1"
                >
                  Start New Session
                </Button>
              </div>

              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Note:</strong> Recovering a session will restore your progress from the last save point. 
                  Any unsaved changes may be lost.
                </AlertDescription>
              </Alert>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Hook for managing session recovery
 */
export function useSessionRecovery() {
  const [hasRecoverableSessions, setHasRecoverableSessions] = useState(false)
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)

  // Check for recoverable sessions on mount
  useEffect(() => {
    const checkRecoverableSessions = () => {
      try {
        const sessions = listRecoverableSessions()
        setHasRecoverableSessions(sessions.length > 0)
        
        // Auto-show dialog if we have recoverable sessions
        if (sessions.length > 0) {
          setShowRecoveryDialog(true)
        }
      } catch (error) {
        console.error('Failed to check recoverable sessions:', error)
      }
    }

    checkRecoverableSessions()
  }, [])

  const openRecoveryDialog = () => setShowRecoveryDialog(true)
  const closeRecoveryDialog = () => setShowRecoveryDialog(false)

  return {
    hasRecoverableSessions,
    showRecoveryDialog,
    openRecoveryDialog,
    closeRecoveryDialog
  }
}