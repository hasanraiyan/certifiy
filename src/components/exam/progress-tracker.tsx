"use client"

import * as React from "react"
import { CheckCircleIcon, CircleIcon, BookmarkIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface ProgressTrackerProps {
  totalQuestions: number
  answeredQuestions: Set<number>
  bookmarkedQuestions: Set<number>
  currentQuestionIndex: number
  className?: string
}

export function ProgressTracker({
  totalQuestions,
  answeredQuestions,
  bookmarkedQuestions,
  currentQuestionIndex,
  className,
}: ProgressTrackerProps) {
  const answeredCount = answeredQuestions.size
  const bookmarkedCount = bookmarkedQuestions.size
  const completionPercentage = (answeredCount / totalQuestions) * 100
  const unansweredCount = totalQuestions - answeredCount

  // Determine completion status
  const getCompletionStatus = () => {
    if (completionPercentage === 100) return 'complete'
    if (completionPercentage >= 75) return 'nearly-complete'
    if (completionPercentage >= 50) return 'halfway'
    if (completionPercentage >= 25) return 'started'
    return 'beginning'
  }

  const getStatusColor = () => {
    const status = getCompletionStatus()
    switch (status) {
      case 'complete':
        return 'text-green-600'
      case 'nearly-complete':
        return 'text-blue-600'
      case 'halfway':
        return 'text-yellow-600'
      case 'started':
        return 'text-orange-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusMessage = () => {
    const status = getCompletionStatus()
    switch (status) {
      case 'complete':
        return 'All questions answered! Ready to submit.'
      case 'nearly-complete':
        return 'Almost done! Just a few more questions.'
      case 'halfway':
        return 'Great progress! You\'re halfway through.'
      case 'started':
        return 'Good start! Keep going.'
      default:
        return 'Just getting started.'
    }
  }

  const getProgressBarColor = () => {
    if (completionPercentage === 100) return 'bg-green-500'
    if (completionPercentage >= 75) return 'bg-blue-500'
    if (completionPercentage >= 50) return 'bg-yellow-500'
    return 'bg-primary'
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg font-medium flex items-center gap-2">
          <CheckCircleIcon className={cn("h-4 w-4 sm:h-5 sm:w-5", getStatusColor())} />
          <span className="hidden sm:inline">Progress Tracker</span>
          <span className="sm:hidden">Progress</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6">
        {/* Main Progress Bar */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm font-medium">Overall Progress</span>
            <span className={cn("text-sm sm:text-base font-bold", getStatusColor())}>
              {Math.round(completionPercentage)}%
            </span>
          </div>
          
          <div className="relative">
            <Progress value={completionPercentage} className="h-2 sm:h-3" />
            {/* Custom colored progress bar */}
            <div 
              className={cn(
                "absolute top-0 left-0 h-2 sm:h-3 rounded-full transition-all duration-500",
                getProgressBarColor()
              )}
              style={{ width: `${Math.min(completionPercentage, 100)}%` }}
            />
          </div>
          
          <p className={cn("text-xs sm:text-sm font-medium", getStatusColor())}>
            {getStatusMessage()}
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          {/* Answered Questions */}
          <div className="text-center p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Answered</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-700">
              {answeredCount}
            </div>
            <div className="text-xs text-green-600">
              of {totalQuestions}
            </div>
          </div>

          {/* Remaining Questions */}
          <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-800">Remaining</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-gray-700">
              {unansweredCount}
            </div>
            <div className="text-xs text-gray-600">
              questions
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span>
              Current: <span className="font-medium text-foreground">
                {currentQuestionIndex + 1}
              </span>
            </span>
            
            {bookmarkedCount > 0 && (
              <div className="flex items-center gap-1">
                <BookmarkIcon className="h-3 w-3 text-yellow-600" />
                <span>
                  <span className="font-medium text-foreground">{bookmarkedCount}</span> bookmarked
                </span>
              </div>
            )}
          </div>

          {/* Completion Badge */}
          {completionPercentage === 100 && (
            <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
              <CheckCircleIcon className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          )}
        </div>

        {/* Visual Progress Indicator - Hidden on mobile to save space */}
        <div className="hidden sm:block space-y-2">
          <div className="text-xs font-medium text-muted-foreground">
            Question Progress
          </div>
          <div className="flex flex-wrap gap-1">
            {Array.from({ length: Math.min(totalQuestions, 50) }, (_, index) => {
              const isAnswered = answeredQuestions.has(index)
              const isCurrent = index === currentQuestionIndex
              const isBookmarked = bookmarkedQuestions.has(index)
              
              return (
                <div
                  key={index}
                  className={cn(
                    "relative w-2 h-2 rounded-full transition-all duration-200",
                    isCurrent && "ring-2 ring-primary ring-offset-1 scale-125",
                    isAnswered ? "bg-green-500" : "bg-gray-300",
                    isBookmarked && "after:absolute after:-top-0.5 after:-right-0.5 after:w-1 after:h-1 after:bg-yellow-500 after:after:rounded-full"
                  )}
                  title={`Question ${index + 1}${isAnswered ? ' (answered)' : ''}${isBookmarked ? ' (bookmarked)' : ''}${isCurrent ? ' (current)' : ''}`}
                />
              )
            })}
            {totalQuestions > 50 && (
              <span className="text-xs text-muted-foreground ml-2">
                +{totalQuestions - 50} more
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}