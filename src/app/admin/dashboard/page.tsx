'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock admin stats data
  const stats = {
    totalUsers: 1247,
    newUsersThisMonth: 89,
    totalRevenue: 24750,
    revenueThisMonth: 3420,
    totalQuestions: 2156,
    totalTests: 45,
    activeSubscriptions: 892,
    completedTests: 5634
  };

  const recentActivity = [
    { id: 1, type: 'user_signup', description: 'New user registered: john.doe@example.com', time: '2 minutes ago' },
    { id: 2, type: 'test_completed', description: 'User completed PMP Mock Exam #1 with 85% score', time: '5 minutes ago' },
    { id: 3, type: 'subscription', description: 'Premium Bundle purchased by sarah.wilson@example.com', time: '12 minutes ago' },
    { id: 4, type: 'question_added', description: 'New question added to Risk Management category', time: '1 hour ago' }
  ];

  const popularTests = [
    { name: 'PMP Mock Exam #1', attempts: 234, avgScore: 76 },
    { name: 'Agile Practice Test', attempts: 189, avgScore: 82 },
    { name: 'Integration Management', attempts: 156, avgScore: 74 },
    { name: 'Risk Management Quiz', attempts: 134, avgScore: 79 }
  ];

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of platform performance and key metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-sm text-green-600">+{stats.newUsersThisMonth} this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-sm text-green-600">${stats.revenueThisMonth.toLocaleString()} this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeSubscriptions.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Premium subscribers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tests Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTests.toLocaleString()}</div>
                <p className="text-sm text-gray-600">All time</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activities and events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'user_signup' ? 'bg-blue-500' :
                        activity.type === 'test_completed' ? 'bg-green-500' :
                        activity.type === 'subscription' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Tests</CardTitle>
                <CardDescription>Most attempted tests and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularTests.map((test, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">{test.attempts} attempts</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{test.avgScore}%</div>
                        <div className="text-sm text-gray-600">avg score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Question Bank</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{stats.totalQuestions.toLocaleString()}</div>
                <p className="text-gray-600 mb-4">Total questions available</p>
                <Button asChild size="sm">
                  <Link href="/admin/questions">Manage Questions</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{stats.totalTests}</div>
                <p className="text-gray-600 mb-4">Available tests and exams</p>
                <Button asChild size="sm">
                  <Link href="/admin/tests">Manage Tests</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">${stats.totalRevenue.toLocaleString()}</div>
                <p className="text-gray-600 mb-4">Total platform revenue</p>
                <Button asChild size="sm">
                  <Link href="/admin/reports">View Reports</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline">
                  <Link href="/admin/questions">Add Question</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/tests">Create Test</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/users">View Users</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/plans">Manage Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}