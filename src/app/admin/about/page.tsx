'use client';

import React, { useState, useEffect } from 'react';
import {
  getAboutPillars,
  saveAboutPillar,
  deleteAboutPillar,
  getSiteStats,
  saveSiteStat,
} from '@/lib/cms-data';
import { AboutPillar, SiteStat } from '@/types/cms';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminAboutPage() {
  const [pillars, setPillars] = useState<AboutPillar[]>([]);
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [editingPillar, setEditingPillar] = useState<Partial<AboutPillar> | null>(null);
  const [deletingPillarId, setDeletingPillarId] = useState<string | null>(null);

  const [editingStat, setEditingStat] = useState<Partial<SiteStat> | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const [loadedPillars, loadedStats] = await Promise.all([
          getAboutPillars(),
          getSiteStats(),
        ]);
        setPillars(loadedPillars);
        setStats(loadedStats);
      } catch {
        addToast('error', 'Failed to load About section data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSavePillar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPillar || !editingPillar.title) return;

    try {
      const saved = await saveAboutPillar({
        id: editingPillar.id,
        title: editingPillar.title,
        description: editingPillar.description || '',
        icon: editingPillar.icon || 'verified',
        sort_order: editingPillar.sort_order,
        is_active: editingPillar.is_active ?? true,
      });

      const updated = await getAboutPillars();
      setPillars(updated);
      setEditingPillar(null);
      addToast('success', `Pillar "${saved.title}" saved!`);
    } catch {
      addToast('error', 'Failed to save pillar');
    }
  };

  const handleDeletePillar = async () => {
    if (!deletingPillarId) return;
    try {
      await deleteAboutPillar(deletingPillarId);
      setPillars((prev) => prev.filter((p) => p.id !== deletingPillarId));
      setDeletingPillarId(null);
      addToast('success', 'Value pillar removed.');
    } catch {
      addToast('error', 'Failed to delete pillar');
    }
  };

  const handleSaveStat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat || !editingStat.value || !editingStat.label) return;

    try {
      await saveSiteStat({
        id: editingStat.id,
        value: editingStat.value,
        label: editingStat.label,
        sort_order: editingStat.sort_order,
        is_active: editingStat.is_active ?? true,
      });

      const updated = await getSiteStats();
      setStats(updated);
      setEditingStat(null);
      addToast('success', 'Statistic counter updated!');
    } catch {
      addToast('error', 'Failed to update statistic');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading About & Value Pillars...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header */}
      <div className="bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
        <h2 className="text-lg font-bold text-primary-container font-display">
          About Us: Why Choose RnB Digitals
        </h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Manage the 4 core value pillars and statistics counters displayed in the "Why Choose Us" section.
        </p>
      </div>

      {/* Stats Counters Grid */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <h3 className="text-base font-bold text-primary-container font-display mb-4">
          Key Statistics Counters
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between"
            >
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-container font-display">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingStat(stat)}
                className="mt-3 text-xs font-bold text-secondary-container bg-primary-container hover:bg-primary py-1 px-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">edit</span>
                Edit Counter
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-primary-container font-display">
              Why Choose Us - Value Pillars
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Highlight your industrial advantages, turnaround speed, and customer dedication.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setEditingPillar({
                title: '',
                description: '',
                icon: 'verified',
                sort_order: pillars.length + 1,
                is_active: true,
              })
            }
            className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            <span>Add Value Pillar</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between group hover:shadow-ambient transition-all"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center text-secondary-container mb-4 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">{pillar.icon}</span>
                </div>
                <h4 className="font-bold text-sm text-primary-container font-display">
                  {pillar.title}
                </h4>
                <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setEditingPillar(pillar)}
                  className="px-3 py-1 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingPillarId(pillar.id)}
                  className="p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Pillar Modal */}
      {editingPillar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingPillar.id ? 'Edit Value Pillar' : 'Add Value Pillar'}
            </h3>

            <form onSubmit={handleSavePillar} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Pillar Title
                </label>
                <input
                  type="text"
                  required
                  value={editingPillar.title || ''}
                  onChange={(e) => setEditingPillar({ ...editingPillar, title: e.target.value })}
                  placeholder="e.g. State-of-the-Art Technology"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Google Material Icon
                  </label>
                  <input
                    type="text"
                    value={editingPillar.icon || 'verified'}
                    onChange={(e) => setEditingPillar({ ...editingPillar, icon: e.target.value })}
                    placeholder="e.g. verified, local_shipping"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingPillar.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingPillar({
                        ...editingPillar,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingPillar.description || ''}
                  onChange={(e) =>
                    setEditingPillar({ ...editingPillar, description: e.target.value })
                  }
                  placeholder="Details explaining this pillar to prospective customers"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingPillar(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Pillar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Stat Modal */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              Edit Metric Counter
            </h3>

            <form onSubmit={handleSaveStat} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Value Displayed (e.g. 500+, 99.8%, 24-48h, 36)
                </label>
                <input
                  type="text"
                  required
                  value={editingStat.value || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, value: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface text-base font-bold focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Counter Label (e.g. Completed Projects, Client Satisfaction)
                </label>
                <input
                  type="text"
                  required
                  value={editingStat.label || ''}
                  onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingStat(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Counter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingPillarId}
        title="Delete Pillar"
        message="Are you sure you want to remove this value pillar?"
        confirmText="Delete Pillar"
        onConfirm={handleDeletePillar}
        onCancel={() => setDeletingPillarId(null)}
      />
    </div>
  );
}
