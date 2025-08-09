"use client"

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { WifiOffIcon, WifiIcon, AlertTriangleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useNetworkStatus } from "@/hooks/useNetworkStatus"
import { saveSessionForRecovery } from "@/lib/exam/session-recovery"
import { ExamSession, Question } from "@/lib/exam/types"

interface NetworkErrorHandlerProps {
  children: React.ReactNode
  examSession?: ExamSession
  questions?: Question[]
  onNetworkRecovered?: () => void
  onOfflineModeEnabled?: () => void
  allowOfflineMode?: boolean
}

/**
 * Network error handler that manages connectivity issues during exams
 * Provides offline mode capabilities and automatic session recovery
 */
export function NetworkErrorHandler({
  children,
  examSession,
  questions,
  onNetworkRecovered,
  onOfflineModeEnabled,
  allowOfflineMode = true
}: NetworkErrorHandlerProps) {
  const { status, actions, isOfflineMode, lastConnected, connectionHistory } = useNetworkStatus()
  const [showNetworkAlert, setShowNetworkAlert] = useState(false)
  const [networkErrorCount, setNetworkErrorCount] = useState(0)
  const [lastSaveAttempt, setLastSaveAttempt] = useState<Date | null>(null)

  // Show network alert when connection is lost
  useEffect(() => {
    if (!status.isConnected && !isOfflineMode) {
      setShowNetworkAlert(true)
      setNetworkErrorCount(prev => prev + 1)
    } else if (status.isConnected && showNetworkAlert) {
      setShowNetworkAlert(false)
      onNetworkRecovered?.()
    }
  }, [status.isConnected, isOfflineMode, showNetworkAlert, onNetworkRecovered])

  // Auto-save session when network issues are detected
  useEffect(() => {
    if (!status.isConnected && examSession && questions) {
      const saveSession = async () => {
        try {
          const saved = saveSessionForRecovery(examSession, questions, {
            validateIntegrity: true,
            autoCleanup: true
          })
          
          if (saved) {
            setLastSaveAttempt(new Date())
            console.log('Session saved for recovery due to network issues')
          }
        } catch (error) {
          console.error('Failed to save session for recovery:', error)
        }
      }

      // Debounce save attempts
      const saveTimeout = setTimeout(saveSession, 1000)
      return () => clearTimeout(saveTimeout)
    }
  }, [status.isConnected, examSession, questions])

  const handleEnableOfflineMode = useCallback(() => {
    actions.enableOfflineMode()
    setShowNetworkAlert(false)
    onOfflineModeEnabled?.()
  }, [actions, onOfflineModeEnabled])

  const handleRetryConnection = useCallback(async () => {
    const connected = await actions.retryConnection()
    if (!connected) {
      // If retry failed, suggest offline mode
      setShowNetworkAlert(true)
    }
  }, [actions])

  const getConnectionQuality = () => {
    if (!status.isConnected) return 'disconnected'
    if (status.rtt > 1000) return 'poor'
    if (status.rtt > 500) return 'fair'
    return 'good'
  }

  const getConnectionQualityColor = (quality: string) => {
    switch (quality) {
      case 'good': return 'bg-green-500'
      case 'fair': return 'bg-yellow-500'
      case 'poor': return 'bg-orange-500'
      case 'disconnected': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Network status indicator
  const NetworkStatusIndicator = () => {
    const quality = getConnectionQuality()
    
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
          {status.isConnected ? (
            <WifiIcon className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOffIcon className="h-4 w-4 text-red-600" />
          )}
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getConnectionQualityColor(quality)}`} />
            <span className="text-xs font-medium">
              {isOfflineMode ? 'Offline Mode' : 
               status.isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {status.isConnected && status.rtt > 0 && (
            <Badge variant="outline" className="text-xs">
              {status.rtt}ms
            </Badge>
          )}
        </div>
      </div>
    )
  }

  // Network error overlay
  if (showNetworkAlert && !isOfflineMode) {
    return (
      <>
        <NetworkStatusIndicator />
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <WifiOffIcon className="h-8 w-8 text-red-600" />
                <div>
                  <CardTitle className="text-xl">Connection Lost</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Network error #{networkErrorCount}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  Your internet connection has been lost. Your exam progress has been automatically saved.
                </AlertDescription>
              </Alert>

              {lastSaveAttempt && (
                <Alert>
                  <AlertDescription>
                    <strong>Last saved:</strong> {lastSaveAttempt.toLocaleTimeString()}
                    <br />
                    You can safely continue in offline mode or wait for connection to restore.
                  </AlertDescription>
                </Alert>
              )}

              {lastConnected && (
                <div className="text-sm text-muted-foreground">
                  <strong>Last connected:</strong> {lastConnected.toLocaleTimeString()}
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleRetryConnection}
                  className="flex items-center gap-2"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Retry Connection
                </Button>
                
                {allowOfflineMode && (
                  <Button 
                    variant="outline" 
                    onClick={handleEnableOfflineMode}
                    className="flex items-center gap-2"
                  >
                    <WifiOffIcon className="h-4 w-4" />
                    Continue in Offline Mode
                  </Button>
                )}
              </div>

              <div className="text-xs text-muted-foreground">
                <p>
                  <strong>Offline Mode:</strong> You can continue taking your exam without internet. 
                  Your progress will be saved locally and synced when connection is restored.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  return (
    <>
      <NetworkStatusIndicator />
      {children}
    </>
  )
}

/**
 * Hook for handling network errors in exam components
 */
export function useNetworkErrorHandler(examSession?: ExamSession, questions?: Question[]) {
  const { status, actions, isOfflineMode } = useNetworkStatus()
  const [hasNetworkError, setHasNetworkError] = useState(false)

  // Monitor network status
  useEffect(() => {
    setHasNetworkError(!status.isConnected && !isOfflineMode)
  }, [status.isConnected, isOfflineMode])

  // Auto-save on network issues
  useEffect(() => {
    if (hasNetworkError && examSession && questions) {
      saveSessionForRecovery(examSession, questions, {
        validateIntegrity: true,
        autoCleanup: true
      })
    }
  }, [hasNetworkError, examSession, questions])

  const handleNetworkError = useCallback((error: Error) => {
    console.error('Network error in exam:', error)
    
    // Save session if we have the data
    if (examSession && questions) {
      saveSessionForRecovery(examSession, questions, {
        validateIntegrity: false, // Don't validate on error
        autoCleanup: true
      })
    }
  }, [examSession, questions])

  return {
    hasNetworkError,
    isOfflineMode,
    networkStatus: status,
    enableOfflineMode: actions.enableOfflineMode,
    retryConnection: actions.retryConnection,
    handleNetworkError
  }
}