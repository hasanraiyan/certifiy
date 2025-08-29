'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AuthLayout } from '@/components/auth/auth-layout';
import { authSlides } from '@/components/auth/auth-data';

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      slides={authSlides.resetPassword}
      title="Reset Your Password"
      subtitle="Create a new secure password for your account."
    >
      <form className="mt-8 space-y-6">
        {/* New Password Input */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-900">
            New Password
          </Label>
          <Input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your new password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            required
          />
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">
            Confirm New Password
          </Label>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your new password"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            required
          />
        </div>

        {/* Password Requirements */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Password Requirements:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase and lowercase letters</li>
            <li>• Includes numbers and special characters</li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-all">
          Reset Password
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
          Remember your password?{' '}
          <Link href="/login" className="font-semibold text-primary hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}