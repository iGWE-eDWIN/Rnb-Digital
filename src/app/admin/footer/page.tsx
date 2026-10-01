'use client';

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  updateSiteSettings,
  getNavigationLinks,
  saveNavigationLink,
  deleteNavigationLink,
} from '@/lib/cms-data';
import { NavigationLink, SiteSettings } from '@/types/cms';
import Toast, { ToastMessage } from '@/components/admin/Toast';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function AdminFooterPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linkSaving, setLinkSaving] = useState(false);
  const [editingLink, setEditingLink] = useState<Partial<NavigationLink> | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
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
        const [loadedSettings, loadedLinks] = await Promise.all([
          getSiteSettings(),
          getNavigationLinks(),
        ]);
        setSettings(loadedSettings);
        setNavLinks(loadedLinks.sort((a, b) => a.sort_order - b.sort_order));
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
        contact_address: settings.contact_address,
        contact_phone: settings.contact_phone,
        contact_email: settings.contact_email,
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

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.label?.trim() || !editingLink.href?.trim()) return;

    setLinkSaving(true);
    try {
      const saved = await saveNavigationLink({
        ...editingLink,
        label: editingLink.label.trim(),
        href: editingLink.href.trim(),
        is_header: editingLink.is_header ?? false,
        is_footer: editingLink.is_footer ?? true,
        is_active: editingLink.is_active ?? true,
      });

      setNavLinks((prev) => {
        const next = editingLink.id
          ? prev.map((item) => (item.id === saved.id ? saved : item))
          : [...prev, saved];
        return next.sort((a, b) => a.sort_order - b.sort_order);
      });

      addToast('success', editingLink.id ? 'Footer link updated.' : 'Footer link added.');
      setEditingLink(null);
    } catch {
      addToast('error', 'Failed to save footer link.');
    } finally {
      setLinkSaving(false);
    }
  };

  const handleDeleteLink = async () => {
    if (!deletingLinkId) return;

    try {
      await deleteNavigationLink(deletingLinkId);
      setNavLinks((prev) => prev.filter((link) => link.id !== deletingLinkId));
      addToast('success', 'Footer link deleted.');
    } catch {
      addToast('error', 'Failed to delete footer link.');
    } finally {
      setDeletingLinkId(null);
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
                Edit the brand bio, legal copyright, and all footer links shown at the bottom of the site.
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
                Business Address
              </label>
              <textarea
                rows={2}
                required
                value={settings.contact_address}
                onChange={(e) =>
                  setSettings({ ...settings, contact_address: e.target.value })
                }
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={settings.contact_phone}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_phone: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={settings.contact_email}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_email: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>
            </div>

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
          </div>
        </div>
      </form>

      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-container font-display">
              Footer Navigation Links
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Manage all links that appear in the footer, including add, edit, reorder, and delete actions.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingLink({
                label: '',
                href: '#',
                sort_order: navLinks.filter((link) => link.is_footer).length + 1,
                is_header: false,
                is_footer: true,
                is_active: true,
              })
            }
            className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Footer Link</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Label</th>
                <th className="py-3 px-3">URL</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {navLinks.filter((link) => link.is_footer).map((link) => (
                <tr key={link.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-bold text-primary-container">{link.sort_order}</td>
                  <td className="py-3 px-3 font-bold text-on-surface">{link.label}</td>
                  <td className="py-3 px-3 text-on-surface-variant font-mono text-[11px] break-all">
                    {link.href}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        link.is_active
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-outline-variant/30 text-on-surface-variant'
                      }`}
                    >
                      {link.is_active ? 'Visible' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right space-x-1">
                    <button
                      type="button"
                      onClick={() => setEditingLink(link)}
                      className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingLinkId(link.id)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {navLinks.filter((link) => link.is_footer).length === 0 && (
            <div className="mt-4 rounded-xl border border-dashed border-outline-variant/50 bg-surface-container-low p-4 text-xs text-on-surface-variant">
              No footer links yet. Add one to appear in the website footer.
            </div>
          )}
        </div>
      </div>

      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingLink.id ? 'Edit Footer Link' : 'Add Footer Link'}
            </h3>

            <form onSubmit={handleSaveLink} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Link Label
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.label || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, label: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Destination URL / Anchor
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.href || ''}
                  onChange={(e) => setEditingLink({ ...editingLink, href: e.target.value })}
                  placeholder="#services, /contact, etc."
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingLink.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingLink({
                        ...editingLink,
                        sort_order: Number(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-1.5 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLink.is_footer ?? true}
                      onChange={(e) => setEditingLink({ ...editingLink, is_footer: e.target.checked })}
                      className="rounded text-primary-container"
                    />
                    <span className="font-semibold text-on-surface">Show in Footer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLink.is_active ?? true}
                      onChange={(e) => setEditingLink({ ...editingLink, is_active: e.target.checked })}
                      className="rounded text-primary-container"
                    />
                    <span className="font-semibold text-on-surface">Active</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingLink(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={linkSaving}
                  className="px-4 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer disabled:opacity-60"
                >
                  {linkSaving ? 'Saving...' : 'Save Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deletingLinkId}
        title="Delete Footer Link"
        message="This action will remove the link from the public footer immediately."
        confirmText="Delete Link"
        onConfirm={handleDeleteLink}
        onCancel={() => setDeletingLinkId(null)}
      />
    </div>
  );
}
