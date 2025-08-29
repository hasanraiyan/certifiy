'use client';

import { useState } from 'react';
import Link from 'next/link'; // FIX: Import Link for navigation
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'; // FIX: Installed and imported Recharts
import { AuthGuard } from '@/components/auth/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Users, FileText, Plus, TrendingUp, User } from 'lucide-react';

// FIX: Data moved outside the component to prevent re-declaration on every render.
const activityFeed = [
  { id: 1, type: 'purchase', title: 'New Purchase', description: 'Full Access by j.doe@... • 2m ago', icon: <CreditCard className="w-5 h-5" />, color: 'bg-green-500/10 text-green-500' },
  { id: 2, type: 'test', title: 'Test Completed', description: 'Mock Exam #1 by s.wong@... • 5m ago', icon: <FileText className="w-5 h-5" />, color: 'bg-blue-500/10 text-blue-500' },
  { id: 3, type: 'user', title: 'New User Signup', description: 'k.smith@... joined • 12m ago', icon: <User className="w-5 h-5" />, color: 'bg-orange-500/10 text-orange-500' }
];

const topTests = [
  { name: 'PMP Mock Exam #1', attempts: 1234 },
  { name: 'Agile Practice Test', attempts: 987 },
  { name: 'Risk Management Quiz', attempts: 756 }
];

const newestStudents = [
  { name: 'Sarah Wong', initials: 'SW', time: '5m ago' },
  { name: 'John Doe', initials: 'JD', time: '2h ago' },
  { name: 'Kate Smith', initials: 'KS', time: '1d ago' }
];

const platformStatus = [
  { service: 'API', status: 'Operational', color: 'bg-green-500' },
  { service: 'Database', status: 'Operational', color: 'bg-green-500' },
  { service: 'Payment Gateway', status: 'Operational', color: 'bg-green-500' }
];

const quickActions = [
  { name: 'Add Question', href: '/admin/questions', icon: <Plus className="w-5 h-5" /> },
  { name: 'Create Test', href: '/admin/tests', icon: <FileText className="w-5 h-5" /> },
  { name: 'Manage Products', href: '/admin/products', icon: <CreditCard className="w-5 h-5" /> },
  { name: 'View Students', href: '/admin/users', icon: <Users className="w-5 h-5" /> }
];

// FIX: Added sample data for charts. In a real app, this would come from an API based on the dateRange state.
const revenueData = [
  { name: 'Week 1', revenue: 4000 }, { name: 'Week 2', revenue: 3000 },
  { name: 'Week 3', revenue: 5000 }, { name: 'Week 4', revenue: 4500 },
  { name: 'Week 5', revenue: 6000 }, { name: 'Week 6', revenue: 5800 },
];
const usersData = [
  { name: 'Week 1', users: 20 }, { name: 'Week 2', users: 25 },
  { name: 'Week 3', users: 18 }, { name: 'Week 4', users: 30 },
  { name: 'Week 5', users: 28 }, { name: 'Week 6', users: 40 },
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
            Welcome back, Alice. Here&apos;s your platform overview for the <span className="font-semibold text-foreground">{dateRange}</span>.
          </p>
        </div>
        <div className="relative">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* FIX: Improved responsive grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                <CardDescription className="flex justify-between items-baseline">
                  <span className="text-3xl font-bold text-foreground">$24,750</span>
                  <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +12.5%
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="h-24 -mt-4">
                {/* FIX: Replaced static SVG with dynamic AreaChart from Recharts */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">New Users</CardTitle>
                <CardDescription className="flex justify-between items-baseline">
                  <span className="text-3xl font-bold text-foreground">89</span>
                  <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +15.6%
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="h-24 -mt-4">
                {/* FIX: Replaced static SVG with dynamic AreaChart from Recharts */}
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usersData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} fill="url(#colorUsers)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* FIX: Wrapped Buttons in <Link> for proper navigation */}
                {quickActions.map((action, index) => (
                  <Link key={index} href={action.href} passHref>
                    <Button variant="outline" className="w-full h-auto py-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-accent hover:text-accent-foreground">
                      {action.icon}
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="font-bold text-foreground">Top Tests</CardTitle>
              <CardDescription>Most attempted tests this period.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {topTests.map((test, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="truncate">{index + 1}. {test.name}</span>
                    <span className="font-semibold shrink-0 ml-4">{test.attempts.toLocaleString()} attempts</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 space-y-8">
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
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm">{service.service}</span>
                    {/* FIX: Added a visual status indicator dot for better scannability */}
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${service.color}`}></span>
                       <span className="text-sm font-medium text-muted-foreground">{service.status}</span>
                    </div>
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