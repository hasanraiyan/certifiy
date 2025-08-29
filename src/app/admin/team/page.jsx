'use client';

import { useState } from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AdminUserManagement() {
  const [, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Mock admin users data
  const adminUsers = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice.johnson@company.com',
      role: 'super_admin',
      joinDate: '2024-01-15',
      lastActive: '2025-01-15',
      status: 'active',
      permissions: ['all']
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob.smith@company.com',
      role: 'admin',
      joinDate: '2024-03-20',
      lastActive: '2025-01-14',
      status: 'active',
      permissions: ['manage_users', 'manage_products', 'view_reports', 'manage_tests']
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol.davis@company.com',
      role: 'content_manager',
      joinDate: '2024-06-10',
      lastActive: '2025-01-15',
      status: 'active',
      permissions: ['manage_questions', 'manage_tests']
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@company.com',
      role: 'admin',
      joinDate: '2024-08-05',
      lastActive: '2024-12-20',
      status: 'inactive',
      permissions: ['manage_users', 'view_reports']
    }
  ];

  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'content_manager',
    permissions: []
  });

  const rolePermissions = {
    content_manager: ['manage_questions', 'manage_tests'],
    admin: ['manage_users', 'manage_products', 'view_reports', 'manage_tests', 'manage_questions'],
    super_admin: ['all']
  };

  // Available permissions for admin roles (commented out until needed)
  // const availablePermissions = [
  //   'manage_questions',
  //   'manage_tests', 
  //   'manage_users',
  //   'manage_products',
  //   'view_reports',
  //   'manage_team'
  // ];

  const handleCreateAdmin = () => {
    // TODO: Implement admin creation
    console.log('Creating admin:', newAdmin);
    // Reset form
    setNewAdmin({
      name: '',
      email: '',
      role: 'content_manager',
      permissions: []
    });
  };

  const handleEditAdmin = (admin) => {
    setSelectedAdmin(admin);
  };

  const handleDeleteAdmin = (adminId) => {
    // TODO: Implement admin deletion
    console.log('Deleting admin:', adminId);
  };

  const handleToggleStatus = (adminId) => {
    // TODO: Implement toggle status
    console.log('Toggling status for admin:', adminId);
  };

  const filteredAdmins = adminUsers.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'content_manager':
        return <Badge className="bg-green-100 text-green-800">Content Manager</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{role}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <AuthGuard allowedRoles={['super_admin']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Team Management</h1>
            <p className="text-gray-600">Manage admin users and their roles (Super Admin only)</p>
          </div>

          <Tabs defaultValue="browse" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse">Team Members</TabsTrigger>
              <TabsTrigger value="invite">Invite Admin</TabsTrigger>
            </TabsList>

            {/* Browse Team Tab */}
            <TabsContent value="browse">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Team Overview</CardTitle>
                  <CardDescription>Current admin team composition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{adminUsers.length}</div>
                      <div className="text-sm text-gray-600">Total Admins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {adminUsers.filter(a => a.role === 'super_admin').length}
                      </div>
                      <div className="text-sm text-gray-600">Super Admins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {adminUsers.filter(a => a.role === 'admin').length}
                      </div>
                      <div className="text-sm text-gray-600">Admins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {adminUsers.filter(a => a.role === 'content_manager').length}
                      </div>
                      <div className="text-sm text-gray-600">Content Managers</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Admin Directory</CardTitle>
                  <CardDescription>Search and manage admin team members</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <Label htmlFor="search">Search Admins</Label>
                      <Input
                        id="search"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="role-filter">Role</Label>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="content_manager">Content Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button onClick={() => {
                        setSearchTerm('');
                        setFilterRole('all');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Admin Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAdmins.map((admin) => (
                      <Card key={admin.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{admin.name}</CardTitle>
                            {getStatusBadge(admin.status)}
                          </div>
                          <CardDescription>{admin.email}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Role:</span>
                              {getRoleBadge(admin.role)}
                            </div>
                            
                            <div>
                              <span className="text-sm font-medium">Permissions:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {admin.permissions.includes('all') ? (
                                  <Badge className="bg-purple-100 text-purple-800">All Permissions</Badge>
                                ) : (
                                  admin.permissions.map(permission => (
                                    <Badge key={permission} className="bg-gray-100 text-gray-800 text-xs">
                                      {permission.replace('_', ' ')}
                                    </Badge>
                                  ))
                                )}
                              </div>
                            </div>

                            <div className="text-sm text-gray-600">
                              <div>Joined: {new Date(admin.joinDate).toLocaleDateString()}</div>
                              <div>Last Active: {new Date(admin.lastActive).toLocaleDateString()}</div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEditAdmin(admin)}
                                className="flex-1"
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleToggleStatus(admin.id)}
                                className="flex-1"
                              >
                                {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                            
                            {admin.role !== 'super_admin' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDeleteAdmin(admin.id)}
                                className="w-full"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredAdmins.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No admin users found matching your criteria.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invite Admin Tab */}
            <TabsContent value="invite">
              <Card>
                <CardHeader>
                  <CardTitle>Invite New Admin</CardTitle>
                  <CardDescription>Add a new team member with specific role and permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="admin-name">Full Name</Label>
                      <Input
                        id="admin-name"
                        placeholder="Enter full name"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="admin-email">Email Address</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="Enter email address"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="admin-role">Role</Label>
                    <Select 
                      value={newAdmin.role} 
                      onValueChange={(value) => {
                        setNewAdmin(prev => ({ 
                          ...prev, 
                          role: value,
                          permissions: rolePermissions[value] 
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="content_manager">Content Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Role Permissions</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium mb-2">
                        {newAdmin.role.replace('_', ' ').toUpperCase()} permissions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {newAdmin.role === 'super_admin' ? (
                          <Badge className="bg-purple-100 text-purple-800">All Permissions</Badge>
                        ) : (
                          rolePermissions[newAdmin.role].map(permission => (
                            <Badge key={permission} className="bg-blue-100 text-blue-800">
                              {permission.replace('_', ' ')}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-medium text-yellow-800 mb-2">Role Descriptions:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li><strong>Content Manager:</strong> Can manage questions and tests</li>
                      <li><strong>Admin:</strong> Can manage users, products, and view reports</li>
                      <li><strong>Super Admin:</strong> Full access to all features including team management</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleCreateAdmin}>
                      Send Invitation
                    </Button>
                    <Button variant="outline" onClick={() => {
                      setNewAdmin({
                        name: '',
                        email: '',
                        role: 'content_manager',
                        permissions: []
                      });
                    }}>
                      Clear Form
                    </Button>
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