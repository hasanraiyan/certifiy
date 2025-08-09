"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeftIcon, ChevronRightIcon, BookOpenIcon, CheckCircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { QuestionDisplay } from "./question-display"
import { QuestionNavigator } from "./question-navigator"
import { ProgressTracker } from "./progress-tracker"
import { ExamReview } from "./exam-review"
import { useExamState } from "@/hooks/useExamState"
import { useExamPersistence } from "@/hooks/useExamPersistence"
import { Question, ExamConfig, Answer } from "@/lib/exam/types"

interface PracticeModeProps {
  sessionId: string
  examConfig: ExamConfig
  questions: Question[]
  onExamComplete?: (sessionId: string) => void
}

export function PracticeMode({
  sessionId,
  examConfig,
  questions,
  onExamComplete
}: PracticeModeProps) {
  const router = useRouter()
  const { data: examState, actions: examActions } = useExamState()
  const { saveProgress, loadProgress } = useExamPersistence(sessionId)
  
  // Local state for practice mode specific features
  const [showExplanation, setShowExplanation] = useState(false)
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false)
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date())
  const [isInitialized, setIsInitialized] = useState(false)
  const [isReviewMode, setIsReviewMode] = useState(false)

  // Initialize exam session
  useEffect(() => {
    if (!isInitialized && questions.length > 0) {
      // Try to load existing progress first
      const loaded = loadProgress()
      
      if (!loaded) {
        // Start new exam session
        examActions.startExam(examConfig, questions)
      }
      
      setIsInitialized(true)
    }
  }, [examConfig, questions, loadProgress, examActions, isInitialized])

  // Update local state when current question changes
  useEffect(() => {
    if (examState.currentQuestion && examState.session) {
      const currentAnswer = examState.session.answers.get(examState.currentQuestionIndex)
      setHasAnsweredCurrent(!!currentAnswer)
      setShowExplanation(!!currentAnswer) // Show explanation if already answered
      setQuestionStartTime(new Date())
    }
  }, [examState.currentQuestionIndex, examState.currentQuestion, examState.session])

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

    // Update local state to show explanation
    setHasAnsweredCurrent(true)
    setShowExplanation(true)
  }, [examState.currentQuestion, examActions, questionStartTime])

  const handleBookmarkToggle = useCallback(() => {
    examActions.toggleBookmark(examState.currentQuestionIndex)
  }, [examActions, examState.currentQuestionIndex])

  const handleNextQuestion = useCallback(() => {
    if (examState.currentQuestionIndex < examState.totalQuestions - 1) {
      examActions.goToNextQuestion()
      setShowExplanation(false)
      setHasAnsweredCurrent(false)
    }
  }, [examActions, examState.currentQuestionIndex, examState.totalQuestions])

  const handlePreviousQuestion = useCallback(() => {
    if (examState.currentQuestionIndex > 0) {
      examActions.goToPreviousQuestion()
      setShowExplanation(false)
      setHasAnsweredCurrent(false)
    }
  }, [examActions, examState.currentQuestionIndex])

  const handleQuestionNavigate = useCallback((questionIndex: number) => {
    examActions.goToQuestion(questionIndex)
    setShowExplanation(false)
    setHasAnsweredCurrent(false)
  }, [examActions])

  const handleCompleteExam = useCallback(() => {
    examActions.completeExam()
    saveProgress()
    
    if (onExamComplete) {
      onExamComplete(sessionId)
    } else {
      router.push(`/results/${sessionId}`)
    }
  }, [examActions, saveProgress, onExamComplete, sessionId, router])

  const handleResumeExam = useCallback(() => {
    examActions.resumeExam()
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
    setShowExplanation(false)
  }, [examActions])

  // Don't render until initialized
  if (!isInitialized || !examState.session || !examState.currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading practice session...</p>
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpenIcon className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Practice Mode</h1>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Unlimited Time
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Session: {sessionId}
            </div>
          </div>

          {/* Progress Tracker */}
          <ProgressTracker
            currentQuestion={examState.currentQuestionIndex + 1}
            totalQuestions={examState.totalQuestions}
            answeredQuestions={examState.answeredQuestions}
            showTimeRemaining={false}
          />
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
                  onSubmit={handleCompleteExam}
                  canSubmit={true} // In practice mode, can always submit
                />
              </div>
            ) : (
              /* Normal Question Mode */
              <>
                {/* Practice Mode Info */}
                {!hasAnsweredCurrent && (
              <Alert>
                <BookOpenIcon className="h-4 w-4" />
                <AlertDescription>
                  Practice Mode: Take your time to answer each question. You'll see the correct answer and explanation immediately after submitting.
                </AlertDescription>
              </Alert>
            )}

            {/* Question Display */}
            <QuestionDisplay
              question={examState.currentQuestion}
              selectedAnswer={currentAnswer || null}
              onAnswerSelect={handleAnswerSelect}
              isBookmarked={isBookmarked}
              onBookmarkToggle={handleBookmarkToggle}
              showExplanation={showExplanation}
              questionNumber={examState.currentQuestionIndex + 1}
            />

            {/* Feedback Section */}
            {hasAnsweredCurrent && currentAnswer && (
              <Card className="border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div className="space-y-2">
                      <p className="font-medium text-green-800">
                        Answer submitted! Review the explanation below.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        In practice mode, you can review explanations and continue at your own pace.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Question {examState.currentQuestionIndex + 1} of {examState.totalQuestions}
                </span>
              </div>

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
                    onClick={handleCompleteExam}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    Complete Practice
                    <CheckCircleIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Practice Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Practice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {examState.answeredQuestions}
                    </div>
                    <div className="text-sm text-muted-foreground">Answered</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-muted-foreground">
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
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((examState.answeredQuestions / examState.totalQuestions) * 100)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}