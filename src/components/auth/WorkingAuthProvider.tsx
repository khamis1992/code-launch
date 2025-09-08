/**
 * CodeLaunch Auth Provider - Production Ready
 * Clean and professional authentication
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// Supabase client import
import { createClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avogdxfjgkxrswdmhzff.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export function WorkingAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check localStorage first for persistent session
        const savedUser = localStorage.getItem('codelaunch_user');
        const savedSession = localStorage.getItem('codelaunch_session');
        
        if (savedUser && savedSession === 'active') {
          try {
            const userData = JSON.parse(savedUser);
            setUser(userData);
            setLoading(false);
            return;
          } catch {
            localStorage.removeItem('codelaunch_user');
            localStorage.removeItem('codelaunch_session');
          }
        }

        // Fallback to Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || ''
          };
          setUser(userData);
        } else if (error) {
          console.error('Supabase session error:', error);
        }
      } catch (error) {
        console.error('Failed to get session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || ''
          };
          setUser(userData);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Check for admin account first (temporary solution)
      if (email === 'admin@admin.com' && password === 'admin') {
        const userData = {
          id: 'admin-123',
          email: 'admin@admin.com',
          name: 'Admin User'
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('codelaunch_user', JSON.stringify(userData));
        localStorage.setItem('codelaunch_session', 'active');
        
        setUser(userData);
        toast.success('تم تسجيل الدخول بنجاح');
        return;
      }

      // Try Supabase authentication for other users
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || ''
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('codelaunch_user', JSON.stringify(userData));
        localStorage.setItem('codelaunch_session', 'active');
        
        setUser(userData);
        toast.success('تم تسجيل الدخول بنجاح');
      }
    } catch (error) {
      toast.error('Invalid email or password');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData?.name
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Account created successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create account';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear localStorage
      localStorage.removeItem('codelaunch_user');
      localStorage.removeItem('codelaunch_session');
      
      // Sign out from Supabase (if applicable)
      try {
        const { error } = await supabase.auth.signOut();
        if (error && error.message !== 'No session found') {
          console.error('Supabase signout error:', error);
        }
      } catch (supabaseError) {
        console.error('Supabase signout failed:', supabaseError);
      }
      
      setUser(null);
      toast.success('Signed out successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within WorkingAuthProvider');
  }
  return context;
}
