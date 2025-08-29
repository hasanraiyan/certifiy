/**
 * Custom hook for monitoring page visibility and focus
 * Handles browser tab switching, window focus loss, and navigation attempts
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export function usePageVisibility(options = {}) {
  const {
    onVisibilityChange,
    onFocusLoss,
    onFocusGain,
    trackHiddenTime = true,
    warnOnNavigation = true
  } = options

  // State
  const [isVisible, setIsVisible] = useState(!document.hidden)
  const [isDocumentHidden, setIsDocumentHidden] = useState(document.hidden)
  const [isWindowFocused, setIsWindowFocused] = useState(document.hasFocus())
  const [visibilityState, setVisibilityState] = useState(document.visibilityState)
  const [lastVisibilityChange, setLastVisibilityChange] = useState(null)
  const [totalHiddenTime, setTotalHiddenTime] = useState(0)
  const [hiddenSessions, setHiddenSessions] = useState([])

  // Refs
  const hiddenStartTimeRef = useRef(null)
  const listenersRef = useRef([])
  const preventNavigationRef = useRef(false)

  // Calculate current state
  const getCurrentState = useCallback(() => {
    return {
      isVisible,
      isDocumentHidden,
      isWindowFocused,
      visibilityState,
      lastVisibilityChange,
      totalHiddenTime,
      hiddenSessions
    }
  }, [isVisible, isDocumentHidden, isWindowFocused, visibilityState, lastVisibilityChange, totalHiddenTime, hiddenSessions])

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    const hidden = document.hidden
    const newVisibilityState = document.visibilityState
    const now = new Date()

    setIsDocumentHidden(hidden)
    setVisibilityState(newVisibilityState)
    setLastVisibilityChange(now)

    // Update overall visibility (combination of document and window focus)
    const newIsVisible = !hidden && document.hasFocus()
    const wasVisible = isVisible

    if (newIsVisible !== wasVisible) {
      setIsVisible(newIsVisible)

      // Track hidden time if enabled
      if (trackHiddenTime) {
        if (!newIsVisible && !hiddenStartTimeRef.current) {
          // Started being hidden
          hiddenStartTimeRef.current = now
          setHiddenSessions(prev => [...prev, { start: now }])
        } else if (newIsVisible && hiddenStartTimeRef.current) {
          // Became visible again
          const hiddenDuration = now.getTime() - hiddenStartTimeRef.current.getTime()
          setTotalHiddenTime(prev => prev + hiddenDuration)
          
          setHiddenSessions(prev => {
            const updated = [...prev]
            const lastSession = updated[updated.length - 1]
            if (lastSession && !lastSession.end) {
              lastSession.end = now
              lastSession.duration = hiddenDuration
            }
            return updated
          })
          
          hiddenStartTimeRef.current = null
        }
      }

      // Call callbacks
      const currentState = getCurrentState()
      
      if (!newIsVisible) {
        onFocusLoss?.(currentState)
      } else {
        onFocusGain?.(currentState)
      }
      
      onVisibilityChange?.(newIsVisible, currentState)
      
      // Notify listeners
      listenersRef.current.forEach(listener => listener(currentState))
    }
  }, [isVisible, trackHiddenTime, onVisibilityChange, onFocusLoss, onFocusGain, getCurrentState])

  // Handle window focus/blur
  const handleFocus = useCallback(() => {
    setIsWindowFocused(true)
    handleVisibilityChange()
  }, [handleVisibilityChange])

  const handleBlur = useCallback(() => {
    setIsWindowFocused(false)
    handleVisibilityChange()
  }, [handleVisibilityChange])

  // Handle beforeunload (navigation attempts)
  const handleBeforeUnload = useCallback((event) => {
    if (preventNavigationRef.current && warnOnNavigation) {
      const message = 'You have an exam in progress. Are you sure you want to leave? Your progress will be saved.'
      event.preventDefault()
      event.returnValue = message
      return message
    }
  }, [warnOnNavigation])

  // Handle page unload
  const handleUnload = useCallback(() => {
    // Final save attempt or cleanup
    const event = new CustomEvent('exam:pageUnload', {
      detail: { state: getCurrentState() }
    })
    window.dispatchEvent(event)
  }, [getCurrentState])

  // Actions
  const resetHiddenTime = useCallback(() => {
    setTotalHiddenTime(0)
    setHiddenSessions([])
    hiddenStartTimeRef.current = null
  }, [])

  const addVisibilityListener = useCallback((callback) => {
    listenersRef.current.push(callback)
    
    // Return cleanup function
    return () => {
      listenersRef.current = listenersRef.current.filter(listener => listener !== callback)
    }
  }, [])

  const preventNavigation = useCallback((prevent) => {
    preventNavigationRef.current = prevent
  }, [])

  // Effects
  useEffect(() => {
    // Set up event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('unload', handleUnload)

    // Initial state check
    handleVisibilityChange()

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('unload', handleUnload)
    }
  }, [handleVisibilityChange, handleFocus, handleBlur, handleBeforeUnload, handleUnload])

  // Clean up hidden time tracking on unmount
  useEffect(() => {
    return () => {
      if (hiddenStartTimeRef.current && trackHiddenTime) {
        const now = new Date()
        const hiddenDuration = now.getTime() - hiddenStartTimeRef.current.getTime()
        setTotalHiddenTime(prev => prev + hiddenDuration)
      }
    }
  }, [trackHiddenTime])

  const state = getCurrentState()
  const actions = {
    resetHiddenTime,
    addVisibilityListener,
    preventNavigation
  }

  return { state, actions }
}

/**
 * Hook for exam-specific page visibility handling
 */
export function useExamPageVisibility(options) {
  const {
    onTabSwitch,
    onFocusLoss,
    onSuspiciousActivity,
    maxHiddenTime = 5 * 60 * 1000, // 5 minutes
    warnThreshold = 30 * 1000 // 30 seconds
  } = options

  const [warnings, setWarnings] = useState([])
  const [violations, setViolations] = useState([])

  const { state, actions } = usePageVisibility({
    onVisibilityChange: (isVisible, visibilityState) => {
      onTabSwitch?.(isVisible)
      
      if (!isVisible) {
        onFocusLoss?.()
        
        // Log potential violation
        setViolations(prev => [...prev, {
          type: 'focus_loss',
          timestamp: new Date()
        }])
      }
    },
    
    onFocusGain: (visibilityState) => {
      // Check if hidden time exceeds thresholds
      const lastSession = visibilityState.hiddenSessions[visibilityState.hiddenSessions.length - 1]
      
      if (lastSession?.duration) {
        if (lastSession.duration > maxHiddenTime) {
          onSuspiciousActivity?.('Extended tab switching detected')
          setWarnings(prev => [...prev, `Extended absence detected: ${Math.round(lastSession.duration / 1000)}s`])
          
          setViolations(prev => {
            const updated = [...prev]
            const lastViolation = updated[updated.length - 1]
            if (lastViolation && lastViolation.type === 'focus_loss') {
              lastViolation.duration = lastSession.duration
            }
            return updated
          })
        } else if (lastSession.duration > warnThreshold) {
          setWarnings(prev => [...prev, `Tab switching detected: ${Math.round(lastSession.duration / 1000)}s`])
        }
      }
    },
    
    trackHiddenTime: true,
    warnOnNavigation: true
  })

  const clearWarnings = useCallback(() => {
    setWarnings([])
  }, [])

  const getViolationSummary = useCallback(() => {
    const totalViolations = violations.length
    const totalHiddenTime = violations.reduce((sum, v) => sum + (v.duration || 0), 0)
    const averageHiddenTime = totalViolations > 0 ? totalHiddenTime / totalViolations : 0
    
    return {
      totalViolations,
      totalHiddenTime,
      averageHiddenTime,
      violations
    }
  }, [violations])

  return {
    ...state,
    warnings,
    violations,
    actions: {
      ...actions,
      clearWarnings
    },
    getViolationSummary
  }
}