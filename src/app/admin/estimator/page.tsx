'use client';

import React, { useState, useEffect } from 'react';
import {
  getEstimatorCategories,
  saveEstimatorCategory,
  deleteEstimatorCategory,
  saveEstimatorOption,
  deleteEstimatorOption,
} from '@/lib/cms-data';
import { EstimatorCategory, EstimatorOption } from '@/types/cms';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

const isAreaBasedCategory = (category: Partial<EstimatorCategory>) =>
  category.slug?.toLowerCase() === 'banner' ||
  /large format printing/i.test(category.name || '') ||
  /square feet|sq\.?\s*ft/i.test(category.unit_label || '');

export default function AdminEstimatorPage() {
  const [categories, setCategories] = useState<EstimatorCategory[]>([]);
  const [selectedCatId, setSelectedCatId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Category Modal
  const [editingCategory, setEditingCategory] = useState<Partial<EstimatorCategory> | null>(null);
  const [deletingCatId, setDeletingCatId] = useState<string | null>(null);

  // Option Modal
  const [editingOption, setEditingOption] = useState<Partial<EstimatorOption> | null>(null);
  const [deletingOptionId, setDeletingOptionId] = useState<string | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const reloadData = async (targetCatId?: string) => {
    try {
      const cats = await getEstimatorCategories();
      setCategories(cats);
      if (targetCatId) {
        setSelectedCatId(targetCatId);
      } else if (cats.length > 0 && (!selectedCatId || !cats.some((c) => c.id === selectedCatId))) {
        setSelectedCatId(cats[0].id);
      }
    } catch {
      addToast('error', 'Failed to load estimator configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  // Category Actions
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name) return;

    try {
      const saved = await saveEstimatorCategory({
        id: editingCategory.id,
        name: editingCategory.name,
        slug: editingCategory.slug || editingCategory.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        unit_label: isAreaBasedCategory(editingCategory) ? 'Square Feet' : editingCategory.unit_label || 'Units',
        base_rate: Number(editingCategory.base_rate) || 0,
        min_qty: isAreaBasedCategory(editingCategory) ? 1 : Number(editingCategory.min_qty) || 1,
        sort_order: editingCategory.sort_order,
        is_active: editingCategory.is_active ?? true,
      });

      await reloadData(saved.id);
      setEditingCategory(null);
      addToast('success', `Estimator category "${saved.name}" saved!`);
    } catch {
      addToast('error', 'Failed to save estimator category');
    }
  };

  const handleDeleteCategory = async () => {
    if (!deletingCatId) return;
    try {
      await deleteEstimatorCategory(deletingCatId);
      await reloadData();
      setDeletingCatId(null);
      addToast('success', 'Estimator category deleted.');
    } catch {
      addToast('error', 'Failed to delete category');
    }
  };

  // Option Actions
  const handleSaveOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOption || !editingOption.name || !selectedCatId) return;

    try {
      const saved = await saveEstimatorOption({
        id: editingOption.id,
        category_id: selectedCatId,
        name: editingOption.name,
        extra_price: Number(editingOption.extra_price) || 0,
        is_default: editingOption.is_default ?? false,
        sort_order: editingOption.sort_order,
        is_active: editingOption.is_active ?? true,
      });

      await reloadData(selectedCatId);
      setEditingOption(null);
      addToast('success', `Option "${saved.name}" saved with price ₦${saved.extra_price.toLocaleString()}`);
    } catch {
      addToast('error', 'Failed to save estimator option');
    }
  };

  const handleDeleteOption = async () => {
    if (!deletingOptionId || !selectedCatId) return;
    try {
      await deleteEstimatorOption(selectedCatId, deletingOptionId);
      await reloadData(selectedCatId);
      setDeletingOptionId(null);
      addToast('success', 'Option removed from estimator.');
    } catch {
      addToast('error', 'Failed to delete option');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Price Estimator Rules...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header Info */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-secondary-container/20 text-on-secondary-container text-[11px] font-bold uppercase tracking-wider mb-2">
            <span className="material-symbols-outlined text-xs text-secondary-container">tune</span>
            Dynamic Pricing Engine
          </div>
          <h2 className="text-lg font-bold text-primary-container font-display">
            Project Price Estimator Management
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Configure service rates and add-on finishings. Large Format Printing is priced per square foot: customer width × height gives the billable area, then area × rate gives the estimate.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setEditingCategory({
              name: '',
              slug: '',
                  unit_label: 'Units',
              base_rate: 1000,
              min_qty: 1,
              sort_order: categories.length + 1,
              is_active: true,
            })
          }
          className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add New Category</span>
        </button>
      </div>

      {/* Category Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => {
          const isSelected = cat.id === selectedCatId;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? 'bg-primary-container text-secondary-container shadow-md border border-secondary-container/40'
                  : 'bg-surface text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSelected ? 'bg-secondary-container' : 'bg-outline-variant'
                }`}
              />
              <span>{cat.name}</span>
              <span className="text-[10px] bg-black/20 text-white px-1.5 py-0.2 rounded-md">
                ₦{Number(cat.base_rate).toLocaleString()}{isAreaBasedCategory(cat) ? ' / sq ft' : ''}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Category Details & Options Editor */}
      {activeCategory && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Category Settings Card */}
          <div className="lg:col-span-4 bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/30">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-container">
                  Category Configuration
                </span>
                <button
                  type="button"
                  onClick={() => setEditingCategory(activeCategory)}
                  className="text-xs font-bold text-secondary-container bg-primary-container hover:bg-primary px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit Rates
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                    Category Name
                  </span>
                  <div className="text-sm font-bold text-primary-container font-display mt-0.5">
                    {activeCategory.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                      {isAreaBasedCategory(activeCategory) ? 'Rate per Square Foot' : 'Base Rate'}
                    </span>
                    <div className="text-base font-extrabold text-primary-container mt-1">
                      ₦{Number(activeCategory.base_rate).toLocaleString()}{isAreaBasedCategory(activeCategory) ? ' / sq ft' : ''}
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                      {isAreaBasedCategory(activeCategory) ? 'Pricing Unit' : 'Min Quantity'}
                    </span>
                    <div className="text-base font-extrabold text-primary-container mt-1">
                      {isAreaBasedCategory(activeCategory) ? 'Square Feet' : activeCategory.min_qty}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                    Measurement Unit Label
                  </span>
                  <div className="font-semibold text-on-surface mt-0.5">
                    {activeCategory.unit_label}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                    URL Slug
                  </span>
                  <div className="font-mono text-[11px] text-on-surface-variant mt-0.5">
                    {activeCategory.slug}
                  </div>
                </div>
              </div>
            </div>

            {/* Destructive Delete Button */}
            <div className="pt-6 mt-6 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setDeletingCatId(activeCategory.id)}
                className="w-full py-2 px-3 text-xs font-bold text-error hover:bg-error/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete This Entire Category
              </button>
            </div>
          </div>

          {/* Right Column: Specification & Finishing Options CRUD */}
          <div className="lg:col-span-8 bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-primary-container font-display">
                  Specifications & Add-on Finishing Options
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {isAreaBasedCategory(activeCategory)
                    ? 'For Large Format Printing, option extra rates are added to the base rate per square foot (e.g. foil, hemming, stands).'
                    : 'Options that clients can select with individual extra charges (e.g. foil, hemming, stands).'}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingOption({
                    category_id: activeCategory.id,
                    name: '',
                    extra_price: 0,
                    is_default: false,
                    sort_order: (activeCategory.options?.length || 0) + 1,
                    is_active: true,
                  })
                }
                className="px-3.5 py-2 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-sm text-secondary-container">add</span>
                <span>Add Specification Option</span>
              </button>
            </div>

            {(!activeCategory.options || activeCategory.options.length === 0) ? (
              <div className="text-center py-12 text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant/40">
                <span className="material-symbols-outlined text-3xl text-outline-variant mb-1">
                  checklist
                </span>
                <p className="text-xs font-semibold">No specifications added yet for this category.</p>
                <button
                  type="button"
                  onClick={() =>
                    setEditingOption({
                      category_id: activeCategory.id,
                      name: '',
                      extra_price: 0,
                      is_default: true,
                      sort_order: 1,
                      is_active: true,
                    })
                  }
                  className="mt-3 text-xs font-bold text-primary-container hover:underline"
                >
                  + Add First Option
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase font-bold text-[10px] tracking-wider">
                      <th className="py-2.5 px-3">Order</th>
                      <th className="py-2.5 px-3">Option Name</th>
                      <th className="py-2.5 px-3">Extra Rate (₦)</th>
                      <th className="py-2.5 px-3">Default</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {activeCategory.options.map((opt) => (
                      <tr key={opt.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-3 px-3 font-bold text-primary-container">
                          {opt.sort_order}
                        </td>
                        <td className="py-3 px-3 font-bold text-on-surface">
                          {opt.name}
                        </td>
                        <td className="py-3 px-3">
                          {opt.extra_price > 0 ? (
                            <span className="text-[11px] font-bold text-primary-container bg-secondary-container/20 px-2 py-0.5 rounded">
                              +₦{Number(opt.extra_price).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                              Included (₦0)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          {opt.is_default ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded">
                              Checked
                            </span>
                          ) : (
                            <span className="text-[10px] text-on-surface-variant">Optional</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              opt.is_active
                                ? 'bg-emerald-500/15 text-emerald-700'
                                : 'bg-outline-variant/30 text-on-surface-variant'
                            }`}
                          >
                            {opt.is_active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => setEditingOption(opt)}
                            className="p-1.5 text-on-surface-variant hover:text-primary-container hover:bg-surface-container rounded-lg cursor-pointer"
                            title="Edit option & price"
                          >
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingOptionId(opt.id)}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                            title="Delete option"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Edit Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingCategory.id ? 'Edit Estimator Category' : 'Add New Estimator Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, name: e.target.value })
                  }
                  placeholder="e.g. Large Format Printing"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    {isAreaBasedCategory(editingCategory) ? 'Rate per Square Foot (₦)' : 'Base Rate (₦)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={editingCategory.base_rate ?? 0}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        base_rate: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                {!isAreaBasedCategory(editingCategory) && <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Min Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={editingCategory.min_qty ?? 1}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        min_qty: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>}
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Unit Label (Displayed to client)
                </label>
                <input
                  type="text"
                  required
                  value={editingCategory.unit_label || ''}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, unit_label: e.target.value })
                  }
                  placeholder="e.g. Square Feet, Shirts, Packs"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Option Edit Modal */}
      {editingOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-2xl border border-outline-variant/40">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingOption.id ? 'Edit Specification Option' : 'Add New Specification Option'}
            </h3>

            <form onSubmit={handleSaveOption} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Option Name
                </label>
                <input
                  type="text"
                  required
                  value={editingOption.name || ''}
                  onChange={(e) => setEditingOption({ ...editingOption, name: e.target.value })}
                  placeholder="e.g. Heavy Duty Mesh / Backlit (510gsm)"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    {activeCategory && isAreaBasedCategory(activeCategory) ? 'Extra Rate per Sq Ft (₦)' : 'Extra Price (₦)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={editingOption.extra_price ?? 0}
                    onChange={(e) =>
                      setEditingOption({
                        ...editingOption,
                        extra_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none font-bold"
                  />
                  <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                    Enter 0 if included in base rate
                  </span>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editingOption.sort_order ?? 1}
                    onChange={(e) =>
                      setEditingOption({
                        ...editingOption,
                        sort_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOption.is_default ?? false}
                    onChange={(e) =>
                      setEditingOption({ ...editingOption, is_default: e.target.checked })
                    }
                    className="rounded text-primary-container"
                  />
                  <span className="font-semibold text-on-surface">Selected by Default</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOption.is_active ?? true}
                    onChange={(e) =>
                      setEditingOption({ ...editingOption, is_active: e.target.checked })
                    }
                    className="rounded text-primary-container"
                  />
                  <span className="font-semibold text-on-surface">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingOption(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      <ConfirmModal
        isOpen={!!deletingCatId}
        title="Delete Category"
        message="Are you sure you want to delete this category? All associated specification options and calculations will also be permanently removed from the public website."
        confirmText="Delete Category"
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeletingCatId(null)}
      />

      {/* Delete Option Modal */}
      <ConfirmModal
        isOpen={!!deletingOptionId}
        title="Delete Specification Option"
        message="Are you sure you want to remove this finishing option? The public estimator will no longer offer it."
        confirmText="Delete Option"
        onConfirm={handleDeleteOption}
        onCancel={() => setDeletingOptionId(null)}
      />
    </div>
  );
}
