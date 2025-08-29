'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, BookOpen, BarChart3, MessageSquareQuote } from 'lucide-react';

export function AuthLayout({ children, slides, title, subtitle }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel (Enhanced Visuals) - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary to-blue-800 p-8 flex-col text-white relative overflow-hidden">
        
        {/* Floating Shapes */}
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '-3s' }}></div>
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '-8s' }}></div>
        
        {/* Header with Logo */}
        <div className="flex items-center space-x-2 text-2xl font-bold z-10">
          <CheckCircle className="h-8 w-8 text-accent" />
          <span>Certify</span>
        </div>

        {/* Slideshow Content */}
        <div className="m-auto max-w-md text-center z-10">
          <div className="animate-in fade-in duration-1000">
            <div className="flex justify-center mb-4">
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-3xl font-bold">{slides[currentSlide].headline}</h2>
            <p className="mt-4 text-lg opacity-80">{slides[currentSlide].text}</p>
          </div>
        </div>

        {/* Bottom Feature Bar */}
        <div className="mt-auto flex justify-around items-center text-center text-sm opacity-70 z-10">
          <div className="flex flex-col items-center space-y-1">
            <BookOpen className="w-6 h-6" />
            <span>Realistic Questions</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <BarChart3 className="w-6 h-6" />
            <span>Detailed Analytics</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <MessageSquareQuote className="w-6 h-6" />
            <span>Expert Explanations</span>
          </div>
        </div>
      </div>

      {/* Right Panel (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4">
        {/* Logo - visible on mobile */}
        <Link href="/" className="lg:hidden flex items-center space-x-2 text-2xl font-bold text-primary mb-8">
          <CheckCircle className="h-8 w-8 text-accent" />
          <span>Certify</span>
        </Link>

        {/* Form Card */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 lg:shadow-none lg:border-none">
          <div className="p-8 md:p-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              <p className="mt-2 text-gray-600">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}