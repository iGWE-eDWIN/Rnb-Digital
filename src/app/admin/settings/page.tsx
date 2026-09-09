'use client';

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  updateSiteSettings,
  getNavigationLinks,
  saveNavigationLink,
  deleteNavigationLink,
} from '@/lib/cms-data';
import { SiteSettings, NavigationLink } from '@/types/cms';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [navLinks, setNavLinks] = useState<NavigationLink[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Navigation link modal/form state
  const [editingLink, setEditingLink] = useState<Partial<NavigationLink> | null>(null);
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedNav] = await Promise.all([
          getSiteSettings(),
          getNavigationLinks(),
        ]);
        setSettings(loadedSettings);
        setNavLinks(loadedNav);
      } catch (err: any) {
        addToast('error', 'Failed to load settings');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    try {
      const updated = await updateSiteSettings(settings);
      setSettings(updated);
      addToast('success', 'Header and site settings updated successfully!');
    } catch (err: any) {
      addToast('error', err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink || !editingLink.label || !editingLink.href) return;

    try {
      const saved = await saveNavigationLink({
        id: editingLink.id,
        label: editingLink.label,
        href: editingLink.href,
        sort_order: editingLink.sort_order,
        is_header: editingLink.is_header ?? true,
        is_footer: editingLink.is_footer ?? true,
        is_active: editingLink.is_active ?? true,
      });

      const updatedList = await getNavigationLinks();
      setNavLinks(updatedList);
      setEditingLink(null);
      addToast('success', `Navigation link "${saved.label}" saved!`);
    } catch (err: any) {
      addToast('error', 'Failed to save navigation link');
    }
  };

  const handleDeleteLink = async () => {
    if (!deletingLinkId) return;
    try {
      await deleteNavigationLink(deletingLinkId);
      setNavLinks((prev) => prev.filter((link) => link.id !== deletingLinkId));
      setDeletingLinkId(null);
      addToast('success', 'Navigation link deleted.');
    } catch {
      addToast('error', 'Failed to delete link');
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Header & Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header & Logo Section */}
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <h2 className="text-lg font-bold text-primary-container font-display">
                Website Branding & Header Logo
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Manage the website title, slogan, announcement bar, and brand logo.
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
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Logo Upload Column */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                Header Logo Image
              </label>
              <ImageUploader
                currentUrl={settings.logo_url}
                onImageUploaded={(url) => setSettings({ ...settings, logo_url: url })}
                folder="logos"
                aspectRatio="square"
                helperText="Upload transparent PNG, SVG or WEBP logo."
              />
              <p className="text-[11px] text-on-surface-variant mt-2 leading-relaxed">
                If no custom logo image is uploaded, the website automatically displays the brand icon and stylized font logo.
              </p>
            </div>

            {/* Brand Text Fields */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.site_name}
                    onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                    Tagline / Subtext
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Announcement Pill / Trust Badge (Top Bar)
                </label>
                <input
                  type="text"
                  value={settings.announcement_badge}
                  onChange={(e) =>
                    setSettings({ ...settings, announcement_badge: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                    Header Hotline Phone
                  </label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_phone: e.target.value })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                    WhatsApp Direct Number (digits only, e.g. 2348164171414)
                  </label>
                  <input
                    type="text"
                    value={settings.contact_whatsapp}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_whatsapp: e.target.value })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Navigation Menu Links CRUD */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-container font-display">
              Header & Footer Navigation Menu
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Add, reorder, edit, and toggle links displayed in the website navigation bar and mobile drawer.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingLink({
                label: '',
                href: '#',
                sort_order: navLinks.length + 1,
                is_header: true,
                is_footer: true,
                is_active: true,
              })
            }
            className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Navigation Link</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase font-bold text-[10px] tracking-wider">
                <th className="py-3 px-3">Order</th>
                <th className="py-3 px-3">Label</th>
                <th className="py-3 px-3">Destination URL / Anchor</th>
                <th className="py-3 px-3">Locations</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {navLinks.map((link) => (
                <tr key={link.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-3 font-bold text-primary-container">{link.sort_order}</td>
                  <td className="py-3 px-3 font-bold text-on-surface">{link.label}</td>
                  <td className="py-3 px-3 text-on-surface-variant font-mono text-[11px]">
                    {link.href}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      {link.is_header && (
                        <span className="text-[10px] font-semibold bg-primary-container/10 text-primary-container px-2 py-0.5 rounded">
                          Header
                        </span>
                      )}
                      {link.is_footer && (
                        <span className="text-[10px] font-semibold bg-surface-container text-on-surface px-2 py-0.5 rounded">
                          Footer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        link.is_active
                          ? 'bg-emerald-500/15 text-emerald-700'
                          : 'bg-outline-variant/30 text-on-surface-variant'
                      }`}
                    >
                      {link.is_active ? 'Active' : 'Hidden'}
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
        </div>
      </div>

      {/* Edit Navigation Link Modal */}
      {editingLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingLink.id ? 'Edit Navigation Link' : 'Add New Navigation Link'}
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
                  placeholder="e.g. Services, Portfolio, Shop"
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
                  placeholder="e.g. #services, #portfolio, or /contact"
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
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div className="flex flex-col justify-end space-y-1.5 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLink.is_header ?? true}
                      onChange={(e) =>
                        setEditingLink({ ...editingLink, is_header: e.target.checked })
                      }
                      className="rounded text-primary-container"
                    />
                    <span className="font-semibold text-on-surface">Show in Header</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLink.is_footer ?? true}
                      onChange={(e) =>
                        setEditingLink({ ...editingLink, is_footer: e.target.checked })
                      }
                      className="rounded text-primary-container"
                    />
                    <span className="font-semibold text-on-surface">Show in Footer</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLink.is_active ?? true}
                      onChange={(e) =>
                        setEditingLink({ ...editingLink, is_active: e.target.checked })
                      }
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
                  className="px-4 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingLinkId}
        title="Delete Navigation Link"
        message="Are you sure you want to remove this navigation link? It will immediately disappear from the public website menu."
        confirmText="Delete Link"
        onConfirm={handleDeleteLink}
        onCancel={() => setDeletingLinkId(null)}
      />
    </div>
  );
}
