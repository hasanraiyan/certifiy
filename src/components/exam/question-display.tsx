"use client"

import * as React from "react"
import { BookmarkIcon, ZoomInIcon, VolumeXIcon, Volume2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Question, Answer } from "@/lib/exam/types"
import { useAnswerKeyboardNavigation } from "@/hooks/useKeyboardNavigation"
import { ariaLabels, ScreenReaderAnnouncer, FocusManager } from "@/lib/exam/accessibility"

interface QuestionDisplayProps {
  question: Question
  selectedAnswer: Answer | null
  onAnswerSelect: (answer: Answer) => void
  isBookmarked: boolean
  onBookmarkToggle: () => void
  showExplanation?: boolean
  questionNumber: number
  totalQuestions: number
  enableTextToSpeech?: boolean
  highContrastMode?: boolean
}

export function QuestionDisplay({
  question,
  selectedAnswer,
  onAnswerSelect,
  isBookmarked,
  onBookmarkToggle,
  showExplanation = false,
  questionNumber,
  totalQuestions,
  enableTextToSpeech = true,
  highContrastMode = false,
}: QuestionDisplayProps) {
  const [isReading, setIsReading] = React.useState(false)
  const [focusedOptionIndex, setFocusedOptionIndex] = React.useState<number | null>(null)
  const announcer = React.useMemo(() => ScreenReaderAnnouncer.getInstance(), [])
  const questionRef = React.useRef<HTMLDivElement>(null)
  const handleAnswerChange = (selectedOptions: number[]) => {
    const answer: Answer = {
      questionId: question.id,
      selectedOptions,
      timestamp: new Date(),
      timeSpent: 0, // This would be calculated by the parent component
    }
    onAnswerSelect(answer)
    
    // Announce answer selection to screen readers
    if (selectedOptions.length > 0) {
      const optionText = question.options[selectedOptions[selectedOptions.length - 1]]
      announcer.announceAnswerSelected(optionText, question.type)
    }
  }

  const handleSingleChoiceChange = (value: string) => {
    const optionIndex = parseInt(value, 10)
    handleAnswerChange([optionIndex])
  }

  const handleMultipleChoiceChange = (optionIndex: number, checked: boolean) => {
    const currentSelections = selectedAnswer?.selectedOptions || []
    let newSelections: number[]
    
    if (checked) {
      newSelections = [...currentSelections, optionIndex]
    } else {
      newSelections = currentSelections.filter(index => index !== optionIndex)
    }
    
    handleAnswerChange(newSelections)
  }

  const handleBookmarkToggle = () => {
    onBookmarkToggle()
    announcer.announceBookmarkToggle(!isBookmarked, questionNumber)
  }

  // Text-to-speech functionality
  const handleTextToSpeech = () => {
    if (!enableTextToSpeech || typeof window === 'undefined' || !window.speechSynthesis) {
      return
    }

    if (isReading) {
      window.speechSynthesis.cancel()
      setIsReading(false)
      return
    }

    const textToRead = `Question ${questionNumber}. ${question.text}. ${
      question.type === 'multiple-select' ? 'Select all that apply. ' : ''
    }Options: ${question.options.map((option, index) => `${index + 1}. ${option}`).join('. ')}`

    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8

    utterance.onstart = () => setIsReading(true)
    utterance.onend = () => setIsReading(false)
    utterance.onerror = () => setIsReading(false)

    window.speechSynthesis.speak(utterance)
  }

  // Keyboard navigation for answer options
  const keyboardNavRef = useAnswerKeyboardNavigation({
    options: question.options,
    selectedOptions: selectedAnswer?.selectedOptions || [],
    onAnswerSelect: (optionIndex) => {
      if (question.type === 'multiple-select') {
        const isSelected = selectedAnswer?.selectedOptions.includes(optionIndex) || false
        handleMultipleChoiceChange(optionIndex, !isSelected)
      } else {
        handleSingleChoiceChange(optionIndex.toString())
      }
    },
    questionType: question.type,
    enabled: true
  })

  // Focus management
  React.useEffect(() => {
    if (questionRef.current) {
      FocusManager.focusFirst(questionRef.current)
    }
  }, [questionNumber])

  // Announce question change
  React.useEffect(() => {
    const isAnswered = selectedAnswer && selectedAnswer.selectedOptions.length > 0
    announcer.announceQuestionChange(questionNumber, totalQuestions, !!isAnswered)
  }, [questionNumber, totalQuestions, selectedAnswer, announcer])

  const renderQuestionOptions = () => {
    const selectedOptions = selectedAnswer?.selectedOptions || []

    switch (question.type) {
      case 'multiple-choice':
      case 'true-false':
        return (
          <RadioGroup
            value={selectedOptions[0]?.toString() || ""}
            onValueChange={handleSingleChoiceChange}
            className="space-y-2 sm:space-y-3"
            aria-label={`Question ${questionNumber} options`}
          >
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors",
                  "hover:bg-muted/30 focus-within:bg-muted/50",
                  highContrastMode && "border border-foreground/20",
                  focusedOptionIndex === index && "ring-2 ring-primary ring-offset-2"
                )}
                onFocus={() => setFocusedOptionIndex(index)}
                onBlur={() => setFocusedOptionIndex(null)}
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`option-${index}`}
                  className="mt-0.5 shrink-0"
                  aria-describedby={`option-${index}-text`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  id={`option-${index}-text`}
                  className="flex-1 cursor-pointer text-xs sm:text-sm leading-relaxed"
                  aria-label={ariaLabels.questionOption(index, option, selectedOptions.includes(index), question.type)}
                >
                  <span className="font-medium text-muted-foreground mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case 'multiple-select':
        return (
          <div 
            className="space-y-2 sm:space-y-3"
            role="group"
            aria-label={`Question ${questionNumber} options - select all that apply`}
          >
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors",
                  "hover:bg-muted/30 focus-within:bg-muted/50",
                  highContrastMode && "border border-foreground/20",
                  focusedOptionIndex === index && "ring-2 ring-primary ring-offset-2"
                )}
                onFocus={() => setFocusedOptionIndex(index)}
                onBlur={() => setFocusedOptionIndex(null)}
              >
                <Checkbox
                  id={`option-${index}`}
                  checked={selectedOptions.includes(index)}
                  onCheckedChange={(checked) => 
                    handleMultipleChoiceChange(index, checked as boolean)
                  }
                  className="mt-0.5 shrink-0"
                  aria-describedby={`option-${index}-text`}
                />
                <Label
                  htmlFor={`option-${index}`}
                  id={`option-${index}-text`}
                  className="flex-1 cursor-pointer text-xs sm:text-sm leading-relaxed"
                  aria-label={ariaLabels.questionOption(index, option, selectedOptions.includes(index), question.type)}
                >
                  <span className="font-medium text-muted-foreground mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card 
      ref={questionRef}
      className={cn(
        "w-full max-w-4xl mx-auto",
        highContrastMode && "border-2 border-foreground"
      )}
      role="region"
      aria-label={ariaLabels.question(questionNumber, totalQuestions, !!selectedAnswer, isBookmarked)}
    >
      <CardHeader className="pb-4 sm:pb-6">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <CardTitle 
            className="text-base sm:text-lg font-medium leading-tight"
            id={`question-${questionNumber}-title`}
          >
            Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            {enableTextToSpeech && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleTextToSpeech}
                className="shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                aria-label={isReading ? "Stop reading question" : "Read question aloud"}
                disabled={typeof window === 'undefined' || !window.speechSynthesis}
              >
                {isReading ? (
                  <VolumeXIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                ) : (
                  <Volume2Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                )}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBookmarkToggle}
              className={cn(
                "shrink-0 transition-colors h-8 w-8 sm:h-10 sm:w-10",
                isBookmarked 
                  ? "text-yellow-600 hover:text-yellow-700" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={ariaLabels.bookmark(isBookmarked)}
              aria-pressed={isBookmarked}
            >
              <BookmarkIcon 
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4",
                  isBookmarked && "fill-current"
                )} 
              />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
        {/* Question Text */}
        <div className="prose prose-sm sm:prose-base max-w-none">
          <p 
            className="text-foreground leading-relaxed whitespace-pre-wrap text-sm sm:text-base"
            id={`question-${questionNumber}-text`}
            aria-labelledby={`question-${questionNumber}-title`}
          >
            {question.text}
          </p>
        </div>

        {/* Question Image */}
        {question.imageUrl && (
          <div className="flex justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative p-0 h-auto w-full max-w-lg group"
                  aria-label="Click to enlarge question diagram"
                >
                  <img
                    src={question.imageUrl}
                    alt={`Question ${questionNumber} diagram - click to enlarge`}
                    className="w-full h-auto rounded-lg border shadow-sm transition-opacity group-hover:opacity-90 group-focus:opacity-90"
                    style={{ maxHeight: '250px' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-black/20 rounded-lg">
                    <div className="bg-white/90 rounded-full p-2">
                      <ZoomInIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-700" />
                    </div>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent 
                className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-auto"
                aria-label="Enlarged question diagram"
              >
                <img
                  src={question.imageUrl}
                  alt={`Question ${questionNumber} diagram (enlarged view)`}
                  className="w-full h-auto"
                />
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Answer Options */}
        <div 
          className="space-y-3 sm:space-y-4"
          ref={keyboardNavRef}
          role="group"
          aria-labelledby={`question-${questionNumber}-title`}
          aria-describedby={`question-${questionNumber}-text`}
        >
          {question.type === 'multiple-select' && (
            <p 
              className="text-xs sm:text-sm text-muted-foreground font-medium"
              id={`question-${questionNumber}-instructions`}
              role="note"
            >
              Select all that apply:
            </p>
          )}
          <div className="space-y-2 sm:space-y-3">
            {renderQuestionOptions()}
          </div>
          
          {/* Keyboard shortcuts hint */}
          <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted/30 rounded">
            <p className="font-medium mb-1">Keyboard shortcuts:</p>
            <ul className="space-y-1">
              <li>• Use arrow keys to navigate options</li>
              <li>• Press Enter or Space to select</li>
              <li>• Press number keys (1-9) for quick selection</li>
              <li>• Press Space on question title to bookmark</li>
            </ul>
          </div>
        </div>

        {/* Explanation (shown in practice mode) */}
        {showExplanation && selectedAnswer && (
          <div 
            className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg border"
            role="region"
            aria-label="Answer explanation"
          >
            <h4 
              className="font-medium text-xs sm:text-sm mb-2"
              id={`question-${questionNumber}-explanation-title`}
            >
              Explanation:
            </h4>
            <p 
              className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
              aria-labelledby={`question-${questionNumber}-explanation-title`}
            >
              {question.explanation}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}