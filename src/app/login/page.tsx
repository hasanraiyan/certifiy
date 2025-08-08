'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CheckCircle, Clock, MessageCircle, Target, BookOpen, BarChart3, MessageSquareQuote } from 'lucide-react';

const slides = [
  {
    icon: <Target className="w-12 h-12 text-accent" />,
    headline: "Achieve PMP Certification",
    text: "Join a community of thousands who have successfully passed their exam using our proven methods."
  },
  {
    icon: <Clock className="w-12 h-12 text-accent" />,
    headline: "Simulate the Real Exam",
    text: "Our timed mock exams and diverse question bank mirror the actual PMP test environment perfectly."
  },
  {
    icon: <MessageCircle className="w-12 h-12 text-accent" />,
    headline: "From a Certified Professional...",
    text: "The performance analytics were a game-changer. I knew exactly what to focus on. Passed on my first attempt! - Emily R., PMP"
  }
];

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

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

      {/* Right Panel (Login Form) */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4">
        {/* Logo - visible on mobile */}
        <Link href="/" className="lg:hidden flex items-center space-x-2 text-2xl font-bold text-primary mb-8">
          <CheckCircle className="h-8 w-8 text-accent" />
          <span>Certify</span>
        </Link>

        {/* Login Card */}
        <Card className="w-full max-w-md shadow-lg border border-gray-200 lg:shadow-none lg:border-none">
          <CardContent className="p-8 md:p-10">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
              <p className="mt-2 text-gray-600">Sign in to continue your PMP journey.</p>
            </div>

            <form className="mt-8 space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-900">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-900">
                    Password
                  </Label>
                  <Link href="/reset-password" className="text-sm font-medium text-primary hover:text-blue-800">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all">
                Sign In
              </Button>

              {/* Separator */}
              <div className="flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-sm text-gray-600">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              {/* Social Login */}
              <Button type="button" variant="outline" className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-900 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-all">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M48 24C48 22.042 47.843 20.158 47.545 18.333H24V29.083H37.455C36.955 31.917 35.455 34.333 33.227 35.917V42.417H41.682C45.545 38.75 48 31.917 48 24Z" fill="#4285F4"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 48C30.955 48 36.818 45.667 40.682 42.417L33.227 35.917C30.955 37.5 27.727 38.5 24 38.5C17.455 38.5 11.818 34.167 9.955 28.25L1.5 34.917C5.364 42.75 13.818 48 24 48Z" fill="#34A853"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.955 28.25C9.5 26.833 9.227 25.417 9.227 24C9.227 22.583 9.5 21.167 9.955 19.75V13.083L1.5 19.75C.545 21.75 0 24 0 24C0 24 0 26.25 .545 28.25L9.955 28.25Z" fill="#FBBC05"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M24 9.5C27.045 9.5 29.818 10.583 32.045 12.583L40.864 3.75C36.818 1.417 30.955 0 24 0C13.818 0 5.364 5.25 1.5 13.083L9.955 19.75C11.818 13.833 17.455 9.5 24 9.5Z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
            </form>
          </CardContent>

          {/* Footer Link */}
          <CardFooter className="bg-gray-50 text-center p-4 border-t border-gray-200 rounded-b-xl lg:bg-transparent lg:border-none lg:p-0 lg:pt-6">
            <p className="text-sm text-gray-600 w-full">
              Don't have an account?{' '}
              <Link href="/signup" className="font-semibold text-primary hover:text-blue-800">
                Sign up for free
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}