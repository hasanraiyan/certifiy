/**
 * Custom hook for monitoring network connectivity during exams
 * Handles network issues and provides offline capabilities
 */

import { useState, useEffect, useCallback, useRef } from 'react'

const CONNECTION_CHECK_URL = '/api/health' // Fallback to a simple endpoint
const CONNECTION_TIMEOUT = 5000 // 5 seconds
const RETRY_INTERVALS = [1000, 2000, 5000, 10000] // Progressive retry intervals

export function useNetworkStatus() {
  // Core network status
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isConnected, setIsConnected] = useState(navigator.onLine)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [lastConnected, setLastConnected] = useState(
    navigator.onLine ? new Date() : null
  )
  
  // Connection history for analytics
  const [connectionHistory, setConnectionHistory] = useState([])
  
  // Network information (if available)
  const [networkInfo, setNetworkInfo] = useState({
    connectionType: 'unknown',
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  })

  // Refs for managing intervals and retries
  const retryTimeoutRef = useRef(null)
  const connectionCheckIntervalRef = useRef(null)
  const retryCountRef = useRef(0)

  // Update network information if Network Information API is available
  const updateNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection
      setNetworkInfo({
        connectionType: connection.type || 'unknown',
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      })
    }
  }, [])

  // Add connection event to history
  const addConnectionEvent = useCallback((isOnline) => {
    setConnectionHistory(prev => {
      const newEvent = { timestamp: new Date(), isOnline }
      const updated = [...prev, newEvent]
      
      // Keep only last 50 events
      if (updated.length > 50) {
        updated.splice(0, updated.length - 50)
      }
      
      return updated
    })
  }, [])

  // Check actual connectivity by making a request
  const checkConnection = useCallback(async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT)

      const response = await fetch(CONNECTION_CHECK_URL, {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      return response.ok
    } catch (error) {
      // If the health endpoint doesn't exist, try a simple request
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), CONNECTION_TIMEOUT)

        await fetch(window.location.origin, {
          method: 'HEAD',
          cache: 'no-cache',
          signal: controller.signal
        })

        clearTimeout(timeoutId)
        return true
      } catch {
        return false
      }
    }
  }, [])

  // Retry connection with progressive backoff
  const retryConnection = useCallback(async () => {
    const retryInterval = RETRY_INTERVALS[Math.min(retryCountRef.current, RETRY_INTERVALS.length - 1)]
    
    return new Promise((resolve) => {
      retryTimeoutRef.current = setTimeout(async () => {
        const isConnected = await checkConnection()
        
        if (isConnected) {
          retryCountRef.current = 0
          setIsConnected(true)
          setLastConnected(new Date())
          addConnectionEvent(true)
          resolve(true)
        } else {
          retryCountRef.current++
          resolve(false)
        }
      }, retryInterval)
    })
  }, [checkConnection, addConnectionEvent])

  // Enable offline mode
  const enableOfflineMode = useCallback(() => {
    setIsOfflineMode(true)
    console.log('Offline mode enabled - exam will continue without network connectivity')
  }, [])

  // Disable offline mode
  const disableOfflineMode = useCallback(() => {
    setIsOfflineMode(false)
    console.log('Offline mode disabled - network connectivity required')
  }, [])

  // Handle online/offline events
  const handleOnline = useCallback(async () => {
    setIsOnline(true)
    addConnectionEvent(true)
    
    // Verify actual connectivity
    const actuallyConnected = await checkConnection()
    setIsConnected(actuallyConnected)
    
    if (actuallyConnected) {
      setLastConnected(new Date())
      retryCountRef.current = 0
      
      // Clear any retry timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
    
    updateNetworkInfo()
  }, [checkConnection, addConnectionEvent, updateNetworkInfo])

  const handleOffline = useCallback(() => {
    setIsOnline(false)
    setIsConnected(false)
    addConnectionEvent(false)
    updateNetworkInfo()
  }, [addConnectionEvent, updateNetworkInfo])

  // Periodic connection check
  const startConnectionMonitoring = useCallback(() => {
    if (connectionCheckIntervalRef.current) {
      clearInterval(connectionCheckIntervalRef.current)
    }

    connectionCheckIntervalRef.current = setInterval(async () => {
      if (isOnline && !isOfflineMode) {
        const actuallyConnected = await checkConnection()
        
        if (actuallyConnected !== isConnected) {
          setIsConnected(actuallyConnected)
          
          if (actuallyConnected) {
            setLastConnected(new Date())
            retryCountRef.current = 0
          } else {
            // Start retry process
            retryConnection()
          }
        }
      }
    }, 30000) // Check every 30 seconds
  }, [isOnline, isConnected, isOfflineMode, checkConnection, retryConnection])

  // Effects
  useEffect(() => {
    // Set up event listeners
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set up network information listeners if available
    if ('connection' in navigator) {
      const connection = navigator.connection
      connection.addEventListener('change', updateNetworkInfo)
    }

    // Initial network info update
    updateNetworkInfo()

    // Start connection monitoring
    startConnectionMonitoring()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      
      if ('connection' in navigator) {
        const connection = navigator.connection
        connection.removeEventListener('change', updateNetworkInfo)
      }

      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
      
      if (connectionCheckIntervalRef.current) {
        clearInterval(connectionCheckIntervalRef.current)
      }
    }
  }, [handleOnline, handleOffline, updateNetworkInfo, startConnectionMonitoring])

  // Auto-retry when offline
  useEffect(() => {
    if (!isConnected && !isOfflineMode && isOnline) {
      const startRetrying = async () => {
        let retrySuccess = false
        
        while (!retrySuccess && !isOfflineMode) {
          retrySuccess = await retryConnection()
          
          if (!retrySuccess) {
            // Wait before next retry
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

      startRetrying()
    }
  }, [isConnected, isOfflineMode, isOnline, retryConnection])

  const status = {
    isOnline,
    isConnected,
    connectionType: networkInfo.connectionType,
    effectiveType: networkInfo.effectiveType,
    downlink: networkInfo.downlink,
    rtt: networkInfo.rtt,
    saveData: networkInfo.saveData
  }

  const actions = {
    checkConnection,
    retryConnection,
    enableOfflineMode,
    disableOfflineMode
  }

  return {
    status,
    actions,
    isOfflineMode,
    lastConnected,
    connectionHistory
  }
}