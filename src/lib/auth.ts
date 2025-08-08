// Authentication utilities and types
export type UserRole = 'student' | 'content_manager' | 'admin' | 'super_admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Mock authentication functions - replace with real implementation
export const getCurrentUser = async (): Promise<User | null> => {
  // This would typically check JWT token, session, etc.
  return null;
};

export const login = async (email: string, password: string): Promise<User> => {
  // Mock login - replace with real authentication
  throw new Error('Not implemented');
};

export const logout = async (): Promise<void> => {
  // Mock logout - replace with real implementation
  throw new Error('Not implemented');
};

export const signup = async (email: string, password: string, name: string): Promise<User> => {
  // Mock signup - replace with real authentication
  throw new Error('Not implemented');
};

// Role-based access control helpers
export const hasRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, ['admin', 'super_admin']);
};

export const isSuperAdmin = (user: User | null): boolean => {
  return hasRole(user, ['super_admin']);
};

export const canManageContent = (user: User | null): boolean => {
  return hasRole(user, ['content_manager', 'admin', 'super_admin']);
};