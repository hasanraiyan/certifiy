'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SiteAnalyticsReports() {
  const [dateRange, setDateRange] = useState('30d');

  // Mock analytics data
  const salesData = {
    totalRevenue: 24750,
    revenueGrowth: 12.5,
    totalSales: 342,
    salesGrowth: 8.3,
    averageOrderValue: 72.37,
    conversionRate: 3.2,
    monthlyRevenue: [
      { month: 'Jan', revenue: 1850, sales: 28 },
      { month: 'Feb', revenue: 2100, sales: 32 },
      { month: 'Mar', revenue: 2450, sales: 38 },
      { month: 'Apr', revenue: 2200, sales: 34 },
      { month: 'May', revenue: 2800, sales: 42 },
      { month: 'Jun', revenue: 3200, sales: 48 },
      { month: 'Jul', revenue: 2950, sales: 45 },
      { month: 'Aug', revenue: 3400, sales: 52 },
      { month: 'Sep', revenue: 3100, sales: 47 },
      { month: 'Oct', revenue: 3650, sales: 56 },
      { month: 'Nov', revenue: 4200, sales: 64 },
      { month: 'Dec', revenue: 4850, sales: 72 }
    ]
  };

  const userGrowthData = {
    totalUsers: 1247,
    newUsers: 89,
    activeUsers: 892,
    retentionRate: 68.5,
    monthlyGrowth: [
      { month: 'Jan', total: 156, new: 45, active: 98 },
      { month: 'Feb', total: 203, new: 47, active: 134 },
      { month: 'Mar', total: 267, new: 64, active: 178 },
      { month: 'Apr', total: 324, new: 57, active: 215 },
      { month: 'May', total: 398, new: 74, active: 267 },
      { month: 'Jun', total: 485, new: 87, active: 324 },
      { month: 'Jul', total: 567, new: 82, active: 378 },
      { month: 'Aug', total: 672, new: 105, active: 445 },
      { month: 'Sep', total: 756, new: 84, active: 502 },
      { month: 'Oct', total: 867, new: 111, active: 578 },
      { month: 'Nov', total: 1024, new: 157, active: 682 },
      { month: 'Dec', total: 1247, new: 223, active: 892 }
    ]
  };

  const testPerformanceData = {
    totalTestsTaken: 5634,
    averageScore: 76.8,
    passRate: 68.2,
    popularTests: [
      { name: 'PMP Mock Exam #1', attempts: 1234, avgScore: 76.5, passRate: 65.2 },
      { name: 'Agile Practice Test', attempts: 987, avgScore: 82.1, passRate: 78.4 },
      { name: 'Risk Management Quiz', attempts: 756, avgScore: 74.3, passRate: 62.8 },
      { name: 'Integration Management', attempts: 645, avgScore: 71.9, passRate: 58.7 },
      { name: 'PMP Mock Exam #2', attempts: 543, avgScore: 78.2, passRate: 69.1 }
    ]
  };

  const handleExportReport = (reportType: string) => {
    // TODO: Implement report export
    console.log('Exporting report:', reportType);
  };

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Site Analytics & Reports</h1>
                <p className="text-gray-600">Comprehensive platform performance analytics</p>
              </div>
              <div className="flex items-center gap-4">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                    <SelectItem value="1y">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => handleExportReport('comprehensive')}>
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="tests">Test Performance</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${salesData.totalRevenue.toLocaleString()}</div>
                    <p className="text-sm text-green-600">+{salesData.revenueGrowth}% from last period</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{userGrowthData.totalUsers.toLocaleString()}</div>
                    <p className="text-sm text-green-600">+{userGrowthData.newUsers} new this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Tests Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testPerformanceData.totalTestsTaken.toLocaleString()}</div>
                    <p className="text-sm text-gray-600">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{testPerformanceData.averageScore}%</div>
                    <p className="text-sm text-gray-600">Platform average</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue over the past year</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                      <p className="text-gray-500">Revenue Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                    <CardDescription>User acquisition and retention metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                      <p className="text-gray-500">User Growth Chart Placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${salesData.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">+{salesData.revenueGrowth}% growth</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Sales</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {salesData.totalSales}
                    </div>
                    <p className="text-sm text-gray-600">+{salesData.salesGrowth}% growth</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Avg Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ${salesData.averageOrderValue}
                    </div>
                    <p className="text-sm text-gray-600">Per transaction</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Sales Performance</CardTitle>
                  <CardDescription>Revenue and sales volume by month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">Month</th>
                          <th className="text-left p-4 font-medium">Revenue</th>
                          <th className="text-left p-4 font-medium">Sales</th>
                          <th className="text-left p-4 font-medium">Avg Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.monthlyRevenue.map((month, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{month.month}</td>
                            <td className="p-4">${month.revenue.toLocaleString()}</td>
                            <td className="p-4">{month.sales}</td>
                            <td className="p-4">${(month.revenue / month.sales).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {userGrowthData.totalUsers.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Registered users</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>New Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {userGrowthData.newUsers}
                    </div>
                    <p className="text-sm text-gray-600">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Active Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {userGrowthData.activeUsers}
                    </div>
                    <p className="text-sm text-gray-600">Monthly active</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Retention Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {userGrowthData.retentionRate}%
                    </div>
                    <p className="text-sm text-gray-600">30-day retention</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth Timeline</CardTitle>
                  <CardDescription>Monthly user acquisition and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-4 font-medium">Month</th>
                          <th className="text-left p-4 font-medium">Total Users</th>
                          <th className="text-left p-4 font-medium">New Users</th>
                          <th className="text-left p-4 font-medium">Active Users</th>
                          <th className="text-left p-4 font-medium">Growth Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userGrowthData.monthlyGrowth.map((month, index) => {
                          const prevMonth = index > 0 ? userGrowthData.monthlyGrowth[index - 1] : null;
                          const growthRate = prevMonth 
                            ? (((month.total - prevMonth.total) / prevMonth.total) * 100).toFixed(1)
                            : '0.0';
                          
                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="p-4 font-medium">{month.month}</td>
                              <td className="p-4">{month.total.toLocaleString()}</td>
                              <td className="p-4">{month.new}</td>
                              <td className="p-4">{month.active}</td>
                              <td className="p-4">
                                <span className={`${parseFloat(growthRate) > 0 ? 'text-green-600' : 'text-gray-600'}`}>
                                  {growthRate}%
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Test Performance Tab */}
            <TabsContent value="tests">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Tests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {testPerformanceData.totalTestsTaken.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Tests completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Average Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {testPerformanceData.averageScore}%
                    </div>
                    <p className="text-sm text-gray-600">Platform average</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pass Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {testPerformanceData.passRate}%
                    </div>
                    <p className="text-sm text-gray-600">Above 75% score</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Tests Performance</CardTitle>
                  <CardDescription>Most attempted tests and their success rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {testPerformanceData.popularTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{test.name}</h4>
                          <p className="text-sm text-gray-600">{test.attempts} attempts</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 text-center">
                          <div>
                            <div className="font-bold text-lg">{test.avgScore}%</div>
                            <div className="text-sm text-gray-600">Avg Score</div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{test.passRate}%</div>
                            <div className="text-sm text-gray-600">Pass Rate</div>
                          </div>
                        </div>
                      </div>
                    ))}
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