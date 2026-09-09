'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import ConfirmModal from './ConfirmModal';

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void;
  title: string;
}

export default function AdminHeader({ onOpenMobileSidebar, title }: AdminHeaderProps) {
  const { user, logout, isSupabaseLive } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <header className="h-16 sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 px-4 sm:px-6 md:px-8 flex items-center justify-between">
        {/* Left: Mobile Menu Trigger & Page Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 text-primary-container hover:bg-surface-container rounded-lg"
            aria-label="Open navigation sidebar"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-primary-container font-display">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Status Pill, User Profile & Logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Connection Status */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isSupabaseLive
                ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
            }`}
            title={
              isSupabaseLive
                ? 'Connected to live Supabase project'
                : 'Running in Local Storage demo mode. Add Supabase keys to .env.local for cloud sync.'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isSupabaseLive ? 'Supabase Live' : 'Demo Mode'}</span>
          </div>

          {/* User Account Info */}
          <div className="flex items-center gap-2 pl-2 border-l border-outline-variant/30">
            <div className="w-8 h-8 rounded-full bg-primary-container text-secondary-container flex items-center justify-center font-bold text-xs shadow-xs">
              {user?.email ? user.email.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-primary-container truncate max-w-[150px]">
                {user?.email || 'admin@rnbdigitals.com'}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                Administrator
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-colors cursor-pointer"
            title="Sign out of Admin Dashboard"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Sign Out"
        message="Are you sure you want to log out of the RnB Digitals Admin Dashboard?"
        confirmText="Yes, Log Out"
        cancelText="Stay Signed In"
        isDestructive={false}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          logout();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
