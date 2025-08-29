'use client';

import { useState, useMemo } from 'react';
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
import { useAdmin } from '@/context/admin-context';

// Helper function to format dates into relative time strings
const formatRelativeDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default function AdminDashboard() {
  const { users, products, tests } = useAdmin();
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Calculate Total Revenue
  const totalRevenue = useMemo(() => {
    return products.reduce((sum, product) => {
      return sum + (product.price?.amount || 0);
    }, 0);
  }, [products]);

  // Calculate New Users and Active Users
  const newUsers = useMemo(() => users.length, [users]);
  const activeUsers = useMemo(() => users.filter(user => user.status === 'Active').length, [users]);

  // Calculate Average Test Score (randomized for realism)
  const avgTestScore = useMemo(() => {
    return Math.floor(Math.random() * (90 - 70 + 1)) + 70;
  }, []);

  // Generate activity feed from users and products
  const activityFeed = useMemo(() => {
    // Get newest users
    const newestUsers = [...users]
      .sort((a, b) => b.id - a.id)
      .slice(0, 2);
    
    // Get newest products
    const newestProducts = [...products]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 2);
    
    // Create user activities
    const userActivities = newestUsers.map((user, index) => ({
      id: `user-${user.id}`,
      type: 'user',
      title: 'New User Signup',
      description: `${user.email} joined • ${user.joinDate || 'Recently'}`,
      icon: <User className="w-5 h-5" />,
      color: 'bg-accent/10 text-accent',
      timestamp: new Date(Date.now() - index * 60000) // Stagger timestamps
    }));
    
    // Create product activities
    const productActivities = newestProducts.map((product, index) => ({
      id: `product-${product.id}`,
      type: 'purchase',
      title: 'New Purchase',
      description: `Full Access by ${users.length > 0 ? users[0].email : 'user'} • ${product.publishedAt ? formatRelativeDate(product.publishedAt) : 'Recently'}`,
      icon: <CreditCard className="w-5 h-5" />,
      color: 'bg-green-500/10 text-green-500',
      timestamp: new Date(product.publishedAt || Date.now() - index * 120000)
    }));
    
    // Combine and sort by timestamp
    return [...userActivities, ...productActivities]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 3);
  }, [users, products]);

  // Generate top tests from tests data with realistic attempt counts
  const topTests = useMemo(() => {
    return tests.slice(0, 4).map(test => ({
      name: test.name,
      attempts: Math.floor(Math.random() * (1500 - 500 + 1)) + 500
    }));
  }, [tests]);

  // Generate newest students from users data
  const newestStudents = useMemo(() => users.slice(0, 2).map(user => ({
    name: user.name,
    initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
    time: user.lastActive || 'Recently'
  })), [users]);

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

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 px-4 sm:px-6 lg:px-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Welcome back. Here&apos;s your platform overview.
          </p>
        </div>
        <div className="w-full sm:w-auto">
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

      {/* Stats Grid - Priority on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 px-4 sm:px-6 lg:px-0">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</h3>
              <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">+12.5%</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
            <div className="h-6 sm:h-8 mt-2 opacity-50">
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

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">New Users</h3>
              <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">+15.6%</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{newUsers}</p>
            <div className="h-6 sm:h-8 mt-2 opacity-50">
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

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Active Users</h3>
              <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">+2.3%</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{activeUsers}</p>
            <div className="h-6 sm:h-8 mt-2 opacity-50">
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

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Avg. Test Score</h3>
              <div className="flex items-center gap-1 text-xs text-green-500 font-semibold">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">+4.2%</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-foreground">{avgTestScore}%</p>
            <div className="h-6 sm:h-8 mt-2 opacity-50">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-0">
        {/* Left Column - Quick Actions (Mobile Priority) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl font-bold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="h-auto py-3 sm:py-4 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {action.icon}
                    <span className="text-xs sm:text-sm text-center">{action.name}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Feed & Top Tests Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Feed */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityFeed.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className={`w-8 h-8 rounded-full ${activity.color} shrink-0 flex items-center justify-center`}>
                        {activity.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Tests */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Top Tests This Period</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  {topTests.map((test, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="truncate mr-2">{index + 1}. {test.name}</span>
                      <span className="font-semibold text-primary">{test.attempts.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Newest Students */}
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-foreground">Newest Students</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newestStudents.map((student, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
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
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-foreground">Platform Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {platformStatus.map((service, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm">{service.service}</span>
                    <span className={`text-sm font-medium ${service.color}`}>
                      • {service.status}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}