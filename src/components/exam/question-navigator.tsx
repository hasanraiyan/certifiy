"use client"

import * as React from "react"
import { BookmarkIcon, FilterIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Question } from "@/lib/exam/types"

interface QuestionNavigatorProps {
  questions: Question[]
  currentQuestionIndex: number
  answeredQuestions: Set<number>
  bookmarkedQuestions: Set<number>
  onQuestionSelect: (index: number) => void
  className?: string
}

export function QuestionNavigator({
  questions,
  currentQuestionIndex,
  answeredQuestions,
  bookmarkedQuestions,
  onQuestionSelect,
  className,
}: QuestionNavigatorProps) {
  const [showBookmarkedOnly, setShowBookmarkedOnly] = React.useState(false)

  const filteredQuestions = React.useMemo(() => {
    if (!showBookmarkedOnly) {
      return questions.map((_, index) => index)
    }
    return questions
      .map((_, index) => index)
      .filter(index => bookmarkedQuestions.has(index))
  }, [questions, bookmarkedQuestions, showBookmarkedOnly])

  const getQuestionStatus = (index: number) => {
    if (index === currentQuestionIndex) return 'current'
    if (answeredQuestions.has(index)) return 'answered'
    return 'unanswered'
  }

  const getQuestionButtonVariant = (index: number) => {
    const status = getQuestionStatus(index)
    switch (status) {
      case 'current':
        return 'default'
      case 'answered':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getQuestionButtonClassName = (index: number) => {
    const status = getQuestionStatus(index)
    const isBookmarked = bookmarkedQuestions.has(index)
    
    return cn(
      "relative p-0 font-medium transition-all",
      status === 'current' && "ring-2 ring-primary ring-offset-1 sm:ring-offset-2",
      isBookmarked && "after:absolute after:-top-0.5 after:-right-0.5 sm:after:-top-1 sm:after:-right-1 after:h-1.5 after:w-1.5 sm:after:h-2 sm:after:w-2 after:rounded-full after:bg-yellow-500"
    )
  }

  const bookmarkedCount = bookmarkedQuestions.size
  const answeredCount = answeredQuestions.size
  const totalCount = questions.length

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3 sm:pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
          <CardTitle className="text-base sm:text-lg font-medium">
            Question Navigator
          </CardTitle>
          <div className="flex items-center gap-2">
            {bookmarkedCount > 0 && (
              <Button
                variant={showBookmarkedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className="gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9"
              >
                <FilterIcon className="h-3 w-3" />
                <BookmarkIcon className="h-3 w-3" />
                <span className="hidden sm:inline">
                  {showBookmarkedOnly ? 'Show All' : 'Bookmarked'}
                </span>
                <span className="sm:hidden">
                  {showBookmarkedOnly ? 'All' : 'Saved'}
                </span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Progress Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <span>
            Answered: <span className="font-medium text-foreground">{answeredCount}</span>/{totalCount}
          </span>
          {bookmarkedCount > 0 && (
            <span>
              Bookmarked: <span className="font-medium text-foreground">{bookmarkedCount}</span>
            </span>
          )}
          <span className="text-xs">
            Progress: {Math.round((answeredCount / totalCount) * 100)}%
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="px-3 sm:px-6">
        {/* Legend */}
        <div className="mb-3 sm:mb-4 grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-4 text-xs">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded border-2 border-primary bg-primary"></div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded bg-secondary"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded border border-input"></div>
            <span>Unanswered</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="relative h-2.5 w-2.5 sm:h-3 sm:w-3 rounded border border-input">
              <div className="absolute -top-0.5 -right-0.5 h-1 w-1 sm:h-1.5 sm:w-1.5 rounded-full bg-yellow-500"></div>
            </div>
            <span>Bookmarked</span>
          </div>
        </div>

        {/* Question Grid */}
        {filteredQuestions.length > 0 ? (
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-15 xl:grid-cols-18 gap-1.5 sm:gap-2">
            {filteredQuestions.map((questionIndex) => (
              <Button
                key={questionIndex}
                variant={getQuestionButtonVariant(questionIndex)}
                className={cn(
                  getQuestionButtonClassName(questionIndex),
                  "h-8 w-8 sm:h-10 sm:w-10 text-xs sm:text-sm touch-manipulation"
                )}
                onClick={() => onQuestionSelect(questionIndex)}
                aria-label={`Go to question ${questionIndex + 1}${
                  bookmarkedQuestions.has(questionIndex) ? ' (bookmarked)' : ''
                }${
                  answeredQuestions.has(questionIndex) ? ' (answered)' : ''
                }${
                  questionIndex === currentQuestionIndex ? ' (current)' : ''
                }`}
              >
                {questionIndex + 1}
              </Button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <BookmarkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No bookmarked questions yet</p>
            <p className="text-xs mt-1">
              Click the bookmark icon on questions to mark them for review
            </p>
          </div>
        )}

        {/* Filter Status */}
        {showBookmarkedOnly && bookmarkedCount > 0 && (
          <div className="mt-4 flex items-center justify-center">
            <Badge variant="secondary" className="gap-2">
              <BookmarkIcon className="h-3 w-3" />
              Showing {filteredQuestions.length} bookmarked question{filteredQuestions.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}