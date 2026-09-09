'use client';

import React, { useState, useEffect } from 'react';
import { getPortfolioItems, savePortfolioItem, deletePortfolioItem } from '@/lib/cms-data';
import { PortfolioItem } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [editingItem, setEditingItem] = useState<Partial<PortfolioItem> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getPortfolioItems();
        setItems(data);
      } catch {
        addToast('error', 'Failed to load portfolio items');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEditor = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item);
      setTagsInput((item.tags || []).join(', '));
    } else {
      setEditingItem({
        id: `port-${Date.now()}`,
        title: '',
        category: 'print',
        categoryLabel: 'Large Format',
        client: '',
        description: '',
        image: '',
        tags: [],
      });
      setTagsInput('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title || !editingItem.id) {
      addToast('error', 'Please provide project title');
      return;
    }

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const categoryLabelMap: Record<string, string> = {
        print: 'Large Format',
        apparel: 'Custom Apparel',
        branding: 'Branding & Packaging',
        digital: 'Digital Solutions',
        all: 'General',
      };

      const toSave: PortfolioItem = {
        id: editingItem.id,
        title: editingItem.title,
        category: editingItem.category || 'print',
        categoryLabel:
          editingItem.categoryLabel || categoryLabelMap[editingItem.category || 'print'] || 'Featured',
        client: editingItem.client || 'Client Confidential',
        description: editingItem.description || '',
        image:
          editingItem.image ||
          'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=800&q=80',
        tags: tags.length > 0 ? tags : ['Branding', 'Print'],
      };

      await savePortfolioItem(toSave);
      const updated = await getPortfolioItems();
      setItems(updated);
      setEditingItem(null);
      addToast('success', `Case study "${toSave.title}" saved!`);
    } catch {
      addToast('error', 'Failed to save portfolio item');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deletePortfolioItem(deletingId);
      setItems((prev) => prev.filter((i) => i.id !== deletingId));
      setDeletingId(null);
      addToast('success', 'Project removed from showcase.');
    } catch {
      addToast('error', 'Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Portfolio Showcase...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary-container font-display">
            Portfolio & Case Studies Management
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage the gallery of client projects, photographs, tags, and client attributions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openEditor()}
          className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_photo_alternate</span>
          <span>Add New Project</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-ambient transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-52 w-full bg-surface-container overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-primary-container/90 text-secondary-container px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  {item.categoryLabel || item.category}
                </span>
              </div>

              <div className="p-5">
                <div className="text-[11px] font-semibold text-secondary-container bg-primary-container/10 px-2 py-0.5 rounded inline-block mb-1.5">
                  Client: {item.client}
                </div>
                <h3 className="font-bold text-base text-primary-container font-display">
                  {item.title}
                </h3>
                <p className="text-xs text-on-surface-variant mt-2 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-outline-variant/30">
                  {item.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => openEditor(item)}
                className="px-3 py-1.5 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">edit</span>
                Edit Project
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(item.id)}
                className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 my-8">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingItem.id && items.some((i) => i.id === editingItem.id)
                ? 'Edit Case Study'
                : 'Add Case Study'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <ImageUploader
                  label="Project Showcase Image (Supabase Storage)"
                  currentUrl={editingItem.image}
                  onImageUploaded={(url) => setEditingItem({ ...editingItem, image: url })}
                  folder="portfolio"
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.title || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  placeholder="e.g. Executive Brand Identity & Stationery Suite"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Category Filter
                  </label>
                  <select
                    value={editingItem.category || 'print'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  >
                    <option value="print">Large Format & Signs</option>
                    <option value="apparel">Apparel & Uniforms</option>
                    <option value="branding">Branding & Packaging</option>
                    <option value="digital">Web & Digital</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editingItem.client || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, client: e.target.value })}
                    placeholder="e.g. Apex Capital Partners"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="Describe the materials, print technique, client specifications and final result"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Logo Design, Stationery, Gold Foil, Corporate"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Project"
        message="Are you sure you want to remove this project from the portfolio showcase?"
        confirmText="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
