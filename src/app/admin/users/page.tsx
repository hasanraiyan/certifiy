'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface StudentUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  lastActive: string;
  currentPlan: string;
  testsCompleted: number;
  averageScore: number;
  totalSpent: number;
  status: 'active' | 'inactive' | 'suspended';
}

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlan, setFilterPlan] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState<StudentUser | null>(null);

  // Mock student users data
  const students: StudentUser[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      joinDate: '2024-11-15',
      lastActive: '2025-01-14',
      currentPlan: 'Premium Bundle',
      testsCompleted: 12,
      averageScore: 78,
      totalSpent: 99,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      joinDate: '2024-12-01',
      lastActive: '2025-01-15',
      currentPlan: 'Pay-per-Test',
      testsCompleted: 3,
      averageScore: 85,
      totalSpent: 57,
      status: 'active'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      joinDate: '2024-10-20',
      lastActive: '2024-12-30',
      currentPlan: 'Free Tier',
      testsCompleted: 8,
      averageScore: 72,
      totalSpent: 0,
      status: 'inactive'
    },
    {
      id: '4',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@example.com',
      joinDate: '2024-12-10',
      lastActive: '2025-01-15',
      currentPlan: 'Premium Bundle',
      testsCompleted: 15,
      averageScore: 82,
      totalSpent: 99,
      status: 'active'
    }
  ];

  const plans = ['Free Tier', 'Pay-per-Test', 'Premium Bundle'];

  const handleViewUser = (user: StudentUser) => {
    setSelectedUser(user);
  };

  const handleSuspendUser = (userId: string) => {
    // TODO: Implement user suspension
    console.log('Suspending user:', userId);
  };

  const handleActivateUser = (userId: string) => {
    // TODO: Implement user activation
    console.log('Activating user:', userId);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = filterPlan === 'all' || student.currentPlan === filterPlan;
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    
    return matchesSearch && matchesPlan && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inactive</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Premium Bundle':
        return <Badge className="bg-purple-100 text-purple-800">Premium</Badge>;
      case 'Pay-per-Test':
        return <Badge className="bg-blue-100 text-blue-800">Pay-per-Test</Badge>;
      case 'Free Tier':
        return <Badge className="bg-gray-100 text-gray-800">Free</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{plan}</Badge>;
    }
  };

  return (
    <AuthGuard allowedRoles={['admin', 'super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
            <p className="text-gray-600">View and manage all registered student users</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Student Overview</CardTitle>
              <CardDescription>Key metrics about your student base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{students.length}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {students.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-600">Active Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {students.filter(s => s.currentPlan === 'Premium Bundle').length}
                  </div>
                  <div className="text-sm text-gray-600">Premium Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${students.reduce((sum, s) => sum + s.totalSpent, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>Search and filter student accounts</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor="search">Search Students</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="plan-filter">Plan</Label>
                  <Select value={filterPlan} onValueChange={setFilterPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="All plans" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      {plans.map(plan => (
                        <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={() => {
                    setSearchTerm('');
                    setFilterPlan('all');
                    setFilterStatus('all');
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Student</th>
                      <th className="text-left p-4 font-medium">Plan</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Tests</th>
                      <th className="text-left p-4 font-medium">Avg Score</th>
                      <th className="text-left p-4 font-medium">Spent</th>
                      <th className="text-left p-4 font-medium">Last Active</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.email}</div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(student.joinDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {getPlanBadge(student.currentPlan)}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(student.status)}
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{student.testsCompleted}</div>
                          <div className="text-sm text-gray-600">completed</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">{student.averageScore}%</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">${student.totalSpent}</div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {new Date(student.lastActive).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewUser(student)}
                            >
                              View
                            </Button>
                            {student.status === 'active' ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleSuspendUser(student.id)}
                              >
                                Suspend
                              </Button>
                            ) : (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleActivateUser(student.id)}
                              >
                                Activate
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>

          {/* User Detail Modal */}
          {selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <CardTitle>Student Details</CardTitle>
                  <CardDescription>{selectedUser.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <Label>Email</Label>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <Label>Current Plan</Label>
                      <p className="font-medium">{selectedUser.currentPlan}</p>
                    </div>
                    <div>
                      <Label>Join Date</Label>
                      <p className="font-medium">{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Last Active</Label>
                      <p className="font-medium">{new Date(selectedUser.lastActive).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Tests Completed</Label>
                      <p className="font-medium">{selectedUser.testsCompleted}</p>
                    </div>
                    <div>
                      <Label>Average Score</Label>
                      <p className="font-medium">{selectedUser.averageScore}%</p>
                    </div>
                    <div>
                      <Label>Total Spent</Label>
                      <p className="font-medium">${selectedUser.totalSpent}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <p className="font-medium">{getStatusBadge(selectedUser.status)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedUser(null)}
                    >
                      Close
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // TODO: Navigate to user's detailed analytics
                        console.log('View detailed analytics for:', selectedUser.id);
                      }}
                    >
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}