'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  CreditCard, 
  Users, 
  FileText, 
  Plus,
  TrendingUp,
  User
} from 'lucide-react';

const activityFeed = [
  {
    id: 1,
    type: 'purchase',
    title: 'New Purchase',
    description: 'Full Access by j.doe@... • 2m ago',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'bg-green-500/10 text-green-500'
  },
  {
    id: 2,
    type: 'test',
    title: 'Test Completed',
    description: 'Mock Exam #1 by s.wong@... • 5m ago',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-primary/10 text-primary'
  },
  {
    id: 3,
    type: 'user',
    title: 'New User Signup',
    description: 'k.smith@... joined • 12m ago',
    icon: <User className="w-5 h-5" />,
    color: 'bg-accent/10 text-accent'
  }
];

const topTests = [
  { name: 'PMP Mock Exam #1', attempts: 1234 },
  { name: 'Agile Practice Test', attempts: 987 },
  { name: 'Risk Management Quiz', attempts: 756 }
];

const newestStudents = [
  { name: 'Sarah Wong', initials: 'SW', time: '5m ago' },
  { name: 'John Doe', initials: 'JD', time: '2h ago' }
];

const platformStatus = [
  { service: 'API', status: 'Operational', color: 'text-green-500' },
  { service: 'Database', status: 'Operational', color: 'text-green-500' },
  { service: 'Payment Gateway', status: 'Operational', color: 'text-green-500' }
];

const quickActions = [
  { name: 'Add New Question', href: '/admin/questions', icon: <Plus className="w-5 h-5" /> },
  { name: 'Create New Test', href: '/admin/tests', icon: <FileText className="w-5 h-5" /> },
  { name: 'Manage Products', href: '/admin/products', icon: <CreditCard className="w-5 h-5" /> },
  { name: 'View All Students', href: '/admin/users', icon: <Users className="w-5 h-5" /> }
];

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <AuthGuard allowedRoles={['admin']}>
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back, Alice. Here&apos;s your platform overview.
          </p>
        </div>
        <div className="relative">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
              <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
              <SelectItem value="Last 90 Days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Left Column */}
        <div className="xl:col-span-1 space-y-8">
          {/* Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityFeed.map((activity) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full ${activity.color} shrink-0 flex items-center justify-center`}>
                      {activity.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Top Tests This Period</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {topTests.map((test, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{index + 1}. {test.name}</span>
                    <span className="font-semibold">{test.attempts.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Center Column */}
        <div className="xl:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Revenue</h3>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +12.5%
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold text-foreground">$24,750</p>
                <div className="h-8 mt-2 opacity-50">
                  <svg viewBox="0 0 100 25" className="w-full h-full">
                    <polyline 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="2" 
                      points="0,20 10,15 20,18 30,12 40,14 50,10 60,12 70,8 80,10 90,5 100,8"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">New Users</h3>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +15.6%
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold text-foreground">89</p>
                <div className="h-8 mt-2 opacity-50">
                  <svg viewBox="0 0 100 25" className="w-full h-full">
                    <polyline 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="2" 
                      points="0,20 10,18 20,15 30,16 40,12 50,10 60,11 70,9 80,6 90,8 100,5"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">Active Users</h3>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +2.3%
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold text-foreground">1,247</p>
                <div className="h-8 mt-2 opacity-50">
                  <svg viewBox="0 0 100 25" className="w-full h-full">
                    <polyline 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="2" 
                      points="0,20 10,18 20,15 30,16 40,12 50,10 60,11 70,9 80,6 90,8 100,5"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-muted-foreground">Avg. Test Score</h3>
                  <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    +4.2%
                  </div>
                </div>
                <p className="mt-2 text-3xl font-bold text-foreground">78.4%</p>
                <div className="h-8 mt-2 opacity-50">
                  <svg viewBox="0 0 100 25" className="w-full h-full">
                    <polyline 
                      fill="none" 
                      stroke="#10B981" 
                      strokeWidth="2" 
                      points="0,15 10,14 20,16 30,13 40,12 50,11 60,13 70,10 80,12 90,8 100,9"
                    />
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Button key={index} variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2">
                    {action.icon}
                    <span className="text-sm">{action.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="xl:col-span-1 space-y-8">
          {/* Newest Students */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Newest Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newestStudents.map((student, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                      {student.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{student.name}</p>
                      <p className="text-xs text-muted-foreground">{student.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Status */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Platform Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {platformStatus.map((service, index) => (
                  <li key={index} className="flex justify-between">
                    <span className="text-sm">{service.service}</span>
                    <span className={`text-sm font-medium ${service.color}`}>{service.status}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGuard>
  );
}