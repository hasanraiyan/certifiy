'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Download, TrendingUp, Users, DollarSign, BookOpen } from 'lucide-react';
import { useAdmin } from '@/context/admin-context';

// Mock data for charts
const revenueData = [
  { month: 'Jan', revenue: 4000, exams: 240 },
  { month: 'Feb', revenue: 3000, exams: 139 },
  { month: 'Mar', revenue: 2000, exams: 180 },
  { month: 'Apr', revenue: 2780, exams: 190 },
  { month: 'May', revenue: 1890, exams: 150 },
  { month: 'Jun', revenue: 2390, exams: 210 },
];

const examPerformanceData = [
  { name: 'PMP Mock Exam #1', passRate: 78, avgScore: 82 },
  { name: 'Agile Practice Test', passRate: 85, avgScore: 88 },
  { name: 'Risk Management Quiz', passRate: 65, avgScore: 72 },
  { name: 'Foundations Practice', passRate: 90, avgScore: 92 },
];

const userData = [
  { name: 'Active', value: 75 },
  { name: 'Inactive', value: 25 },
];

const COLORS = ['#3b82f6', '#94a3b8'];

export default function ReportsPage() {
  const { users, products, tests } = useAdmin();
  const [dateRange, setDateRange] = useState('last_30_days');

  // Calculate KPIs
  const totalUsers = users.length;
  const activeUsers = users.filter(user => user.status === 'Active').length;
  const totalRevenue = products.reduce((sum, product) => sum + product.price.amount, 0);
  const totalExams = tests.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-muted-foreground">Track performance, revenue, and user engagement.</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exams Taken</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Pass Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue & Exams Over Time</CardTitle>
            <CardDescription>Monthly revenue and exams taken</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue ($)" fill="#3b82f6" />
                <Bar yAxisId="right" dataKey="exams" name="Exams Taken" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Exam Performance</CardTitle>
            <CardDescription>Average scores and pass rates by exam</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={examPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="passRate" name="Pass Rate (%)" fill="#3b82f6" />
                <Bar dataKey="avgScore" name="Avg. Score (%)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Active vs inactive users</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions and system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-sm text-muted-foreground">John Student signed up for an account</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">2m ago</div>
              </div>
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Purchase completed</p>
                  <p className="text-sm text-muted-foreground">Sarah Wilson purchased Full Access</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">15m ago</div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Exam completed</p>
                  <p className="text-sm text-muted-foreground">Michael Chen finished PMP Mock Exam #1</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">1h ago</div>
              </div>
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <TrendingUp className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium">Content updated</p>
                  <p className="text-sm text-muted-foreground">Agile Practice Test questions revised</p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">3h ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
