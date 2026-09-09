'use client';

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  updateSiteSettings,
  getHeroSlides,
  saveHeroSlide,
  deleteHeroSlide,
} from '@/lib/cms-data';
import { SiteSettings, HeroSlideItem } from '@/types/cms';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminHeroPage() {
  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [slides, setSlides] = useState<HeroSlideItem[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Slide modal state
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlideItem> | null>(null);
  const [deletingSlideId, setDeletingSlideId] = useState<string | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [loadedSettings, loadedSlides] = await Promise.all([
          getSiteSettings(),
          getHeroSlides(),
        ]);
        setSettings(loadedSettings);
        setSlides(loadedSlides);
      } catch (e) {
        addToast('error', 'Failed to load Hero section data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveHeroCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSavingHero(true);
    try {
      const updated = await updateSiteSettings({
        announcement_badge: settings.announcement_badge,
        hero_title: settings.hero_title,
        hero_subtitle: settings.hero_subtitle,
        hero_description: settings.hero_description,
        hero_cta1_text: settings.hero_cta1_text,
        hero_cta1_link: settings.hero_cta1_link,
        hero_cta2_text: settings.hero_cta2_text,
        hero_cta2_link: settings.hero_cta2_link,
      });
      setSettings(updated);
      addToast('success', 'Hero text content & buttons updated!');
    } catch {
      addToast('error', 'Failed to update hero copy');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title || !editingSlide.image_url) {
      addToast('error', 'Please provide a title and image for the slide');
      return;
    }

    try {
      const saved = await saveHeroSlide({
        id: editingSlide.id,
        title: editingSlide.title,
        subtitle: editingSlide.subtitle || '',
        tag: editingSlide.tag || 'Featured',
        image_url: editingSlide.image_url,
        alt: editingSlide.alt || editingSlide.title,
        sort_order: editingSlide.sort_order,
        is_active: editingSlide.is_active ?? true,
      });

      const updatedSlides = await getHeroSlides();
      setSlides(updatedSlides);
      setEditingSlide(null);
      addToast('success', `Slide "${saved.title}" saved successfully!`);
    } catch {
      addToast('error', 'Failed to save slide');
    }
  };

  const handleDeleteSlide = async () => {
    if (!deletingSlideId) return;
    try {
      await deleteHeroSlide(deletingSlideId);
      setSlides((prev) => prev.filter((s) => s.id !== deletingSlideId));
      setDeletingSlideId(null);
      addToast('success', 'Slide removed from hero carousel.');
    } catch {
      addToast('error', 'Failed to delete slide');
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Hero Management...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Hero Copy & Buttons */}
      <form onSubmit={handleSaveHeroCopy} className="space-y-6">
        <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
            <div>
              <h2 className="text-lg font-bold text-primary-container font-display">
                Hero Headlines & CTA Buttons
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Edit the primary headline, supporting copy, trust badges, and buttons displayed at the top of the homepage.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingHero}
              className="px-5 py-2.5 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm text-secondary-container">
                save
              </span>
              <span>{savingHero ? 'Saving...' : 'Save Hero Copy'}</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Top Trust Badge / Super-Headline
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Main Headline Accent Text (Gold Highlight)
                </label>
                <input
                  type="text"
                  value={settings.hero_subtitle}
                  onChange={(e) =>
                    setSettings({ ...settings, hero_subtitle: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                Main Headline
              </label>
              <input
                type="text"
                required
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-1.5">
                Supporting Value Proposition Copy
              </label>
              <textarea
                rows={3}
                required
                value={settings.hero_description}
                onChange={(e) =>
                  setSettings({ ...settings, hero_description: e.target.value })
                }
                className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none leading-relaxed"
              />
            </div>

            {/* Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-secondary-container/40 bg-secondary-container/5 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-container block">
                  Primary Action Button (Gold)
                </span>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-on-surface-variant mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.hero_cta1_text}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_cta1_text: e.target.value })
                    }
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-on-surface-variant mb-1">
                    Button Link / Target Anchor
                  </label>
                  <input
                    type="text"
                    value={settings.hero_cta1_link}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_cta1_link: e.target.value })
                    }
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs font-mono text-on-surface"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-outline-variant/50 bg-surface-container-low space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary-container block">
                  Secondary Action Button (Outline)
                </span>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-on-surface-variant mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    value={settings.hero_cta2_text}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_cta2_text: e.target.value })
                    }
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase text-on-surface-variant mb-1">
                    Button Link / Target Anchor
                  </label>
                  <input
                    type="text"
                    value={settings.hero_cta2_link}
                    onChange={(e) =>
                      setSettings({ ...settings, hero_cta2_link: e.target.value })
                    }
                    className="w-full bg-surface border border-outline-variant/40 rounded-lg px-3 py-1.5 text-xs font-mono text-on-surface"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Hero Slideshow CRUD */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-container font-display">
              Hero Showcase Slideshow
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Manage the high-impact rotating visual showcase on the right side of the hero section.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingSlide({
                title: '',
                subtitle: '',
                tag: 'Specialty',
                image_url: '',
                alt: '',
                sort_order: slides.length + 1,
                is_active: true,
              })
            }
            className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
            <span>Add New Slide</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm flex flex-col justify-between group hover:shadow-ambient transition-all"
            >
              <div>
                {/* Image */}
                <div className="relative h-44 w-full bg-surface-container overflow-hidden">
                  <img
                    src={slide.image_url}
                    alt={slide.alt || slide.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-primary-container/90 text-secondary-container backdrop-blur-xs">
                    {slide.tag}
                  </span>
                  <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">
                    #{slide.sort_order}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h4 className="font-bold text-sm text-primary-container line-clamp-1">
                    {slide.title}
                  </h4>
                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                    {slide.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="px-4 py-3 border-t border-outline-variant/30 flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    slide.is_active
                      ? 'bg-emerald-500/15 text-emerald-700'
                      : 'bg-outline-variant/30 text-on-surface-variant'
                  }`}
                >
                  {slide.is_active ? 'Active' : 'Disabled'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(slide)}
                    className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container rounded-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingSlideId(slide.id)}
                    className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Slide Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-outline-variant/40 my-8">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingSlide.id ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </h3>

            <form onSubmit={handleSaveSlide} className="space-y-4 text-xs">
              {/* Slide Image Uploader */}
              <div>
                <ImageUploader
                  label="Slide Image (Supabase Storage)"
                  currentUrl={editingSlide.image_url}
                  onImageUploaded={(url) => setEditingSlide({ ...editingSlide, image_url: url })}
                  folder="hero"
                  aspectRatio="video"
                  helperText="Recommended: 1200x800px high quality photography."
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Slide Title
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Custom Precision Embroidery & Apparel"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={editingSlide.subtitle || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  placeholder="e.g. Industrial multi-needle embroidery for executive uniforms & branded merchandise."
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Tag / Badge Label
                  </label>
                  <input
                    type="text"
                    value={editingSlide.tag || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, tag: e.target.value })}
                    placeholder="e.g. Custom Apparel"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingSlide.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Image Alt Text (SEO Accessibility)
                </label>
                <input
                  type="text"
                  value={editingSlide.alt || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, alt: e.target.value })}
                  placeholder="Descriptive text for accessibility and search engines"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={editingSlide.is_active ?? true}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, is_active: e.target.checked })
                  }
                  className="rounded text-primary-container"
                />
                <span className="font-semibold text-on-surface">Enable in Slideshow</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={!!deletingSlideId}
        title="Delete Hero Slide"
        message="Are you sure you want to remove this slide? It will no longer appear in the hero showcase."
        confirmText="Delete Slide"
        onConfirm={handleDeleteSlide}
        onCancel={() => setDeletingSlideId(null)}
      />
    </div>
  );
}
