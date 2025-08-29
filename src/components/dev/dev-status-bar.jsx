'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function DevStatusBar() {
  const [user, setUser] = useState(null);
  const [isDevelopment, setIsDevelopment] = useState(false);

  useEffect(() => {
    setIsDevelopment(process.env.NODE_ENV === 'development');
    
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('dev-auth-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load dev auth user:', error);
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'dev-auth-user') {
        loadUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!isDevelopment) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-[9970]">
      <Badge 
        variant="outline" 
        className="bg-orange-50 border-orange-200 text-orange-800 shadow-sm"
      >
        DEV: {user ? `${user.name} (${user.role})` : 'Not logged in'}
      </Badge>
    </div>
  );
}