'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, User, LogOut, LogIn, X } from 'lucide-react';
import { type User as UserType, type UserRole } from '@/lib/auth';

// Mock users for development
const mockUsers: Record<string, UserType> = {
  student: {
    id: '1',
    email: 'student@example.com',
    name: 'John Student',
    role: 'student',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-01-15')
  },
  content_manager: {
    id: '2',
    email: 'content@example.com',
    name: 'Sarah Content Manager',
    role: 'content_manager',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2025-01-15')
  },
  admin: {
    id: '3',
    email: 'admin@example.com',
    name: 'Mike Admin',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2025-01-15')
  },
  super_admin: {
    id: '4',
    email: 'superadmin@example.com',
    name: 'Alice Super Admin',
    role: 'super_admin',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2025-01-15')
  }
};

export function DevAuthPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    // Only show in development mode
    setIsDevelopment(process.env.NODE_ENV === 'development');
    
    // Load saved user state from localStorage
    const savedUser = localStorage.getItem('dev-auth-user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
      }
    }
  }, []);

  const handleUserChange = (userKey: string) => {
    if (userKey === 'logout') {
      setCurrentUser(null);
      localStorage.removeItem('dev-auth-user');
      // Trigger a page reload to reset auth state
      window.location.reload();
    } else {
      const user = mockUsers[userKey];
      setCurrentUser(user);
      localStorage.setItem('dev-auth-user', JSON.stringify(user));
      // Trigger a page reload to apply new auth state
      window.location.reload();
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      content_manager: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800',
      super_admin: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[role]}>
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  // Don't render in production
  if (!isDevelopment) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-4 right-4 z-[9990]">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full w-12 h-12 shadow-lg bg-orange-500 hover:bg-orange-600 text-white"
          size="sm"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </Button>
      </div>

      {/* Development Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-[9980] w-80">
          <Card className="shadow-2xl border-orange-200 bg-orange-50/95 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
                <Settings className="w-5 h-5" />
                Dev Auth Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current User Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-800">Current User:</label>
                {currentUser ? (
                  <div className="p-3 bg-white rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{currentUser.name}</span>
                      {getRoleBadge(currentUser.role)}
                    </div>
                    <div className="text-xs text-gray-600">{currentUser.email}</div>
                  </div>
                ) : (
                  <div className="p-3 bg-white rounded-lg border text-center text-gray-500">
                    <LogOut className="w-4 h-4 mx-auto mb-1" />
                    <span className="text-sm">Not logged in</span>
                  </div>
                )}
              </div>

              {/* User Switcher */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-800">Switch User:</label>
                <Select onValueChange={handleUserChange}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select user or logout" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999]">
                    <SelectItem value="logout" className="text-red-600">
                      <div className="flex items-center gap-2">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </div>
                    </SelectItem>
                    {Object.entries(mockUsers).map(([key, user]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>{user.name}</span>
                          <Badge className="ml-auto text-xs">
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Access Links */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-orange-800">Quick Access:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <a href="/dashboard">Dashboard</a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <a href="/admin/dashboard">Admin</a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <a href="/exam/setup">Exam Setup</a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <a href="/admin/questions">Questions</a>
                  </Button>
                </div>
              </div>

              {/* Role Permissions Info */}
              <div className="text-xs text-orange-700 bg-orange-100 p-2 rounded">
                <strong>Role Access:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>Student:</strong> Dashboard, Tests, Profile</li>
                  <li>• <strong>Content Manager:</strong> + Questions, Tests</li>
                  <li>• <strong>Admin:</strong> + Users, Plans, Reports</li>
                  <li>• <strong>Super Admin:</strong> + Team Management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}