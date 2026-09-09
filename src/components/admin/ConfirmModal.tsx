'use client';

import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/50 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isDestructive
                ? 'bg-error/15 text-error'
                : 'bg-secondary-container/20 text-secondary-container'
            }`}
          >
            <span className="material-symbols-outlined text-2xl">
              {isDestructive ? 'warning' : 'help'}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-primary-container font-display">
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all shadow-sm cursor-pointer ${
              isDestructive
                ? 'bg-error text-on-error hover:bg-error/90'
                : 'bg-primary-container text-on-primary hover:bg-primary'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
