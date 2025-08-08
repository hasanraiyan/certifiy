'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const isResetMode = !!token;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // TODO: Implement actual forgot password logic
      console.log('Forgot password for:', email);
      
      setTimeout(() => {
        setMessage('If an account with that email exists, we\'ve sent you a reset link.');
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual password reset logic
      console.log('Reset password with token:', token, 'new password:', password);
      
      setTimeout(() => {
        setMessage('Password reset successful! You can now sign in with your new password.');
        setIsLoading(false);
      }, 1000);
      
    } catch (err) {
      setError('Failed to reset password. The link may be expired.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isResetMode ? 'Reset Password' : 'Forgot Password'}
          </CardTitle>
          <CardDescription>
            {isResetMode 
              ? 'Enter your new password below'
              : 'Enter your email to receive a reset link'
            }
          </CardDescription>
        </CardHeader>

        <form onSubmit={isResetMode ? handleResetPassword : handleForgotPassword}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
                {message}
              </div>
            )}

            {!isResetMode ? (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading 
                ? (isResetMode ? 'Resetting...' : 'Sending...') 
                : (isResetMode ? 'Reset Password' : 'Send Reset Link')
              }
            </Button>

            <div className="text-center text-sm text-gray-600">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}