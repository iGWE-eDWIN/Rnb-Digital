'use client';

import React, { useState, useEffect } from 'react';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '@/lib/cms-data';
import { TestimonialItem } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [editingItem, setEditingItem] = useState<Partial<TestimonialItem> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getTestimonials();
        setItems(data);
      } catch {
        addToast('error', 'Failed to load testimonials');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEditor = (item?: TestimonialItem) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem({
        id: `test-${Date.now()}`,
        name: '',
        role: 'CEO / Director',
        company: '',
        comment: '',
        rating: 5,
        avatar: '',
        projectType: 'Branding & Print',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name || !editingItem.comment || !editingItem.id) {
      addToast('error', 'Please provide client name and testimonial text');
      return;
    }

    try {
      const toSave: TestimonialItem = {
        id: editingItem.id,
        name: editingItem.name,
        role: editingItem.role || 'Executive',
        company: editingItem.company || 'Enterprise',
        comment: editingItem.comment,
        rating: Number(editingItem.rating) || 5,
        avatar:
          editingItem.avatar ||
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        projectType: editingItem.projectType || 'Branding & Print',
      };

      await saveTestimonial(toSave);
      const updated = await getTestimonials();
      setItems(updated);
      setEditingItem(null);
      addToast('success', `Testimonial from "${toSave.name}" saved!`);
    } catch {
      addToast('error', 'Failed to save testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteTestimonial(deletingId);
      setItems((prev) => prev.filter((t) => t.id !== deletingId));
      setDeletingId(null);
      addToast('success', 'Testimonial deleted.');
    } catch {
      addToast('error', 'Failed to delete testimonial');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Testimonials...</span>
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
            Client Testimonials & Reviews
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage feedback from clients, star ratings, avatar photos, and company titles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openEditor()}
          className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_comment</span>
          <span>Add Testimonial</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-surface rounded-2xl border border-outline-variant/30 p-6 shadow-sm flex flex-col justify-between hover:shadow-ambient transition-all"
          >
            <div>
              {/* Star Rating & Project Tag */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-0.5 text-secondary-container">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`material-symbols-outlined text-base ${
                        i < item.rating ? 'font-fill' : 'text-outline-variant'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-bold bg-primary-container/10 text-primary-container px-2 py-0.5 rounded">
                  {item.projectType}
                </span>
              </div>

              {/* Review text */}
              <p className="text-xs text-on-surface leading-relaxed italic mb-6">
                "{item.comment}"
              </p>
            </div>

            {/* Client Profile */}
            <div>
              <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-secondary-container/40"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-primary-container truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant truncate">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-2 flex items-center justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditor(item)}
                  className="px-3 py-1 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(item.id)}
                  className="p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 my-8">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingItem.id && items.some((i) => i.id === editingItem.id)
                ? 'Edit Testimonial'
                : 'Add New Testimonial'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <ImageUploader
                  label="Client Profile Avatar (Supabase Storage)"
                  currentUrl={editingItem.avatar}
                  onImageUploaded={(url) => setEditingItem({ ...editingItem, avatar: url })}
                  folder="testimonials"
                  aspectRatio="square"
                  helperText="Square headshot portrait."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder="e.g. Dr. Chidi Okafor"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Star Rating
                  </label>
                  <select
                    value={editingItem.rating ?? 5}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rating: parseInt(e.target.value) })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none font-bold"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Client Role / Title
                  </label>
                  <input
                    type="text"
                    value={editingItem.role || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, role: e.target.value })}
                    placeholder="e.g. Managing Director"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={editingItem.company || ''}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, company: e.target.value })
                    }
                    placeholder="e.g. St. Jude Healthcare"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Project Type Delivered
                </label>
                <input
                  type="text"
                  value={editingItem.projectType || ''}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, projectType: e.target.value })
                  }
                  placeholder="e.g. Signage & Staff Uniforms, Packaging & Tissue Paper"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Testimonial Quote
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingItem.comment || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, comment: e.target.value })}
                  placeholder="The client review text"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none leading-relaxed"
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial? It will no longer be visible on the public website."
        confirmText="Delete Testimonial"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
