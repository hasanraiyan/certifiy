"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ClockIcon, 
  AlertTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { QuestionDisplay } from "./question-display"
import { QuestionNavigator } from "./question-navigator"
import { TimerDisplay } from "./timer-display"
import { ProgressTracker } from "./progress-tracker"
import { ExamReview } from "./exam-review"
import { useExamState } from "@/hooks/useExamState"
import { useTimer } from "@/hooks/useTimer"
import { useExamPersistence } from "@/hooks/useExamPersistence"
import { Question, ExamConfig, Answer } from "@/lib/exam/types"

interface TestModeProps {
  sessionId: string
  examConfig: ExamConfig
  questions: Question[]
  onExamComplete?: (sessionId: string) => void
}

export function TestMode({
  sessionId,
  examConfig,
  questions,
  onExamComplete
}: TestModeProps) {
  const router = useRouter()
  const { data: examState, actions: examActions } = useExamState()
  const { saveProgress, loadProgress } = useExamPersistence(sessionId)
  
  // Timer setup
  const { data: timerData, actions: timerActions } = useTimer({
    initialTimeLimit: examConfig.timeLimit || 0,
    warningThresholds: [600, 300], // 10 minutes, 5 minutes
    onTimeExpired: handleTimeExpired,
    onWarning: handleTimerWarning,
    persistKey: sessionId
  })

  // Local state
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
  const [isInitialized, setIsInitialized] = useState(false)
  const [showTimeWarning, setShowTimeWarning] = useState(false)
  const [warningMessage, setWarningMessage] = useState("")
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)

  // Handle timer expiration
  function handleTimeExpired() {
    // Auto-submit exam when time expires
    handleAutoSubmit()
  }

  // Handle timer warnings
  function handleTimerWarning(warning: any) {
    setWarningMessage(warning.message)
    setShowTimeWarning(true)
    
    // Auto-hide warning after 5 seconds
    setTimeout(() => {
      setShowTimeWarning(false)
    }, 5000)
  }

  // Initialize exam session
  useEffect(() => {
    if (!isInitialized && questions.length > 0) {
      // Try to load existing progress first
      const loaded = loadProgress()
      
      if (!loaded) {
        // Start new exam session
        examActions.startExam(examConfig, questions)
        
        // Start timer
        if (examConfig.timeLimit) {
          timerActions.start()
        }
      } else {
        // Resume timer if exam was in progress
        if (examState.isExamActive && !timerData.isExpired) {
          timerActions.resume()
        }
      }
      
      setIsInitialized(true)
    }
  }, [examConfig, questions, loadProgress, examActions, timerActions, isInitialized, examState.isExamActive, timerData.isExpired])

  // Update local state when current question changes
  useEffect(() => {
    if (examState.currentQuestion) {
      setQuestionStartTime(new Date())
    }
  }, [examState.currentQuestionIndex, examState.currentQuestion])

  // Auto-save progress periodically
  useEffect(() => {
    if (examState.isExamActive) {
      const interval = setInterval(() => {
        saveProgress()
      }, 30000) // Save every 30 seconds

      return () => clearInterval(interval)
    }
  }, [examState.isExamActive, saveProgress])

  const handleAnswerSelect = useCallback((answer: Answer) => {
    if (!examState.currentQuestion) return

    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - questionStartTime.getTime()) / 1000)
    
    // Save the answer
    examActions.saveAnswer(
      examState.currentQuestion.id,
      answer.selectedOptions,
      timeSpent
    )
  }, [examState.currentQuestion, examActions, questionStartTime])

  const handleBookmarkToggle = useCallback(() => {
    if (examConfig.settings.allowBookmarks) {
      examActions.toggleBookmark(examState.currentQuestionIndex)
    }
  }, [examActions, examState.currentQuestionIndex, examConfig.settings.allowBookmarks])

  const handleNextQuestion = useCallback(() => {
    if (examState.currentQuestionIndex < examState.totalQuestions - 1) {
      examActions.goToNextQuestion()
    }
  }, [examActions, examState.currentQuestionIndex, examState.totalQuestions])

  const handlePreviousQuestion = useCallback(() => {
    if (examState.currentQuestionIndex > 0) {
      examActions.goToPreviousQuestion()
    }
  }, [examActions, examState.currentQuestionIndex])

  const handleQuestionNavigate = useCallback((questionIndex: number) => {
    examActions.goToQuestion(questionIndex)
  }, [examActions])

  const handleEnterReview = useCallback(() => {
    setIsReviewMode(true)
  }, [])

  const handleExitReview = useCallback(() => {
    setIsReviewMode(false)
  }, [])

  const handleReviewQuestionSelect = useCallback((questionIndex: number) => {
    setIsReviewMode(false)
    examActions.goToQuestion(questionIndex)
  }, [examActions])

  const handleSubmitExam = useCallback(() => {
    setShowSubmitDialog(true)
  }, [])

  const handleConfirmSubmit = useCallback(async () => {
    setIsSubmitting(true)
    
    try {
      // Stop timer
      timerActions.pause()
      
      // Complete exam
      examActions.completeExam()
      
      // Save final progress
      saveProgress()
      
      // Navigate to results
      if (onExamComplete) {
        onExamComplete(sessionId)
      } else {
        router.push(`/results/${sessionId}`)
      }
    } catch (error) {
      console.error('Failed to submit exam:', error)
      setIsSubmitting(false)
    }
  }, [timerActions, examActions, saveProgress, onExamComplete, sessionId, router])

  const handleAutoSubmit = useCallback(async () => {
    // Auto-submit when time expires
    try {
      examActions.completeExam()
      saveProgress()
      
      if (onExamComplete) {
        onExamComplete(sessionId)
      } else {
        router.push(`/results/${sessionId}?autoSubmit=true`)
      }
    } catch (error) {
      console.error('Failed to auto-submit exam:', error)
    }
  }, [examActions, saveProgress, onExamComplete, sessionId, router])

  // Don't render until initialized
  if (!isInitialized || !examState.session || !examState.currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading test session...</p>
        </div>
      </div>
    )
  }

  const currentAnswer = examState.session.answers.get(examState.currentQuestionIndex)
  const isBookmarked = examState.bookmarkedQuestions.includes(examState.currentQuestionIndex)
  const canGoNext = examState.currentQuestionIndex < examState.totalQuestions - 1
  const canGoPrevious = examState.currentQuestionIndex > 0
  const isLastQuestion = examState.currentQuestionIndex === examState.totalQuestions - 1

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Time Warning Alert */}
        {showTimeWarning && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertTriangleIcon className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Time Warning:</strong> {warningMessage}
            </AlertDescription>
          </Alert>
        )}

        {/* Critical Time Warning */}
        {timerData.timeRemaining <= 300 && timerData.timeRemaining > 0 && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <XCircleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Critical:</strong> Only {timerData.timeRemainingFormatted} remaining! The exam will auto-submit when time expires.
            </AlertDescription>
          </Alert>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Test Mode</h1>
              <Badge variant="destructive" className="bg-red-100 text-red-800">
                Timed Exam
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Session: {sessionId}
            </div>
          </div>

          {/* Progress and Timer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ProgressTracker
              currentQuestion={examState.currentQuestionIndex + 1}
              totalQuestions={examState.totalQuestions}
              answeredQuestions={examState.answeredQuestions}
              showTimeRemaining={false}
            />
            
            <div className="flex justify-end">
              <TimerDisplay
                timeRemaining={timerData.timeRemaining}
                isTestMode={true}
                onTimeExpired={handleTimeExpired}
                showWarnings={true}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigator */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionNavigator
                  questions={questions}
                  currentQuestionIndex={examState.currentQuestionIndex}
                  answeredQuestions={new Set(Array.from(examState.session.answers.keys()))}
                  bookmarkedQuestions={new Set(examState.bookmarkedQuestions)}
                  onQuestionSelect={handleQuestionNavigate}
                />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {isReviewMode ? (
              /* Review Mode */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Review Your Answers</h2>
                  <Button variant="outline" onClick={handleExitReview}>
                    Back to Questions
                  </Button>
                </div>
                <ExamReview
                  questions={questions}
                  answers={examState.session?.answers || new Map()}
                  bookmarkedQuestions={new Set(examState.bookmarkedQuestions)}
                  onQuestionSelect={handleReviewQuestionSelect}
                  onSubmit={handleSubmitExam}
                  canSubmit={examState.answeredQuestions === examState.totalQuestions}
                />
              </div>
            ) : (
              /* Normal Question Mode */
              <>
                {/* Test Mode Info */}
                <Alert>
                  <ClockIcon className="h-4 w-4" />
                  <AlertDescription>
                    Test Mode: This is a timed exam. No explanations will be shown during the test. You can review your answers before submitting.
                  </AlertDescription>
                </Alert>

            {/* Question Display */}
            <QuestionDisplay
              question={examState.currentQuestion}
              selectedAnswer={currentAnswer || null}
              onAnswerSelect={handleAnswerSelect}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              showExplanation={false} // Never show explanations in test mode
              questionNumber={examState.currentQuestionIndex + 1}
            />

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={!canGoPrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Question {examState.currentQuestionIndex + 1} of {examState.totalQuestions}
                </span>
                
                {examState.hasUnansweredQuestions && (
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    {examState.totalQuestions - examState.answeredQuestions} unanswered
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                {canGoNext ? (
                  <Button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={handleEnterReview}
                      className="flex items-center gap-2"
                    >
                      Review Answers
                    </Button>
                    <Button
                      onClick={handleSubmitExam}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      Submit Exam
                      <CheckCircleIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Test Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {examState.answeredQuestions}
                    </div>
                    <div className="text-sm text-muted-foreground">Answered</div>
                  </div>
                  <div>
                    <div className={cn(
                      "text-2xl font-bold",
                      examState.hasUnansweredQuestions ? "text-orange-600" : "text-muted-foreground"
                    )}>
                      {examState.totalQuestions - examState.answeredQuestions}
                    </div>
                    <div className="text-sm text-muted-foreground">Remaining</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600">
                      {examState.bookmarkedQuestions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Bookmarked</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {timerData.timeRemainingFormatted}
                    </div>
                    <div className="text-sm text-muted-foreground">Time Left</div>
                  </div>
                </div>
              </CardContent>
            </Card>
              </>
            )}
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Exam</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p>Are you sure you want to submit your exam?</p>
              
              <div className="bg-muted p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Answered:</span> {examState.answeredQuestions}/{examState.totalQuestions}
                  </div>
                  <div>
                    <span className="font-medium">Time Remaining:</span> {timerData.timeRemainingFormatted}
                  </div>
                </div>
              </div>

              {examState.hasUnansweredQuestions && (
                <Alert>
                  <AlertTriangleIcon className="h-4 w-4" />
                  <AlertDescription>
                    You have {examState.totalQuestions - examState.answeredQuestions} unanswered questions. 
                    These will be marked as incorrect.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                disabled={isSubmitting}
              >
                Continue Exam
              </Button>
              <Button
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? "Submitting..." : "Submit Exam"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}