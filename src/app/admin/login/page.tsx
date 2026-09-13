'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LOGO_IMAGE_SRC } from '@/lib/logo-base64';

export default function AdminLoginPage() {
  const { user, login, isSupabaseLive, loading: authLoading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in, redirect to admin home
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        router.push('/admin');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-deep flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />

      {/* Return to website link */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-on-primary/80 hover:text-secondary-container transition-colors py-2 px-3 rounded-lg hover:bg-white/5"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          <span>Back to RnB Digitals</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-surface rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary-container border border-secondary-container/30 shadow-lg mb-4">
            <img
              src={LOGO_IMAGE_SRC}
              alt="RnB Digitals"
              className="h-9 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-container font-display tracking-tight">
            Admin CMS Portal
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5">
            Sign in with authorized administrator credentials
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-error/10 border border-error/20 flex items-start gap-3 text-xs font-semibold text-error">
            <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
              Admin Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-lg">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-10 pr-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-secondary-container focus:bg-surface focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-lg">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl pl-10 pr-11 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-secondary-container focus:bg-surface focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface p-1"
                aria-label="Toggle password visibility"
              >
                <span className="material-symbols-outlined text-lg">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-primary-container text-on-primary font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-primary transition-all duration-200 shadow-md hover:shadow-forest-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-secondary-container border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg text-secondary-container">
                  login
                </span>
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center text-xs text-on-surface-variant">
          Protected by RnB Digitals Security • Supabase RLS
        </div>
      </div>
    </div>
  );
}
