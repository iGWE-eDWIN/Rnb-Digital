'use client';

import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        onDismiss(toasts[0].id);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-xl shadow-xl flex items-center justify-between gap-3 text-sm font-semibold transition-all transform translate-y-0 duration-300 animate-fade-in ${
            toast.type === 'success'
              ? 'bg-primary-container text-on-primary border border-secondary-container/40'
              : toast.type === 'error'
              ? 'bg-error text-on-error border border-error-container'
              : 'bg-surface-deep text-on-primary border border-outline-variant/40'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={`material-symbols-outlined text-xl ${
                toast.type === 'success'
                  ? 'text-secondary-container'
                  : 'text-white'
              }`}
            >
              {toast.type === 'success'
                ? 'check_circle'
                : toast.type === 'error'
                ? 'error'
                : 'info'}
            </span>
            <span>{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="p-1 hover:bg-white/20 rounded-md transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
}
