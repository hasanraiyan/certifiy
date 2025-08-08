'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth/auth-layout';
import { authSlides } from '@/components/auth/auth-data';

export default function LoginPage() {
  return (
    <AuthLayout
      slides={authSlides.login}
      title="Welcome Back!"
      subtitle="Sign in to continue your PMP journey."
    >
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
            <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-blue-800">
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

      {/* Footer Link */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:text-blue-800">
            Sign up for free
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}