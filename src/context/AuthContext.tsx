'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSupabaseLive: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default fallback demo credentials for offline or initial setup verification
export const DEMO_ADMIN_EMAIL = 'admin@rnbdigitals.com';
export const DEMO_ADMIN_PASSWORD = 'admin@rnbdigitals';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isSupabaseLive = isSupabaseConfigured();

  useEffect(() => {
    let isMounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    // Safety timeout: Always resolve loading state quickly so the user is never stuck
    const safetyTimer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 800);

    async function initSession() {
      const supabase = getSupabaseClient();

      if (supabase && isSupabaseLive) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('Supabase getSession notice:', error.message);
          }
          if (isMounted) {
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: 'admin',
                created_at: session.user.created_at,
              });
            } else {
              // Check local fallback
              const savedSession = typeof window !== 'undefined' ? localStorage.getItem('rnb_admin_session') : null;
              if (savedSession) {
                try {
                  const parsed = JSON.parse(savedSession);
                  setUser(parsed);
                } catch {
                  localStorage.removeItem('rnb_admin_session');
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
          }

          // Listen for auth state changes
          const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!isMounted) return;
            if (session?.user) {
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                role: 'admin',
                created_at: session.user.created_at,
              });
            } else {
              const savedSession = typeof window !== 'undefined' ? localStorage.getItem('rnb_admin_session') : null;
              if (savedSession) {
                try {
                  const parsed = JSON.parse(savedSession);
                  setUser(parsed);
                } catch {
                  setUser(null);
                }
              } else {
                setUser(null);
              }
            }
          });

          authSubscription = authListener.subscription;
        } catch (e) {
          console.warn('Auth session check error:', e);
        }
      } else {
        // Local demo session check
        const savedSession = typeof window !== 'undefined' ? localStorage.getItem('rnb_admin_session') : null;
        if (savedSession) {
          try {
            const parsed = JSON.parse(savedSession);
            if (isMounted) setUser(parsed);
          } catch {
            localStorage.removeItem('rnb_admin_session');
          }
        }
      }

      if (isMounted) {
        setLoading(false);
        clearTimeout(safetyTimer);
      }
    }

    initSession();

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [isSupabaseLive]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const supabase = getSupabaseClient();

    if (supabase && isSupabaseLive) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (!error && data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            role: 'admin',
            created_at: data.user.created_at,
          });
          return { success: true };
        }

        // If Supabase authentication returned an error, also check if demo credentials match
        if (
          cleanEmail.toLowerCase() === DEMO_ADMIN_EMAIL.toLowerCase() &&
          password === DEMO_ADMIN_PASSWORD
        ) {
          const demoUser: AdminUser = {
            id: 'admin-local-demo',
            email: DEMO_ADMIN_EMAIL,
            role: 'super_admin',
            created_at: new Date().toISOString(),
          };
          setUser(demoUser);
          localStorage.setItem('rnb_admin_session', JSON.stringify(demoUser));
          return { success: true };
        }

        return {
          success: false,
          error: error?.message || 'Authentication failed. Please verify your credentials.',
        };
      } catch (err: any) {
        // Fallback to demo if offline or connection issue
        if (
          cleanEmail.toLowerCase() === DEMO_ADMIN_EMAIL.toLowerCase() &&
          password === DEMO_ADMIN_PASSWORD
        ) {
          const demoUser: AdminUser = {
            id: 'admin-local-demo',
            email: DEMO_ADMIN_EMAIL,
            role: 'super_admin',
            created_at: new Date().toISOString(),
          };
          setUser(demoUser);
          localStorage.setItem('rnb_admin_session', JSON.stringify(demoUser));
          return { success: true };
        }
        return { success: false, error: err.message || 'Login request failed.' };
      }
    }

    // Demo / Local Auth validation
    if (
      cleanEmail.toLowerCase() === DEMO_ADMIN_EMAIL.toLowerCase() &&
      password === DEMO_ADMIN_PASSWORD
    ) {
      const demoUser: AdminUser = {
        id: 'admin-local-1',
        email: DEMO_ADMIN_EMAIL,
        role: 'super_admin',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser);
      localStorage.setItem('rnb_admin_session', JSON.stringify(demoUser));
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your email and password.',
    };
  };

  const logout = async (): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase && isSupabaseLive) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut notice:', e);
      }
    }
    localStorage.removeItem('rnb_admin_session');
    setUser(null);
    router.replace('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSupabaseLive }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
