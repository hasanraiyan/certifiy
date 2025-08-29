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
import { useAdmin } from '@/context/admin-context'; // Import the useAdmin hook

export default function AdminUserManagement() {
  // Get state and functions from the context
  const { team, createTeamMember, updateTeamMember } = useAdmin();
  
  const [, setSelectedAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

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

  const handleCreateAdmin = () => {
    // Set permissions based on role
    const permissions = rolePermissions[newAdmin.role] || [];
    createTeamMember({ ...newAdmin, permissions });
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

  const filteredAdmins = team.filter(admin => {
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
                      <div className="text-2xl font-bold text-blue-600">{team.length}</div>
                      <div className="text-sm text-gray-600">Total Admins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {team.filter(a => a.role === 'super_admin').length}
                      </div>
                      <div className="text-sm text-gray-600">Super Admins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {team.filter(a => a.role === 'admin').length}
                      </div>
                      <div className="text-sm text-gray-600">Admins</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {team.filter(a => a.role === 'content_manager').length}
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
                      <Input
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div>
                      <Select value={filterRole} onValueChange={setFilterRole}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Roles</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="content_manager">Content Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Button variant="outline" onClick={() => { setSearchTerm(''); setFilterRole('all'); }}>
                        Clear Filters
                      </Button>
                    </div>
                  </div>

                  {/* Admins Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-4 font-medium text-gray-500">Admin</th>
                          <th className="text-left p-4 font-medium text-gray-500">Role</th>
                          <th className="text-left p-4 font-medium text-gray-500">Status</th>
                          <th className="text-left p-4 font-medium text-gray-500">Last Active</th>
                          <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {filteredAdmins.map((admin) => (
                          <tr key={admin.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{admin.name}</div>
                              <div className="text-sm text-gray-500">{admin.email}</div>
                            </td>
                            <td className="p-4">
                              {getRoleBadge(admin.role)}
                            </td>
                            <td className="p-4">
                              {getStatusBadge(admin.status)}
                            </td>
                            <td className="p-4 text-sm text-gray-500">
                              {admin.lastActive}
                            </td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm" onClick={() => handleEditAdmin(admin)}>
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(admin.id)}>
                                {admin.status === 'active' ? 'Deactivate' : 'Activate'}
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invite Admin Tab */}
            <TabsContent value="invite">
              <Card>
                <CardHeader>
                  <CardTitle>Invite New Admin</CardTitle>
                  <CardDescription>Send an invitation to a new team member</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="admin-name">Full Name</Label>
                      <Input
                        id="admin-name"
                        value={newAdmin.name}
                        onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-email">Email Address</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        value={newAdmin.email}
                        onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email address"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-role">Role</Label>
                      <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger id="admin-role" className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="content_manager">Content Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Label>Permissions</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        {newAdmin.role === 'super_admin' ? (
                          <p>Full access to all admin features</p>
                        ) : (
                          <ul className="list-disc pl-5 space-y-1">
                            {rolePermissions[newAdmin.role]?.map((permission, index) => (
                              <li key={index}>{permission.replace(/_/g, ' ')}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleCreateAdmin}>Send Invitation</Button>
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