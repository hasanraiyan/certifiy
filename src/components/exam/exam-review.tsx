"use client"

import * as React from "react"
import { AlertTriangleIcon, BookmarkIcon, CheckCircleIcon, CircleIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Question, Answer } from "@/lib/exam/types"

interface ExamReviewProps {
  questions: Question[]
  answers: Map<number, Answer>
  bookmarkedQuestions: Set<number>
  onQuestionSelect: (index: number) => void
  onSubmit: () => void
  canSubmit: boolean
  className?: string
}

export function ExamReview({
  questions,
  answers,
  bookmarkedQuestions,
  onQuestionSelect,
  onSubmit,
  canSubmit,
  className,
}: ExamReviewProps) {
  const totalQuestions = questions.length
  const answeredQuestions = answers.size
  const unansweredQuestions = totalQuestions - answeredQuestions
  const bookmarkedCount = bookmarkedQuestions.size

  // Get list of unanswered question indices
  const unansweredIndices = React.useMemo(() => {
    const unanswered: number[] = []
    for (let i = 0; i < totalQuestions; i++) {
      if (!answers.has(i)) {
        unanswered.push(i)
      }
    }
    return unanswered
  }, [totalQuestions, answers])

  const getAnswerSummary = (questionIndex: number): string => {
    const answer = answers.get(questionIndex)
    const question = questions[questionIndex]
    
    if (!answer || !question) {
      return "Not answered"
    }

    const selectedOptions = answer.selectedOptions
    if (selectedOptions.length === 0) {
      return "Not answered"
    }

    // Format the selected options as text
    const selectedTexts = selectedOptions.map(optionIndex => {
      const optionText = question.options[optionIndex]
      return optionText ? `${String.fromCharCode(65 + optionIndex)}. ${optionText}` : `Option ${optionIndex + 1}`
    })

    return selectedTexts.join(", ")
  }

  const getQuestionStatus = (questionIndex: number): 'answered' | 'unanswered' => {
    return answers.has(questionIndex) ? 'answered' : 'unanswered'
  }

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Review Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Exam Review
          </CardTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-4 w-4 text-green-600" />
              <span>
                Answered: <span className="font-medium">{answeredQuestions}</span>/{totalQuestions}
              </span>
            </div>
            {unansweredQuestions > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
                <span>
                  Unanswered: <span className="font-medium text-amber-600">{unansweredQuestions}</span>
                </span>
              </div>
            )}
            {bookmarkedCount > 0 && (
              <div className="flex items-center gap-2">
                <BookmarkIcon className="h-4 w-4 text-yellow-600" />
                <span>
                  Bookmarked: <span className="font-medium">{bookmarkedCount}</span>
                </span>
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Validation Warnings */}
      {unansweredQuestions > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="space-y-2">
              <p className="font-medium">
                You have {unansweredQuestions} unanswered question{unansweredQuestions !== 1 ? 's' : ''}
              </p>
              <p className="text-sm">
                Please review and answer all questions before submitting your exam.
                Click on any question below to navigate directly to it.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Questions Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Question Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {questions.map((question, index) => {
                const status = getQuestionStatus(index)
                const isBookmarked = bookmarkedQuestions.has(index)
                const answerSummary = getAnswerSummary(index)
                
                return (
                  <div
                    key={question.id}
                    className={cn(
                      "flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50",
                      status === 'unanswered' && "border-amber-200 bg-amber-50/50",
                      status === 'answered' && "border-green-200 bg-green-50/50"
                    )}
                    onClick={() => onQuestionSelect(index)}
                  >
                    {/* Question Number and Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium">
                        {status === 'answered' ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                        ) : (
                          <CircleIcon className="h-5 w-5 text-amber-600" />
                        )}
                      </div>
                      <span className="font-medium text-sm">
                        Q{index + 1}
                      </span>
                      {isBookmarked && (
                        <BookmarkIcon className="h-4 w-4 text-yellow-600 fill-current" />
                      )}
                    </div>

                    {/* Question Content */}
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Question Text Preview */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {question.text}
                      </p>
                      
                      {/* Question Type and Domain */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {question.type === 'multiple-choice' && 'Single Choice'}
                          {question.type === 'multiple-select' && 'Multiple Select'}
                          {question.type === 'true-false' && 'True/False'}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {question.domain}
                        </Badge>
                      </div>

                      {/* Answer Summary */}
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">
                          Your Answer:
                        </p>
                        <p className={cn(
                          "text-sm",
                          status === 'answered' ? "text-foreground" : "text-amber-600 font-medium"
                        )}>
                          {answerSummary}
                        </p>
                      </div>
                    </div>

                    {/* Navigation Arrow */}
                    <div className="shrink-0 text-muted-foreground">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Quick Navigation for Unanswered Questions */}
      {unansweredQuestions > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
              Unanswered Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click on any question number below to navigate directly to it:
              </p>
              <div className="flex flex-wrap gap-2">
                {unansweredIndices.map((questionIndex) => (
                  <Button
                    key={questionIndex}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuestionSelect(questionIndex)}
                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                  >
                    Question {questionIndex + 1}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              {canSubmit ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Ready to submit your exam</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>Please answer all questions before submitting</span>
                </div>
              )}
            </div>
            
            <Button
              onClick={onSubmit}
              disabled={!canSubmit}
              size="lg"
              className="min-w-[140px]"
            >
              {canSubmit ? 'Submit Exam' : 'Complete All Questions'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}