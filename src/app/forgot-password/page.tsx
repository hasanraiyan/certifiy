'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth/auth-layout';
import { authSlides } from '@/components/auth/auth-data';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      slides={authSlides.forgotPassword}
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a reset link."
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

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all">
          Send Reset Link
        </Button>

        {/* Back to Login */}
        <div className="text-center">
          <Link href="/login" className="text-sm font-medium text-primary hover:text-blue-800">
            ← Back to Login
          </Link>
        </div>
      </form>

      {/* Footer Link */}
      <div className="mt-8 text-center">
                  <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:text-blue-800">
              Sign up for free
            </Link>
          </p>
      </div>
    </AuthLayout>
  );
}
