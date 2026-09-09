'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, updateSiteSettings } from '@/lib/cms-data';
import { SiteSettings } from '@/types/cms';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminFooterPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const loaded = await getSiteSettings();
        setSettings(loaded);
      } catch {
        addToast('error', 'Failed to load footer settings');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const updated = await updateSiteSettings({
        footer_description: settings.footer_description,
        footer_copyright: settings.footer_copyright,
      });
      setSettings(updated);
      addToast('success', 'Footer content saved successfully!');
    } catch {
      addToast('error', 'Failed to save footer content');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Footer Management...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <h2 className="text-lg font-bold text-primary-container font-display">
                Footer Content & Copyright
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Edit the brand bio, legal copyright, and region tags at the bottom of the website.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm text-secondary-container">
                save
              </span>
              <span>{saving ? 'Saving...' : 'Save Footer'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                Footer Brand Summary / Description
              </label>
              <textarea
                rows={3}
                required
                value={settings.footer_description}
                onChange={(e) =>
                  setSettings({ ...settings, footer_description: e.target.value })
                }
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                Copyright Notice Bar
              </label>
              <input
                type="text"
                required
                value={settings.footer_copyright}
                onChange={(e) =>
                  setSettings({ ...settings, footer_copyright: e.target.value })
                }
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
              />
            </div>

            <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">
                Navigation Links in Footer
              </span>
              <p className="text-xs text-on-surface-variant">
                To manage which links appear in the footer columns, use the{' '}
                <a href="/admin/settings" className="font-bold text-primary-container hover:underline">
                  Header & Navigation Settings
                </a>{' '}
                page and check/uncheck the "Show in Footer" toggle.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
