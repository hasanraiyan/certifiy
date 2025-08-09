"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  FileTextIcon,
  LoaderIcon,
  XCircleIcon 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Question, Answer, ExamConfig, ExamResults } from "@/lib/exam/types"
import { calculateScore, determinePassStatus, calculateDomainScores } from "@/lib/exam/utils"

interface ExamSubmissionProps {
  questions: Question[]
  answers: Map<number, Answer>
  examConfig: ExamConfig
  sessionId: string
  timeSpent: number
  onSubmissionComplete: (results: ExamResults) => void
  onSubmissionError: (error: Error) => void
  className?: string
}

interface SubmissionState {
  isOpen: boolean
  isSubmitting: boolean
  error: string | null
  step: 'confirmation' | 'processing' | 'success' | 'error'
}

export function ExamSubmission({
  questions,
  answers,
  examConfig,
  sessionId,
  timeSpent,
  onSubmissionComplete,
  onSubmissionError,
  className,
}: ExamSubmissionProps) {
  const router = useRouter()
  const [submissionState, setSubmissionState] = React.useState<SubmissionState>({
    isOpen: false,
    isSubmitting: false,
    error: null,
    step: 'confirmation'
  })

  const totalQuestions = questions.length
  const answeredQuestions = answers.size
  const unansweredQuestions = totalQuestions - answeredQuestions
  const canSubmit = unansweredQuestions === 0 || examConfig.type === 'practice'

  // Calculate preliminary results for confirmation display
  const preliminaryResults = React.useMemo(() => {
    if (answers.size === 0) return null

    try {
      const score = calculateScore(questions, answers)
      const passed = determinePassStatus(score, examConfig)
      const domainScores = calculateDomainScores(questions, answers)

      return {
        score,
        passed,
        domainScores,
        answeredCount: answers.size,
        totalCount: questions.length
      }
    } catch (error) {
      console.error('Error calculating preliminary results:', error)
      return null
    }
  }, [questions, answers, examConfig])

  const openSubmissionDialog = () => {
    setSubmissionState({
      isOpen: true,
      isSubmitting: false,
      error: null,
      step: 'confirmation'
    })
  }

  const closeSubmissionDialog = () => {
    if (!submissionState.isSubmitting) {
      setSubmissionState(prev => ({ ...prev, isOpen: false }))
    }
  }

  const handleSubmit = async () => {
    if (!canSubmit) {
      setSubmissionState(prev => ({
        ...prev,
        error: 'Please answer all questions before submitting.',
        step: 'error'
      }))
      return
    }

    setSubmissionState(prev => ({
      ...prev,
      isSubmitting: true,
      error: null,
      step: 'processing'
    }))

    try {
      // Perform final validation
      const validationErrors = performFinalValidation()
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`)
      }

      // Calculate final results
      const score = calculateScore(questions, answers)
      const passed = determinePassStatus(score, examConfig)
      const domainScores = calculateDomainScores(questions, answers)

      // Create question results
      const questionResults = questions.map((question, index) => {
        const answer = answers.get(index)
        const selectedAnswer = answer?.selectedOptions || []
        const correctAnswer = Array.isArray(question.correctAnswer) 
          ? question.correctAnswer 
          : [question.correctAnswer]
        
        // Check if answer is correct
        const isCorrect = selectedAnswer.length === correctAnswer.length &&
          selectedAnswer.every(option => correctAnswer.includes(option))

        return {
          questionId: question.id,
          correct: isCorrect,
          selectedAnswer,
          correctAnswer,
          timeSpent: answer?.timeSpent || 0,
          domain: question.domain
        }
      })

      const results: ExamResults = {
        sessionId,
        totalQuestions,
        answeredQuestions: answers.size,
        correctAnswers: questionResults.filter(r => r.correct).length,
        score,
        passed,
        timeSpent,
        domainScores,
        questionResults
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Save results to localStorage (in a real app, this would be an API call)
      try {
        localStorage.setItem(`exam_results_${sessionId}`, JSON.stringify(results))
      } catch (storageError) {
        console.warn('Failed to save results to localStorage:', storageError)
      }

      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        step: 'success'
      }))

      // Call completion handler
      onSubmissionComplete(results)

      // Redirect to results page after a short delay
      setTimeout(() => {
        router.push(`/results/${sessionId}`)
      }, 1500)

    } catch (error) {
      console.error('Submission error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        error: errorMessage,
        step: 'error'
      }))

      onSubmissionError(error instanceof Error ? error : new Error(errorMessage))
    }
  }

  const performFinalValidation = (): string[] => {
    const errors: string[] = []

    // Check if exam is in valid state for submission
    if (examConfig.type === 'test' && unansweredQuestions > 0) {
      errors.push(`${unansweredQuestions} questions remain unanswered`)
    }

    // Validate answers format
    for (const [questionIndex, answer] of answers.entries()) {
      const question = questions[questionIndex]
      if (!question) {
        errors.push(`Invalid question index: ${questionIndex}`)
        continue
      }

      if (!answer.selectedOptions || answer.selectedOptions.length === 0) {
        errors.push(`Question ${questionIndex + 1} has no selected options`)
        continue
      }

      // Validate option indices
      const invalidOptions = answer.selectedOptions.filter(
        optionIndex => optionIndex < 0 || optionIndex >= question.options.length
      )
      if (invalidOptions.length > 0) {
        errors.push(`Question ${questionIndex + 1} has invalid option indices: ${invalidOptions.join(', ')}`)
      }

      // Validate answer type constraints
      if (question.type === 'multiple-choice' || question.type === 'true-false') {
        if (answer.selectedOptions.length > 1) {
          errors.push(`Question ${questionIndex + 1} should have only one selected option`)
        }
      }
    }

    return errors
  }

  const renderConfirmationStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileTextIcon className="h-5 w-5" />
          Submit Exam
        </DialogTitle>
        <DialogDescription>
          Please review your exam summary before final submission.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Validation Warnings */}
        {unansweredQuestions > 0 && examConfig.type === 'test' && (
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              You have {unansweredQuestions} unanswered question{unansweredQuestions !== 1 ? 's' : ''}.
              In test mode, all questions must be answered before submission.
            </AlertDescription>
          </Alert>
        )}

        {unansweredQuestions > 0 && examConfig.type === 'practice' && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangleIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You have {unansweredQuestions} unanswered question{unansweredQuestions !== 1 ? 's' : ''}.
              In practice mode, you can submit with unanswered questions.
            </AlertDescription>
          </Alert>
        )}

        {/* Exam Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Exam Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Exam Type:</span>
                <div className="font-medium capitalize">{examConfig.type} Mode</div>
              </div>
              <div>
                <span className="text-muted-foreground">Time Spent:</span>
                <div className="font-medium flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Questions Answered:</span>
                <div className="font-medium">{answeredQuestions} / {totalQuestions}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Completion:</span>
                <div className="font-medium">
                  {Math.round((answeredQuestions / totalQuestions) * 100)}%
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{answeredQuestions}/{totalQuestions}</span>
              </div>
              <Progress 
                value={(answeredQuestions / totalQuestions) * 100} 
                className="h-2"
              />
            </div>

            {/* Preliminary Score (for practice mode) */}
            {examConfig.type === 'practice' && preliminaryResults && (
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">Preliminary Results:</div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant={preliminaryResults.passed ? "default" : "destructive"}
                    className="gap-1"
                  >
                    {preliminaryResults.passed ? (
                      <CheckCircleIcon className="h-3 w-3" />
                    ) : (
                      <XCircleIcon className="h-3 w-3" />
                    )}
                    {preliminaryResults.score}% - {preliminaryResults.passed ? 'Pass' : 'Fail'}
                  </Badge>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning for final submission */}
        <Alert>
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Once you submit your exam, you cannot make any changes.
            Make sure you have reviewed all your answers.
          </AlertDescription>
        </Alert>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={closeSubmissionDialog}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="min-w-[120px]"
        >
          {canSubmit ? 'Submit Exam' : 'Cannot Submit'}
        </Button>
      </DialogFooter>
    </>
  )

  const renderProcessingStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <LoaderIcon className="h-5 w-5 animate-spin" />
          Submitting Exam
        </DialogTitle>
        <DialogDescription>
          Please wait while we process your exam submission...
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <LoaderIcon className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <p className="font-medium">Processing your answers</p>
            <p className="text-sm text-muted-foreground">
              This may take a few moments...
            </p>
          </div>
        </div>
      </div>
    </>
  )

  const renderSuccessStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-green-700">
          <CheckCircleIcon className="h-5 w-5" />
          Exam Submitted Successfully
        </DialogTitle>
        <DialogDescription>
          Your exam has been submitted and processed successfully.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <div className="text-center space-y-2">
            <p className="font-medium">Submission Complete!</p>
            <p className="text-sm text-muted-foreground">
              Redirecting to your results page...
            </p>
          </div>
        </div>
      </div>
    </>
  )

  const renderErrorStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-red-700">
          <XCircleIcon className="h-5 w-5" />
          Submission Failed
        </DialogTitle>
        <DialogDescription>
          There was an error submitting your exam.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <Alert className="border-red-200 bg-red-50">
          <XCircleIcon className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {submissionState.error || 'An unexpected error occurred during submission.'}
          </AlertDescription>
        </Alert>

        <div className="text-sm text-muted-foreground">
          <p>Please try the following:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Check your internet connection</li>
            <li>Ensure all questions are properly answered</li>
            <li>Try submitting again</li>
            <li>Contact support if the problem persists</li>
          </ul>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={closeSubmissionDialog}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="min-w-[120px]">
          Try Again
        </Button>
      </DialogFooter>
    </>
  )

  return (
    <div className={cn("w-full", className)}>
      <Button
        onClick={openSubmissionDialog}
        disabled={!canSubmit}
        size="lg"
        className="w-full sm:w-auto min-w-[160px]"
      >
        Submit Exam
      </Button>

      <Dialog 
        open={submissionState.isOpen} 
        onOpenChange={closeSubmissionDialog}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {submissionState.step === 'confirmation' && renderConfirmationStep()}
          {submissionState.step === 'processing' && renderProcessingStep()}
          {submissionState.step === 'success' && renderSuccessStep()}
          {submissionState.step === 'error' && renderErrorStep()}
        </DialogContent>
      </Dialog>
    </div>
  )
}