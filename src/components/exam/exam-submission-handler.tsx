"use client"

import * as React from "react"
import { useState, useCallback, useEffect } from "react"
import { AlertTriangleIcon, ClockIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { ExamSession, Question, Answer } from "@/lib/exam/types"
import { usePageVisibility } from "@/hooks/usePageVisibility"

export interface SubmissionAttempt {
  id: string
  timestamp: Date
  success: boolean
  error?: string
  retryCount: number
}

export interface SubmissionValidation {
  canSubmit: boolean
  warnings: string[]
  errors: string[]
  unansweredQuestions: number[]
  totalQuestions: number
  answeredQuestions: number
}

interface ExamSubmissionHandlerProps {
  examSession: ExamSession
  questions: Question[]
  onSubmissionSuccess: (sessionId: string) => void
  onSubmissionError: (error: string) => void
  isSubmitting?: boolean
  autoSubmitOnTimeExpiry?: boolean
  requireConfirmation?: boolean
  allowPartialSubmission?: boolean
}

/**
 * Comprehensive exam submission handler with edge case management
 * Handles confirmation dialogs, validation, retry logic, and auto-submission
 */
export function ExamSubmissionHandler({
  examSession,
  questions,
  onSubmissionSuccess,
  onSubmissionError,
  isSubmitting = false,
  autoSubmitOnTimeExpiry = true,
  requireConfirmation = true,
  allowPartialSubmission = true
}: ExamSubmissionHandlerProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showAbandonDialog, setShowAbandonDialog] = useState(false)
  const [submissionAttempts, setSubmissionAttempts] = useState<SubmissionAttempt[]>([])
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [lastValidation, setLastValidation] = useState<SubmissionValidation | null>(null)

  const maxRetries = 3
  const retryDelay = 2000 // 2 seconds

  // Page visibility for detecting navigation attempts
  const { actions: visibilityActions } = usePageVisibility({
    warnOnNavigation: true
  })

  // Validate submission readiness
  const validateSubmission = useCallback((): SubmissionValidation => {
    const answeredQuestions = Array.from(examSession.answers.keys())
    const unansweredQuestions = questions
      .map((_, index) => index)
      .filter(index => !examSession.answers.has(index))

    const warnings: string[] = []
    const errors: string[] = []

    // Check for unanswered questions
    if (unansweredQuestions.length > 0) {
      if (!allowPartialSubmission) {
        errors.push(`You must answer all ${questions.length} questions before submitting.`)
      } else {
        warnings.push(`${unansweredQuestions.length} questions remain unanswered.`)
      }
    }

    // Check for incomplete answers
    const incompleteAnswers = answeredQuestions.filter(index => {
      const answer = examSession.answers.get(index)
      return !answer || answer.selectedOptions.length === 0
    })

    if (incompleteAnswers.length > 0) {
      warnings.push(`${incompleteAnswers.length} questions have incomplete answers.`)
    }

    // Check session status
    if (examSession.status === 'completed') {
      errors.push('This exam has already been submitted.')
    }

    if (examSession.status === 'abandoned') {
      warnings.push('This exam was previously abandoned. Submitting will restore it.')
    }

    const canSubmit = errors.length === 0 && (allowPartialSubmission || unansweredQuestions.length === 0)

    return {
      canSubmit,
      warnings,
      errors,
      unansweredQuestions,
      totalQuestions: questions.length,
      answeredQuestions: answeredQuestions.length
    }
  }, [examSession, questions, allowPartialSubmission])

  // Handle submission attempt
  const attemptSubmission = useCallback(async (force = false): Promise<boolean> => {
    const attemptId = Date.now().toString()
    const timestamp = new Date()

    try {
      // Validate before submission
      const validation = validateSubmission()
      setLastValidation(validation)

      if (!validation.canSubmit && !force) {
        const error = validation.errors.join(' ')
        setSubmissionAttempts(prev => [...prev, {
          id: attemptId,
          timestamp,
          success: false,
          error,
          retryCount
        }])
        onSubmissionError(error)
        return false
      }

      // Simulate submission process (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In a real implementation, this would be an API call
      const submissionData = {
        sessionId: examSession.id,
        answers: Array.from(examSession.answers.entries()),
        submittedAt: timestamp,
        timeSpent: examSession.endTime ? 
          examSession.endTime.getTime() - examSession.startTime.getTime() : 
          timestamp.getTime() - examSession.startTime.getTime()
      }

      // Simulate potential network failure for testing
      if (Math.random() < 0.1 && retryCount === 0) {
        throw new Error('Network error during submission')
      }

      // Success
      setSubmissionAttempts(prev => [...prev, {
        id: attemptId,
        timestamp,
        success: true,
        retryCount
      }])

      onSubmissionSuccess(examSession.id)
      return true

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown submission error'
      
      setSubmissionAttempts(prev => [...prev, {
        id: attemptId,
        timestamp,
        success: false,
        error: errorMessage,
        retryCount
      }])

      // Auto-retry if we haven't exceeded max retries
      if (retryCount < maxRetries) {
        setIsRetrying(true)
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
          setIsRetrying(false)
          attemptSubmission(force)
        }, retryDelay * (retryCount + 1)) // Exponential backoff
      } else {
        onSubmissionError(errorMessage)
      }

      return false
    }
  }, [examSession, validateSubmission, retryCount, maxRetries, onSubmissionSuccess, onSubmissionError])

  // Handle manual submission
  const handleSubmit = useCallback(() => {
    const validation = validateSubmission()
    setLastValidation(validation)

    if (!validation.canSubmit) {
      // Show errors immediately
      return
    }

    if (requireConfirmation && (validation.warnings.length > 0 || validation.unansweredQuestions.length > 0)) {
      setShowConfirmDialog(true)
    } else {
      attemptSubmission()
    }
  }, [validateSubmission, requireConfirmation, attemptSubmission])

  // Handle confirmed submission
  const handleConfirmedSubmit = useCallback(() => {
    setShowConfirmDialog(false)
    attemptSubmission(true)
  }, [attemptSubmission])

  // Handle exam abandonment
  const handleAbandon = useCallback(() => {
    setShowAbandonDialog(true)
  }, [])

  const handleConfirmedAbandon = useCallback(() => {
    setShowAbandonDialog(false)
    // Update session status to abandoned
    const abandonedSession = {
      ...examSession,
      status: 'abandoned' as const,
      endTime: new Date()
    }
    
    // Save abandoned state and navigate away
    onSubmissionError('Exam abandoned by user')
  }, [examSession, onSubmissionError])

  // Auto-submit on time expiry
  useEffect(() => {
    if (autoSubmitOnTimeExpiry && examSession.examConfig.type === 'test') {
      const handleTimeExpiry = () => {
        console.log('Time expired, auto-submitting exam')
        attemptSubmission(true)
      }

      // Listen for timer expiry events
      window.addEventListener('exam:timeExpired', handleTimeExpiry)
      
      return () => {
        window.removeEventListener('exam:timeExpired', handleTimeExpiry)
      }
    }
  }, [autoSubmitOnTimeExpiry, examSession.examConfig.type, attemptSubmission])

  // Prevent navigation during submission
  useEffect(() => {
    visibilityActions.preventNavigation(isSubmitting || isRetrying)
  }, [isSubmitting, isRetrying, visibilityActions])

  // Get submission status
  const getSubmissionStatus = () => {
    const lastAttempt = submissionAttempts[submissionAttempts.length - 1]
    
    if (isSubmitting || isRetrying) {
      return 'submitting'
    }
    
    if (lastAttempt?.success) {
      return 'success'
    }
    
    if (lastAttempt && !lastAttempt.success && retryCount >= maxRetries) {
      return 'failed'
    }
    
    return 'ready'
  }

  const submissionStatus = getSubmissionStatus()
  const validation = lastValidation || validateSubmission()

  return (
    <>
      {/* Submission Status Display */}
      <div className="space-y-4">
        {/* Validation Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5" />
              Submission Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Questions Answered:</span>
              <Badge variant={validation.answeredQuestions === validation.totalQuestions ? "default" : "secondary"}>
                {validation.answeredQuestions} / {validation.totalQuestions}
              </Badge>
            </div>
            
            <Progress 
              value={(validation.answeredQuestions / validation.totalQuestions) * 100} 
              className="w-full"
            />

            {validation.warnings.length > 0 && (
              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validation.errors.length > 0 && (
              <Alert variant="destructive">
                <XCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Submission Attempts */}
        {submissionAttempts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Submission History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {submissionAttempts.map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {attempt.success ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-4 w-4 text-red-600" />
                      )}
                      <span className="text-sm">
                        {attempt.timestamp.toLocaleTimeString()}
                      </span>
                      {attempt.retryCount > 0 && (
                        <Badge variant="outline">Retry {attempt.retryCount}</Badge>
                      )}
                    </div>
                    {attempt.error && (
                      <span className="text-sm text-red-600">{attempt.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!validation.canSubmit || isSubmitting || isRetrying}
            className="flex-1"
          >
            {isSubmitting || isRetrying ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                {isRetrying ? `Retrying... (${retryCount}/${maxRetries})` : 'Submitting...'}
              </>
            ) : (
              'Submit Exam'
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={handleAbandon}
            disabled={isSubmitting || isRetrying}
          >
            Abandon Exam
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Please review your submission before proceeding.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Total Questions:</strong> {validation.totalQuestions}
              </div>
              <div>
                <strong>Answered:</strong> {validation.answeredQuestions}
              </div>
              <div>
                <strong>Unanswered:</strong> {validation.unansweredQuestions.length}
              </div>
              <div>
                <strong>Completion:</strong> {Math.round((validation.answeredQuestions / validation.totalQuestions) * 100)}%
              </div>
            </div>

            {validation.warnings.length > 0 && (
              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validation.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground">
              Once submitted, you cannot make changes to your answers. Are you sure you want to proceed?
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmedSubmit}>
              Yes, Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Abandon Confirmation Dialog */}
      <Dialog open={showAbandonDialog} onOpenChange={setShowAbandonDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Abandon Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to abandon this exam?
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription>
                <strong>Warning:</strong> Abandoning the exam will end your session. 
                Your progress will be saved, but you may not be able to resume depending on exam settings.
              </AlertDescription>
            </Alert>

            <div className="text-sm">
              <p><strong>Current Progress:</strong> {validation.answeredQuestions} of {validation.totalQuestions} questions answered</p>
              <p><strong>Time Spent:</strong> {Math.round((Date.now() - examSession.startTime.getTime()) / 60000)} minutes</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAbandonDialog(false)}>
              Continue Exam
            </Button>
            <Button variant="destructive" onClick={handleConfirmedAbandon}>
              Abandon Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

/**
 * Hook for managing exam submission state
 */
export function useExamSubmission(examSession: ExamSession, questions: Question[]) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [submissionSuccess, setSubmissionSuccess] = useState(false)

  const handleSubmissionStart = useCallback(() => {
    setIsSubmitting(true)
    setSubmissionError(null)
    setSubmissionSuccess(false)
  }, [])

  const handleSubmissionSuccess = useCallback((sessionId: string) => {
    setIsSubmitting(false)
    setSubmissionSuccess(true)
    setSubmissionError(null)
  }, [])

  const handleSubmissionError = useCallback((error: string) => {
    setIsSubmitting(false)
    setSubmissionError(error)
    setSubmissionSuccess(false)
  }, [])

  const resetSubmissionState = useCallback(() => {
    setIsSubmitting(false)
    setSubmissionError(null)
    setSubmissionSuccess(false)
  }, [])

  return {
    isSubmitting,
    submissionError,
    submissionSuccess,
    handleSubmissionStart,
    handleSubmissionSuccess,
    handleSubmissionError,
    resetSubmissionState
  }
}