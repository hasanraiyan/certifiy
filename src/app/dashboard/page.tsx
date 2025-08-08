'use client';

import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function StudentDashboard() {
  // Mock data - replace with real data
  const stats = {
    totalTests: 12,
    completedTests: 8,
    averageScore: 78,
    studyStreak: 5
  };

  const recentTests = [
    { id: 1, name: 'PMP Mock Exam #1', score: 82, date: '2025-01-15', status: 'completed' },
    { id: 2, name: 'Agile Practice Test', score: 75, date: '2025-01-14', status: 'completed' },
    { id: 3, name: 'Risk Management Quiz', score: null, date: null, status: 'in-progress' }
  ];

  const availableTests = [
    { id: 4, name: 'PMP Mock Exam #2', questions: 180, duration: '4 hours' },
    { id: 5, name: 'Integration Management', questions: 50, duration: '1 hour' },
    { id: 6, name: 'Stakeholder Management', questions: 40, duration: '45 min' }
  ];

  return (
    <AuthGuard allowedRoles={['student']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Continue your PMP preparation journey.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTests}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedTests}</div>
                <Progress value={(stats.completedTests / stats.totalTests) * 100} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore}%</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Study Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.studyStreak} days</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Tests</CardTitle>
                <CardDescription>Your latest test attempts and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">
                          {test.status === 'completed' 
                            ? `Score: ${test.score}% • ${test.date}`
                            : 'In Progress'
                          }
                        </p>
                      </div>
                      <div>
                        {test.status === 'completed' ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/results/${test.id}`}>View Results</Link>
                          </Button>
                        ) : (
                          <Button size="sm" asChild>
                            <Link href={`/exam/${test.id}`}>Continue</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Tests */}
            <Card>
              <CardHeader>
                <CardTitle>Available Tests</CardTitle>
                <CardDescription>Start a new practice test or mock exam</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availableTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{test.name}</h4>
                        <p className="text-sm text-gray-600">
                          {test.questions} questions • {test.duration}
                        </p>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/exam/setup">Start Test</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button asChild>
                    <Link href="/exam/setup">Start New Test</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/profile">View Profile</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/pricing">Upgrade Plan</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}