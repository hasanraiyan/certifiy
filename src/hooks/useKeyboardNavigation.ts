/**
 * Custom hook for keyboard navigation in exam components
 * Provides comprehensive keyboard support for accessibility
 */

import { useEffect, useCallback, useRef } from 'react'
import { handleKeyboardNavigation, KeyboardNavigationOptions } from '@/lib/exam/accessibility'

export interface UseKeyboardNavigationOptions extends KeyboardNavigationOptions {
  enabled?: boolean
  element?: HTMLElement | null
  dependencies?: unknown[]
}

export function useKeyboardNavigation(options: UseKeyboardNavigationOptions) {
  const {
    enabled = true,
    element,
    dependencies = [],
    ...navigationOptions
  } = options

  const elementRef = useRef<HTMLElement | null>(null)

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return
    handleKeyboardNavigation(event, navigationOptions)
  }, [enabled, ...dependencies])

  useEffect(() => {
    const targetElement = element || elementRef.current || document

    if (targetElement && enabled) {
      targetElement.addEventListener('keydown', handleKeyDown)
      
      return () => {
        targetElement.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [handleKeyDown, element, enabled])

  return elementRef
}

/**
 * Hook for question navigation keyboard shortcuts
 */
export function useQuestionKeyboardNavigation({
  onPreviousQuestion,
  onNextQuestion,
  onToggleBookmark,
  onSubmitAnswer,
  canGoPrevious = true,
  canGoNext = true,
  enabled = true
}: {
  onPreviousQuestion?: () => void
  onNextQuestion?: () => void
  onToggleBookmark?: () => void
  onSubmitAnswer?: () => void
  canGoPrevious?: boolean
  canGoNext?: boolean
  enabled?: boolean
}) {
  return useKeyboardNavigation({
    enabled,
    onArrowLeft: canGoPrevious ? onPreviousQuestion : undefined,
    onArrowRight: canGoNext ? onNextQuestion : undefined,
    onEnter: onSubmitAnswer,
    onSpace: onToggleBookmark,
    dependencies: [
      onPreviousQuestion,
      onNextQuestion,
      onToggleBookmark,
      onSubmitAnswer,
      canGoPrevious,
      canGoNext
    ]
  })
}

/**
 * Hook for question navigator keyboard shortcuts
 */
export function useNavigatorKeyboardNavigation({
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  onToggleBookmarkFilter,
  enabled = true
}: {
  questions: import('@/lib/exam/types').Question[]
  currentQuestionIndex: number
  onQuestionSelect: (index: number) => void
  onToggleBookmarkFilter?: () => void
  enabled?: boolean
}) {
  const navigateToQuestion = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const totalQuestions = questions.length
    let newIndex = currentQuestionIndex

    switch (direction) {
      case 'up':
        // Move up one row (assuming 10 questions per row)
        newIndex = Math.max(0, currentQuestionIndex - 10)
        break
      case 'down':
        // Move down one row
        newIndex = Math.min(totalQuestions - 1, currentQuestionIndex + 10)
        break
      case 'left':
        // Move to previous question
        newIndex = Math.max(0, currentQuestionIndex - 1)
        break
      case 'right':
        // Move to next question
        newIndex = Math.min(totalQuestions - 1, currentQuestionIndex + 1)
        break
    }

    if (newIndex !== currentQuestionIndex) {
      onQuestionSelect(newIndex)
    }
  }, [questions.length, currentQuestionIndex, onQuestionSelect])

  return useKeyboardNavigation({
    enabled,
    onArrowUp: () => navigateToQuestion('up'),
    onArrowDown: () => navigateToQuestion('down'),
    onArrowLeft: () => navigateToQuestion('left'),
    onArrowRight: () => navigateToQuestion('right'),
    onHome: () => onQuestionSelect(0),
    onEnd: () => onQuestionSelect(questions.length - 1),
    onSpace: onToggleBookmarkFilter,
    dependencies: [navigateToQuestion, onToggleBookmarkFilter]
  })
}

/**
 * Hook for answer selection keyboard shortcuts
 */
export function useAnswerKeyboardNavigation({
  options,
  selectedOptions,
  onAnswerSelect,
  questionType,
  enabled = true
}: {
  options: string[]
  selectedOptions: number[]
  onAnswerSelect: (optionIndex: number) => void
  questionType: 'multiple-choice' | 'multiple-select' | 'true-false'
  enabled?: boolean
}) {
  const currentOptionIndex = useRef(selectedOptions[0] || 0)

  const navigateOptions = useCallback((direction: 'up' | 'down') => {
    const totalOptions = options.length
    let newIndex = currentOptionIndex.current

    if (direction === 'up') {
      newIndex = Math.max(0, newIndex - 1)
    } else {
      newIndex = Math.min(totalOptions - 1, newIndex + 1)
    }

    currentOptionIndex.current = newIndex
    
    // Focus the option element
    const optionElement = document.getElementById(`option-${newIndex}`)
    if (optionElement) {
      optionElement.focus()
    }
  }, [options.length])

  const selectCurrentOption = useCallback(() => {
    onAnswerSelect(currentOptionIndex.current)
  }, [onAnswerSelect])

  const selectOptionByNumber = useCallback((number: number) => {
    const optionIndex = number - 1
    if (optionIndex >= 0 && optionIndex < options.length) {
      currentOptionIndex.current = optionIndex
      onAnswerSelect(optionIndex)
    }
  }, [options.length, onAnswerSelect])

  return useKeyboardNavigation({
    enabled,
    onArrowUp: () => navigateOptions('up'),
    onArrowDown: () => navigateOptions('down'),
    onEnter: selectCurrentOption,
    onSpace: selectCurrentOption,
    // Number keys 1-9 for quick selection
    onKeyDown: (event: KeyboardEvent) => {
      const number = parseInt(event.key)
      if (number >= 1 && number <= 9) {
        selectOptionByNumber(number)
        event.preventDefault()
      }
    },
    dependencies: [navigateOptions, selectCurrentOption, selectOptionByNumber]
  })
}

/**
 * Hook for exam review keyboard shortcuts
 */
export function useReviewKeyboardNavigation({
  questions,
  currentQuestionIndex,
  onQuestionSelect,
  onSubmitExam,
  onReturnToExam,
  enabled = true
}: {
  questions: import('@/lib/exam/types').Question[]
  currentQuestionIndex: number
  onQuestionSelect: (index: number) => void
  onSubmitExam?: () => void
  onReturnToExam?: () => void
  enabled?: boolean
}) {
  const navigateToUnanswered = useCallback((direction: 'next' | 'previous') => {
    // This would need to be implemented based on your answer tracking logic
    // For now, just navigate to next/previous question
    const totalQuestions = questions.length
    let newIndex = currentQuestionIndex

    if (direction === 'next') {
      newIndex = Math.min(totalQuestions - 1, currentQuestionIndex + 1)
    } else {
      newIndex = Math.max(0, currentQuestionIndex - 1)
    }

    onQuestionSelect(newIndex)
  }, [questions.length, currentQuestionIndex, onQuestionSelect])

  return useKeyboardNavigation({
    enabled,
    onArrowLeft: () => navigateToUnanswered('previous'),
    onArrowRight: () => navigateToUnanswered('next'),
    onHome: () => onQuestionSelect(0),
    onEnd: () => onQuestionSelect(questions.length - 1),
    onEnter: onSubmitExam,
    onEscape: onReturnToExam,
    dependencies: [navigateToUnanswered, onSubmitExam, onReturnToExam]
  })
}

/**
 * Hook for modal/dialog keyboard shortcuts
 */
export function useModalKeyboardNavigation({
  onClose,
  onConfirm,
  onCancel,
  enabled = true
}: {
  onClose?: () => void
  onConfirm?: () => void
  onCancel?: () => void
  enabled?: boolean
}) {
  return useKeyboardNavigation({
    enabled,
    onEscape: onClose || onCancel,
    onEnter: onConfirm,
    dependencies: [onClose, onConfirm, onCancel]
  })
}

/**
 * Hook for timer keyboard shortcuts
 */
export function useTimerKeyboardNavigation({
  onPauseResume,
  onShowTimeWarning,
  enabled = true
}: {
  onPauseResume?: () => void
  onShowTimeWarning?: () => void
  enabled?: boolean
}) {
  return useKeyboardNavigation({
    enabled,
    onSpace: onPauseResume,
    // Ctrl+T to show time warning
    onKeyDown: (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key.toLowerCase() === 't') {
        onShowTimeWarning?.()
        event.preventDefault()
      }
    },
    dependencies: [onPauseResume, onShowTimeWarning]
  })
}