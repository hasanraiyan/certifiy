'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: '2024-12-01',
    currentPlan: 'Premium Bundle',
    testsCompleted: 8,
    averageScore: 78
  };

  // Mock subscription data
  const subscriptionData = {
    plan: 'Premium Bundle',
    status: 'Active',
    nextBilling: '2025-12-01',
    price: '$99.00',
    features: [
      'Unlimited practice questions',
      '10+ full mock exams',
      'Advanced analytics',
      'Priority support'
    ]
  };

  // Mock payment history
  const paymentHistory = [
    { id: 1, date: '2024-12-01', amount: '$99.00', description: 'Premium Bundle - Lifetime', status: 'Completed' },
    { id: 2, date: '2024-11-15', amount: '$19.00', description: 'Single Mock Exam', status: 'Completed' }
  ];

  const [profileForm, setProfileForm] = useState({
    name: userData.name,
    email: userData.email
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // TODO: Implement profile update
      console.log('Profile update:', profileForm);
      
      setTimeout(() => {
        setMessage('Profile updated successfully!');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('Failed to update profile');
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('New passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement password change
      console.log('Password change');
      
      setTimeout(() => {
        setMessage('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('Failed to change password');
      setIsLoading(false);
    }
  };

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
            <p className="text-gray-600">Manage your account settings and subscription</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded ${
              message.includes('successfully') 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {message}
            </div>
          )}

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </CardContent>
                  </form>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-2xl font-bold">{userData.testsCompleted}</div>
                      <div className="text-sm text-gray-600">Tests Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{userData.averageScore}%</div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Member Since</div>
                      <div className="text-sm text-gray-600">{new Date(userData.joinDate).toLocaleDateString()}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <form onSubmit={handlePasswordChange}>
                  <CardContent className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </TabsContent>

            {/* Subscription Tab */}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-4">Plan Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Plan:</span>
                          <span className="font-medium">{subscriptionData.plan}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-medium text-green-600">{subscriptionData.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Price:</span>
                          <span className="font-medium">{subscriptionData.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Next Billing:</span>
                          <span className="font-medium">{subscriptionData.nextBilling}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Features Included</h4>
                      <ul className="space-y-1 text-sm">
                        {subscriptionData.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <div className="flex gap-4">
                      <Button variant="outline">Change Plan</Button>
                      <Button variant="outline">Cancel Subscription</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>View your past transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{payment.description}</div>
                          <div className="text-sm text-gray-600">{payment.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{payment.amount}</div>
                          <div className="text-sm text-green-600">{payment.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <Button variant="outline">Download Invoice</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
}