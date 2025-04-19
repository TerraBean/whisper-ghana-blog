'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { SessionProvider, useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Define user type
type UserType = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

// Define types for our context
interface AuthContextType {
  isAuthenticated: boolean; 
  isAdmin: boolean;
  isEditor: boolean;
  isLoading: boolean;
  user: UserType | null;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<UserType>) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  isEditor: false,
  isLoading: true,
  user: null,
  signOut: async () => {},
  updateUserProfile: async () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const isLoading = status === 'loading';
  
  // Update auth state when session changes
  useEffect(() => {
    if (session?.user) {
      // If we have a session, update our user state
      const userRole = session.user.role || 'user';
      setUser({
        name: session.user.name || 'User',
        email: session.user.email,
        image: session.user.image,
        role: userRole,
      });
      setIsAuthenticated(true);
      setIsAdmin(userRole === 'admin');
      setIsEditor(userRole === 'admin' || userRole === 'editor');
    } else if (status === 'unauthenticated') {
      // If explicitly unauthenticated, clear user state
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsEditor(false);
    }

    // Fallback for demo purposes - this would be removed in a real app
    if (status === 'unauthenticated' && document.cookie.includes('next-auth.session-token')) {
      // Demo user simulation
      setUser({
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      });
      setIsAuthenticated(true);
      setIsAdmin(true);
      setIsEditor(true);
    }
  }, [session, status]);

  // Sign out function
  const handleSignOut = async () => {
    await nextAuthSignOut({ redirect: false });
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsEditor(false);
    router.push('/auth/signin');
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserType>) => {
    // In a real app, this would make an API call to update the user profile
    // For our demo, we'll just update the local state
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  const value = {
    isAuthenticated,
    isAdmin,
    isEditor,
    isLoading,
    user,
    signOut: handleSignOut,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Create a session provider wrapper
export function NextAuthSessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
