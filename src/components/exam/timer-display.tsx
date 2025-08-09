"use client"

import * as React from "react"
import { ClockIcon, AlertTriangleIcon, EyeOffIcon, EyeIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useExamPageVisibility } from "@/hooks/usePageVisibility"

interface TimerDisplayProps {
  timeRemaining: number // in seconds
  totalTime: number // in seconds
  isTestMode: boolean
  onTimeExpired: () => void
  onSuspiciousActivity?: (activity: string) => void
  showWarnings?: boolean
  trackFocusLoss?: boolean
  className?: string
}

export function TimerDisplay({
  timeRemaining,
  totalTime,
  isTestMode,
  onTimeExpired,
  onSuspiciousActivity,
  showWarnings = true,
  trackFocusLoss = true,
  className,
}: TimerDisplayProps) {
  const [showWarning, setShowWarning] = React.useState(false)
  const [warningType, setWarningType] = React.useState<'10min' | '5min' | 'focus' | null>(null)
  const [isPaused, setIsPaused] = React.useState(false)
  const [pauseReason, setPauseReason] = React.useState<string | null>(null)

  // Page visibility tracking for test mode
  const visibilityData = useExamPageVisibility({
    onTabSwitch: (isVisible) => {
      if (isTestMode && trackFocusLoss) {
        if (!isVisible) {
          setIsPaused(true)
          setPauseReason('Tab switched or window lost focus')
          setWarningType('focus')
          setShowWarning(true)
        } else {
          setIsPaused(false)
          setPauseReason(null)
          if (warningType === 'focus') {
            setShowWarning(false)
            setWarningType(null)
          }
        }
      }
    },
    onSuspiciousActivity: (activity) => {
      onSuspiciousActivity?.(activity)
    },
    maxHiddenTime: 2 * 60 * 1000, // 2 minutes
    warnThreshold: 30 * 1000 // 30 seconds
  })

  // Don't render timer in practice mode
  if (!isTestMode) {
    return null
  }

  // Format time as HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage (time elapsed)
  const timeElapsed = totalTime - timeRemaining
  const progressPercentage = (timeElapsed / totalTime) * 100

  // Determine timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining <= 300) return 'text-red-600' // 5 minutes or less
    if (timeRemaining <= 600) return 'text-orange-600' // 10 minutes or less
    return 'text-foreground'
  }

  // Determine progress bar color
  const getProgressColor = () => {
    if (timeRemaining <= 300) return 'bg-red-500' // 5 minutes or less
    if (timeRemaining <= 600) return 'bg-orange-500' // 10 minutes or less
    return 'bg-primary'
  }

  // Handle time expiration
  React.useEffect(() => {
    if (timeRemaining <= 0) {
      // Dispatch time expired event for other components to handle
      const event = new CustomEvent('exam:timeExpired', {
        detail: { sessionId: 'current', timeRemaining: 0 }
      })
      window.dispatchEvent(event)
      onTimeExpired()
    }
  }, [timeRemaining, onTimeExpired])

  // Handle warnings
  React.useEffect(() => {
    if (!showWarnings || warningType === 'focus') return

    if (timeRemaining <= 300 && timeRemaining > 299 && warningType !== '5min') {
      // 5 minutes warning
      setWarningType('5min')
      setShowWarning(true)
      const timer = setTimeout(() => {
        if (warningType === '5min') {
          setShowWarning(false)
          setWarningType(null)
        }
      }, 5000)
      return () => clearTimeout(timer)
    } else if (timeRemaining <= 600 && timeRemaining > 599 && warningType !== '10min') {
      // 10 minutes warning
      setWarningType('10min')
      setShowWarning(true)
      const timer = setTimeout(() => {
        if (warningType === '10min') {
          setShowWarning(false)
          setWarningType(null)
        }
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [timeRemaining, showWarnings, warningType])

  const isLowTime = timeRemaining <= 600 // 10 minutes or less
  const isCriticalTime = timeRemaining <= 300 // 5 minutes or less

  return (
    <div className={cn("space-y-4", className)}>
      {/* Warning Alert */}
      {showWarning && warningType && (
        <Alert className={cn(
          "border-orange-200 bg-orange-50",
          isCriticalTime && "border-red-200 bg-red-50",
          warningType === 'focus' && "border-yellow-200 bg-yellow-50"
        )}>
          <AlertTriangleIcon className={cn(
            "h-4 w-4",
            isCriticalTime ? "text-red-600" : 
            warningType === 'focus' ? "text-yellow-600" : "text-orange-600"
          )} />
          <AlertDescription className={cn(
            "font-medium",
            isCriticalTime ? "text-red-800" : 
            warningType === 'focus' ? "text-yellow-800" : "text-orange-800"
          )}>
            {warningType === '5min' 
              ? "⚠️ Only 5 minutes remaining! The exam will auto-submit when time expires."
              : warningType === '10min'
              ? "⚠️ 10 minutes remaining. Please review your answers."
              : warningType === 'focus'
              ? "⚠️ Focus lost detected. Please return to the exam tab to continue."
              : ""
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Focus Loss Warnings */}
      {isTestMode && trackFocusLoss && visibilityData.warnings.length > 0 && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <EyeOffIcon className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <div className="space-y-1">
              <p className="font-medium">Activity Monitoring:</p>
              {visibilityData.warnings.slice(-3).map((warning, index) => (
                <p key={index} className="text-xs">{warning}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Timer Card */}
      <Card className={cn(
        "transition-all duration-300",
        isLowTime && "ring-2 ring-orange-200",
        isCriticalTime && "ring-2 ring-red-200 animate-pulse",
        isPaused && "ring-2 ring-yellow-200"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ClockIcon className={cn(
                "h-5 w-5 transition-colors",
                isPaused ? "text-yellow-600" : getTimerColor()
              )} />
              <span className="text-sm font-medium text-muted-foreground">
                Time Remaining
              </span>
              {isPaused && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-300">
                  Paused
                </Badge>
              )}
            </div>
            <div className={cn(
              "text-2xl font-mono font-bold transition-colors",
              isPaused ? "text-yellow-600" : getTimerColor()
            )}>
              {formatTime(timeRemaining)}
            </div>
          </div>

          {/* Focus Status */}
          {isTestMode && trackFocusLoss && (
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                {visibilityData.isVisible ? (
                  <EyeIcon className="h-3 w-3 text-green-600" />
                ) : (
                  <EyeOffIcon className="h-3 w-3 text-yellow-600" />
                )}
                <span className={visibilityData.isVisible ? "text-green-600" : "text-yellow-600"}>
                  {visibilityData.isVisible ? "Active" : "Focus Lost"}
                </span>
              </div>
              {visibilityData.violations.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {visibilityData.violations.length} violations
                </Badge>
              )}
            </div>
          )}

          {pauseReason && (
            <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              {pauseReason}
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Time Elapsed</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="relative">
              <Progress 
                value={progressPercentage} 
                className="h-2"
              />
              {/* Custom colored progress bar */}
              <div 
                className={cn(
                  "absolute top-0 left-0 h-2 rounded-full transition-all duration-300",
                  getProgressColor()
                )}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Time Status */}
          <div className="mt-3 text-center">
            {isPaused ? (
              <p className="text-xs text-yellow-600 font-medium">
                Timer paused - Return focus to continue
              </p>
            ) : isCriticalTime ? (
              <p className="text-xs text-red-600 font-medium">
                Critical: Exam will auto-submit soon
              </p>
            ) : isLowTime ? (
              <p className="text-xs text-orange-600 font-medium">
                Warning: Limited time remaining
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Exam in progress
              </p>
            )}
          </div>

          {/* Activity Summary for Test Mode */}
          {isTestMode && trackFocusLoss && visibilityData.totalHiddenTime > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium">Hidden Time:</span>
                  <br />
                  {Math.round(visibilityData.totalHiddenTime / 1000)}s
                </div>
                <div>
                  <span className="font-medium">Switches:</span>
                  <br />
                  {visibilityData.hiddenSessions.length}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}