/**
 * Accessibility utilities for exam components
 * Provides keyboard navigation, screen reader support, and ARIA enhancements
 */

/**
 * Handle keyboard navigation events
 */
export function handleKeyboardNavigation(event, options) {
  const { key, shiftKey, ctrlKey, altKey } = event
  
  // Don't handle if modifier keys are pressed (except Shift for Tab)
  if ((ctrlKey || altKey) && key !== 'Tab') {
    return
  }

  let handled = false

  switch (key) {
    case 'ArrowUp':
      if (options.onArrowUp) {
        options.onArrowUp()
        handled = true
      }
      break
    case 'ArrowDown':
      if (options.onArrowDown) {
        options.onArrowDown()
        handled = true
      }
      break
    case 'ArrowLeft':
      if (options.onArrowLeft) {
        options.onArrowLeft()
        handled = true
      }
      break
    case 'ArrowRight':
      if (options.onArrowRight) {
        options.onArrowRight()
        handled = true
      }
      break
    case 'Enter':
      if (options.onEnter) {
        options.onEnter()
        handled = true
      }
      break
    case ' ':
      if (options.onSpace) {
        options.onSpace()
        handled = true
      }
      break
    case 'Escape':
      if (options.onEscape) {
        options.onEscape()
        handled = true
      }
      break
    case 'Tab':
      if (shiftKey && options.onShiftTab) {
        options.onShiftTab()
        handled = true
      } else if (!shiftKey && options.onTab) {
        options.onTab()
        handled = true
      }
      break
    case 'Home':
      if (options.onHome) {
        options.onHome()
        handled = true
      }
      break
    case 'End':
      if (options.onEnd) {
        options.onEnd()
        handled = true
      }
      break
    case 'PageUp':
      if (options.onPageUp) {
        options.onPageUp()
        handled = true
      }
      break
    case 'PageDown':
      if (options.onPageDown) {
        options.onPageDown()
        handled = true
      }
      break
  }

  if (handled) {
    if (options.preventDefault !== false) {
      event.preventDefault()
    }
    if (options.stopPropagation !== false) {
      event.stopPropagation()
    }
  }
}

/**
 * Generate ARIA labels for exam components
 */
export const ariaLabels = {
  question: (number, total, isAnswered, isBookmarked) =>
    `Question ${number} of ${total}${isAnswered ? ', answered' : ', not answered'}${isBookmarked ? ', bookmarked' : ''}`,
  
  questionOption: (optionIndex, optionText, isSelected, questionType) =>
    `${questionType === 'multiple-select' ? 'Checkbox' : 'Radio button'} option ${optionIndex + 1}: ${optionText}${isSelected ? ', selected' : ''}`,
  
  navigationButton: (questionNumber, status, isBookmarked) =>
    `Go to question ${questionNumber}${status === 'answered' ? ', answered' : ', not answered'}${isBookmarked ? ', bookmarked' : ''}${status === 'current' ? ', current question' : ''}`,
  
  timer: (timeRemaining, isTestMode) =>
    `${isTestMode ? 'Exam timer' : 'Practice timer'}: ${timeRemaining} remaining`,
  
  progress: (answered, total, percentage) =>
    `Progress: ${answered} of ${total} questions answered, ${percentage}% complete`,
  
  bookmark: (isBookmarked) =>
    isBookmarked ? 'Remove bookmark from this question' : 'Bookmark this question for review',
  
  submitExam: (answered, total) =>
    `Submit exam: ${answered} of ${total} questions answered`,
  
  reviewMode: (unanswered) =>
    `Review mode: ${unanswered} questions remain unanswered`
}

/**
 * Screen reader announcements
 */
export class ScreenReaderAnnouncer {
  static instance = null
  announceElement = null

  constructor() {
    if (ScreenReaderAnnouncer.instance) {
      return ScreenReaderAnnouncer.instance
    }
    
    ScreenReaderAnnouncer.instance = this
    this.createAnnounceElement()
  }

  static getInstance() {
    if (!ScreenReaderAnnouncer.instance) {
      ScreenReaderAnnouncer.instance = new ScreenReaderAnnouncer()
    }
    return ScreenReaderAnnouncer.instance
  }

  createAnnounceElement() {
    if (typeof window === 'undefined') return

    this.announceElement = document.createElement('div')
    this.announceElement.setAttribute('aria-live', 'polite')
    this.announceElement.setAttribute('aria-atomic', 'true')
    this.announceElement.setAttribute('class', 'sr-only')
    this.announceElement.style.position = 'absolute'
    this.announceElement.style.left = '-10000px'
    this.announceElement.style.width = '1px'
    this.announceElement.style.height = '1px'
    this.announceElement.style.overflow = 'hidden'
    
    document.body.appendChild(this.announceElement)
  }

  announce(message, priority = 'polite') {
    if (!this.announceElement) return

    this.announceElement.setAttribute('aria-live', priority)
    this.announceElement.textContent = message

    // Clear after announcement to allow repeated messages
    setTimeout(() => {
      if (this.announceElement) {
        this.announceElement.textContent = ''
      }
    }, 1000)
  }

  announceQuestionChange(questionNumber, totalQuestions, isAnswered) {
    this.announce(
      `Question ${questionNumber} of ${totalQuestions}${isAnswered ? ', previously answered' : ''}`,
      'polite'
    )
  }

  announceAnswerSelected(optionText, questionType) {
    const actionText = questionType === 'multiple-select' ? 'selected' : 'chosen'
    this.announce(`Option ${actionText}: ${optionText}`, 'polite')
  }

  announceBookmarkToggle(isBookmarked, questionNumber) {
    const action = isBookmarked ? 'added to' : 'removed from'
    this.announce(`Question ${questionNumber} ${action} bookmarks`, 'polite')
  }

  announceTimeWarning(timeRemaining) {
    this.announce(`Warning: ${timeRemaining} remaining`, 'assertive')
  }

  announceExamSubmission(answered, total) {
    this.announce(
      `Exam submitted with ${answered} of ${total} questions answered`,
      'assertive'
    )
  }

  announceError(error) {
    this.announce(`Error: ${error}`, 'assertive')
  }
}

/**
 * Focus management utilities
 */
export class FocusManager {
  static focusHistory = []
  static trapStack = []

  /**
   * Save current focus for later restoration
   */
  static saveFocus() {
    const activeElement = document.activeElement
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement)
    }
  }

  /**
   * Restore previously saved focus
   */
  static restoreFocus() {
    const lastFocused = this.focusHistory.pop()
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus()
      return true
    }
    return false
  }

  /**
   * Focus the first focusable element in a container
   */
  static focusFirst(container) {
    const focusable = this.getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[0].focus()
      return true
    }
    return false
  }

  /**
   * Focus the last focusable element in a container
   */
  static focusLast(container) {
    const focusable = this.getFocusableElements(container)
    if (focusable.length > 0) {
      focusable[focusable.length - 1].focus()
      return true
    }
    return false
  }

  /**
   * Get all focusable elements in a container
   */
  static getFocusableElements(container) {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ')

    return Array.from(container.querySelectorAll(focusableSelectors))
      .filter((element) => {
        return element.offsetWidth > 0 && element.offsetHeight > 0 && !element.hidden
      })
  }

  /**
   * Trap focus within a container
   */
  static trapFocus(container) {
    this.trapStack.push(container)
    
    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return

      const focusable = this.getFocusableElements(container)
      if (focusable.length === 0) return

      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey) {
        // Shift + Tab
        if (activeElement === firstFocusable) {
          event.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // Tab
        if (activeElement === lastFocusable) {
          event.preventDefault()
          firstFocusable.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    // Store cleanup function
    container._focusTrapCleanup = () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  /**
   * Release focus trap
   */
  static releaseFocusTrap() {
    const container = this.trapStack.pop()
    if (container && container._focusTrapCleanup) {
      container._focusTrapCleanup()
      delete container._focusTrapCleanup
    }
  }
}

/**
 * High contrast mode detection
 */
export function isHighContrastMode() {
  if (typeof window === 'undefined') return false
  
  // Check for Windows high contrast mode
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    return true
  }
  
  // Check for forced colors (Windows high contrast)
  if (window.matchMedia('(forced-colors: active)').matches) {
    return true
  }
  
  return false
}

/**
 * Reduced motion detection
 */
export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Color contrast utilities
 */
export function getContrastRatio(color1, color2) {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color library
  const getLuminance = (color) => {
    // This is a simplified version - use a proper color library in production
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * WCAG compliance levels
 */
export const WCAG_LEVELS = {
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5
}

/**
 * Check if color combination meets WCAG standards
 */
export function meetsWCAGStandards(foreground, background, level = 'AA_NORMAL') {
  const ratio = getContrastRatio(foreground, background)
  return ratio >= WCAG_LEVELS[level]
}

/**
 * Accessibility testing utilities
 */
export const a11yTest = {
  /**
   * Check if element has proper ARIA labels
   */
  hasAriaLabel(element) {
    return !!(
      element.getAttribute('aria-label') ||
      element.getAttribute('aria-labelledby') ||
      element.getAttribute('aria-describedby')
    )
  },

  /**
   * Check if interactive element is keyboard accessible
   */
  isKeyboardAccessible(element) {
    const tabIndex = element.getAttribute('tabindex')
    const isInteractive = ['button', 'input', 'select', 'textarea', 'a'].includes(
      element.tagName.toLowerCase()
    )
    
    return isInteractive || (tabIndex !== null && tabIndex !== '-1')
  },

  /**
   * Check if element has sufficient color contrast
   */
  hasSufficientContrast(element) {
    const styles = window.getComputedStyle(element)
    const color = styles.color
    const backgroundColor = styles.backgroundColor
    
    if (color && backgroundColor) {
      return meetsWCAGStandards(color, backgroundColor)
    }
    
    return true // Can't determine, assume it's fine
  },

  /**
   * Get accessibility issues for an element
   */
  getAccessibilityIssues(element) {
    const issues = []
    
    if (!this.hasAriaLabel(element) && element.tagName.toLowerCase() === 'button') {
      issues.push('Button missing accessible name')
    }
    
    if (!this.isKeyboardAccessible(element) && element.onclick) {
      issues.push('Interactive element not keyboard accessible')
    }
    
    if (!this.hasSufficientContrast(element)) {
      issues.push('Insufficient color contrast')
    }
    
    return issues
  }
}