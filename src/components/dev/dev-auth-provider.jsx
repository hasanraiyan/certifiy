'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const DevAuthContext = createContext(undefined);

export function DevAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('dev-auth-user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Failed to load dev auth user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for storage changes (when user switches in dev panel)
    const handleStorageChange = (e) => {
      if (e.key === 'dev-auth-user') {
        if (e.newValue) {
          try {
            setUser(JSON.parse(e.newValue));
          } catch (error) {
            console.error('Failed to parse user from storage:', error);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateUser = (newUser) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('dev-auth-user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('dev-auth-user');
    }
  };

  return (
    <DevAuthContext.Provider value={{ user, setUser: updateUser, isLoading }}>
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuth() {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
}