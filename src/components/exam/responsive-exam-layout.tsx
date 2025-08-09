"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { MenuIcon, XIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

interface ResponsiveExamLayoutProps {
  children: React.ReactNode
  sidebar: React.ReactNode
  timer?: React.ReactNode
  progress?: React.ReactNode
  navigation?: React.ReactNode
  onPreviousQuestion?: () => void
  onNextQuestion?: () => void
  canGoPrevious?: boolean
  canGoNext?: boolean
  currentQuestion?: number
  totalQuestions?: number
}

/**
 * Responsive layout component for exam interface
 * Adapts to mobile, tablet, and desktop screen sizes
 */
export function ResponsiveExamLayout({
  children,
  sidebar,
  timer,
  progress,
  navigation,
  onPreviousQuestion,
  onNextQuestion,
  canGoPrevious = true,
  canGoNext = true,
  currentQuestion,
  totalQuestions
}: ResponsiveExamLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMobile()

  // Close sidebar when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  // Mobile Navigation Bar
  const MobileNavigation = () => (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-40">
      <div className="flex items-center justify-between max-w-sm mx-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousQuestion}
          disabled={!canGoPrevious}
          className="flex items-center gap-1"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        <div className="flex items-center gap-2 text-sm font-medium">
          {currentQuestion !== undefined && totalQuestions && (
            <span>
              {currentQuestion + 1} / {totalQuestions}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextQuestion}
          disabled={!canGoNext}
          className="flex items-center gap-1"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  // Mobile Header
  const MobileHeader = () => (
    <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 p-3">
      <div className="flex items-center justify-between">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <MenuIcon className="h-4 w-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="h-full overflow-y-auto">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Exam Navigation</h2>
              </div>
              <div className="p-4 space-y-4">
                {timer && (
                  <div>
                    {timer}
                  </div>
                )}
                {progress && (
                  <div>
                    {progress}
                  </div>
                )}
                {sidebar}
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-2">
          {currentQuestion !== undefined && totalQuestions && (
            <span className="text-sm font-medium">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
          )}
        </div>

        <div className="w-10" /> {/* Spacer for balance */}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <MobileHeader />

      <div className="flex h-screen lg:h-auto">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-4 space-y-4">
            {timer && (
              <div>
                {timer}
              </div>
            )}
            {progress && (
              <div>
                {progress}
              </div>
            )}
            {sidebar}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 lg:p-6 pb-20 lg:pb-6">
              <div className="max-w-4xl mx-auto">
                {children}
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto">
              {navigation || (
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={onPreviousQuestion}
                    disabled={!canGoPrevious}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                    Previous Question
                  </Button>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {currentQuestion !== undefined && totalQuestions && (
                      <span>
                        Question {currentQuestion + 1} of {totalQuestions}
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={onNextQuestion}
                    disabled={!canGoNext}
                    className="flex items-center gap-2"
                  >
                    Next Question
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation />
    </div>
  )
}

/**
 * Responsive card wrapper for exam components
 */
export function ResponsiveExamCard({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card 
      className={cn(
        "w-full max-w-none sm:max-w-2xl lg:max-w-4xl mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  )
}

/**
 * Hook for managing responsive exam layout state
 */
export function useResponsiveExamLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const isMobile = useMobile()

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileNavOpen(!mobileNavOpen)
    } else {
      setSidebarCollapsed(!sidebarCollapsed)
    }
  }

  return {
    sidebarCollapsed,
    mobileNavOpen,
    isMobile,
    toggleSidebar,
    setSidebarCollapsed,
    setMobileNavOpen
  }
}

/**
 * Responsive grid for exam components
 */
export function ResponsiveExamGrid({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn(
      "grid gap-4 sm:gap-6",
      "grid-cols-1",
      "lg:grid-cols-2 lg:gap-8",
      "xl:grid-cols-3",
      className
    )}>
      {children}
    </div>
  )
}

/**
 * Responsive spacing component
 */
export function ResponsiveSpacing({
  size = "md",
  className
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  const sizeClasses = {
    sm: "h-2 sm:h-3 lg:h-4",
    md: "h-4 sm:h-6 lg:h-8",
    lg: "h-6 sm:h-8 lg:h-12"
  }

  return <div className={cn(sizeClasses[size], className)} />
}