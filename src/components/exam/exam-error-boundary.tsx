"use client"

import * as React from "react"
import { Component, ErrorInfo, ReactNode } from "react"
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExamErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  sessionId?: string
}

interface ExamErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  errorId: string
}

/**
 * Error boundary specifically designed for exam components
 * Provides graceful error handling with recovery options
 */
export class ExamErrorBoundary extends Component<ExamErrorBoundaryProps, ExamErrorBoundaryState> {
  private retryCount = 0
  private maxRetries = 3

  constructor(props: ExamErrorBoundaryProps) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: this.generateErrorId()
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ExamErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    })

    // Log error details
    console.error('Exam Error Boundary caught an error:', error)
    console.error('Error Info:', errorInfo)

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo)
  }

  private generateErrorId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      // In a real application, you would send this to your error monitoring service
      const errorReport = {
        errorId: this.state.errorId,
        sessionId: this.props.sessionId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }

      // Store error locally for debugging
      const existingErrors = JSON.parse(localStorage.getItem('exam_errors') || '[]')
      existingErrors.push(errorReport)
      
      // Keep only last 10 errors
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10)
      }
      
      localStorage.setItem('exam_errors', JSON.stringify(existingErrors))
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError)
    }
  }

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: this.generateErrorId()
      })
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private getErrorType(error: Error): string {
    if (error.name === 'ChunkLoadError') {
      return 'chunk_load'
    }
    if (error.message.includes('Network')) {
      return 'network'
    }
    if (error.message.includes('localStorage') || error.message.includes('storage')) {
      return 'storage'
    }
    if (error.message.includes('timer') || error.message.includes('Timer')) {
      return 'timer'
    }
    if (error.message.includes('session') || error.message.includes('Session')) {
      return 'session'
    }
    return 'unknown'
  }

  private getErrorMessage(errorType: string): { title: string; description: string; canRetry: boolean } {
    switch (errorType) {
      case 'chunk_load':
        return {
          title: 'Loading Error',
          description: 'Failed to load exam components. This might be due to a network issue or an app update.',
          canRetry: false
        }
      case 'network':
        return {
          title: 'Network Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          canRetry: true
        }
      case 'storage':
        return {
          title: 'Storage Error',
          description: 'Unable to save or load exam data. Your browser storage might be full or disabled.',
          canRetry: true
        }
      case 'timer':
        return {
          title: 'Timer Error',
          description: 'The exam timer encountered an error. Your progress has been saved.',
          canRetry: true
        }
      case 'session':
        return {
          title: 'Session Error',
          description: 'There was an issue with your exam session. Your progress may have been saved.',
          canRetry: true
        }
      default:
        return {
          title: 'Unexpected Error',
          description: 'An unexpected error occurred. Your exam progress has been saved where possible.',
          canRetry: true
        }
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback
      }

      const errorType = this.getErrorType(this.state.error)
      const errorMessage = this.getErrorMessage(errorType)
      const canRetry = errorMessage.canRetry && this.retryCount < this.maxRetries

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <AlertTriangleIcon className="h-8 w-8 text-destructive" />
                <div>
                  <CardTitle className="text-xl">{errorMessage.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Error ID: {this.state.errorId}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Alert>
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage.description}
                </AlertDescription>
              </Alert>

              {this.props.sessionId && (
                <Alert>
                  <AlertDescription>
                    <strong>Session ID:</strong> {this.props.sessionId}
                    <br />
                    Your exam progress should be automatically saved. You can try to resume your exam after resolving this issue.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error Details (in development) */}
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium mb-2">
                    Technical Details (Development)
                  </summary>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto bg-background p-2 rounded border">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto bg-background p-2 rounded border">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Recovery Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {canRetry && (
                  <Button 
                    onClick={this.handleRetry}
                    className="flex items-center gap-2"
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                    Try Again ({this.maxRetries - this.retryCount} attempts left)
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={this.handleReload}
                  className="flex items-center gap-2"
                >
                  <RefreshCwIcon className="h-4 w-4" />
                  Reload Page
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={this.handleGoHome}
                  className="flex items-center gap-2"
                >
                  <HomeIcon className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </div>

              {/* Additional Help */}
              <div className="text-sm text-muted-foreground">
                <p>
                  If this problem persists, please contact support with the Error ID above.
                  Your exam progress is automatically saved and you should be able to resume where you left off.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook version of the error boundary for functional components
 */
export function useExamErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const handleError = React.useCallback((error: Error) => {
    console.error('Exam error caught by hook:', error)
    setError(error)
  }, [])

  React.useEffect(() => {
    if (error) {
      // Report error
      const errorReport = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }

      try {
        const existingErrors = JSON.parse(localStorage.getItem('exam_errors') || '[]')
        existingErrors.push(errorReport)
        localStorage.setItem('exam_errors', JSON.stringify(existingErrors))
      } catch (reportingError) {
        console.error('Failed to report error:', reportingError)
      }
    }
  }, [error])

  return {
    error,
    resetError,
    handleError
  }
}