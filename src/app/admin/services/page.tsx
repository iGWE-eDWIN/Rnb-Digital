'use client';

import React, { useState, useEffect } from 'react';
import { getServices, saveService, deleteService } from '@/lib/cms-data';
import { ServiceItem } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [featuresText, setFeaturesText] = useState('');
  const [materialsText, setMaterialsText] = useState('');

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        setServices(data);
      } catch {
        addToast('error', 'Failed to load services');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEditor = (service?: ServiceItem) => {
    if (service) {
      setEditingService(service);
      setFeaturesText((service.features || []).join('\n'));
      setMaterialsText((service.materials || []).join('\n'));
    } else {
      const newSvc: Partial<ServiceItem> = {
        id: `svc-${Date.now()}`,
        title: '',
        category: 'print',
        iconName: 'printer',
        popularFor: '',
        shortDesc: '',
        fullDesc: '',
        features: [],
        materials: [],
        image: '',
        startingPrice: '₦10,000',
      };
      setEditingService(newSvc);
      setFeaturesText('');
      setMaterialsText('');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !editingService.title || !editingService.id) {
      addToast('error', 'Please provide a title and service details');
      return;
    }

    try {
      const features = featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
      const materials = materialsText
        .split('\n')
        .map((m) => m.trim())
        .filter(Boolean);

      const toSave: ServiceItem = {
        id: editingService.id,
        title: editingService.title,
        category: editingService.category || 'print',
        iconName: editingService.iconName || 'printer',
        popularFor: editingService.popularFor || '',
        shortDesc: editingService.shortDesc || '',
        fullDesc: editingService.fullDesc || '',
        features: features.length > 0 ? features : ['Quality Guaranteed'],
        materials: materials,
        image: editingService.image || 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        startingPrice: editingService.startingPrice || '',
      };

      await saveService(toSave);
      const updated = await getServices();
      setServices(updated);
      setEditingService(null);
      addToast('success', `Service "${toSave.title}" saved successfully!`);
    } catch {
      addToast('error', 'Failed to save service');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteService(deletingId);
      setServices((prev) => prev.filter((s) => s.id !== deletingId));
      setDeletingId(null);
      addToast('success', 'Service deleted successfully.');
    } catch {
      addToast('error', 'Failed to delete service');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Services Catalog...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface p-6 rounded-2xl border border-outline-variant/40 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-primary-container font-display">
            Services Catalog Management
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Add, update, or remove services displayed in the primary grid and detail modals on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openEditor()}
          className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-ambient transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Card Image */}
              <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-primary-container/90 text-secondary-container px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  {svc.category}
                </div>
                {svc.startingPrice && (
                  <div className="absolute bottom-3 right-3 bg-black/75 text-secondary-container px-2.5 py-1 rounded-md text-[11px] font-extrabold backdrop-blur-xs">
                    From {svc.startingPrice}
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="p-5">
                <h3 className="font-bold text-base text-primary-container font-display">
                  {svc.title}
                </h3>
                {svc.popularFor && (
                  <div className="text-[11px] font-semibold text-secondary-container bg-primary-container px-2 py-0.5 rounded inline-block mt-1">
                    {svc.popularFor}
                  </div>
                )}
                <p className="text-xs text-on-surface-variant mt-2.5 line-clamp-3 leading-relaxed">
                  {svc.shortDesc}
                </p>

                {/* Features count */}
                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                  <span>{svc.features?.length || 0} Key Features Listed</span>
                  <span className="font-mono text-[10px] bg-surface-container px-1.5 py-0.5 rounded">
                    Icon: {svc.iconName}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant font-medium">
                ID: <code className="font-bold text-primary-container">{svc.id}</code>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openEditor(svc)}
                  className="px-3 py-1.5 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xs">edit</span>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(svc.id)}
                  className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                  title="Delete service"
                >
                  <span className="material-symbols-outlined text-base">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Editor Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 my-8">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant/30">
              <h3 className="text-lg font-bold text-primary-container font-display">
                {editingService.id && services.some((s) => s.id === editingService.id)
                  ? 'Edit Service'
                  : 'Create New Service'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Service Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingService.title || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, title: e.target.value })
                    }
                    placeholder="e.g. Large Format Printing"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Category Tag
                  </label>
                  <select
                    value={editingService.category || 'print'}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  >
                    <option value="print">Large Format / Print</option>
                    <option value="apparel">Custom Apparel & Embroidery</option>
                    <option value="merchandise">Branded Merchandise</option>
                    <option value="packaging">Packaging & Tissue Paper</option>
                    <option value="branding">Brand Identity & Stationery</option>
                    <option value="digital">Web & Digital Solutions</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Popular For / Subtitle Tag
                  </label>
                  <input
                    type="text"
                    value={editingService.popularFor || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, popularFor: e.target.value })
                    }
                    placeholder="e.g. Banners, Signage & Vehicle Wraps"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Starting Price Label
                  </label>
                  <input
                    type="text"
                    value={editingService.startingPrice || ''}
                    onChange={(e) =>
                      setEditingService({ ...editingService, startingPrice: e.target.value })
                    }
                    placeholder="e.g. ₦12,000 or ₦6,500 / unit"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              {/* Service Image Uploader */}
              <div>
                <ImageUploader
                  label="Service Image (Supabase Storage)"
                  currentUrl={editingService.image}
                  onImageUploaded={(url) => setEditingService({ ...editingService, image: url })}
                  folder="services"
                  aspectRatio="video"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Short Description (Homepage Card)
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingService.shortDesc || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, shortDesc: e.target.value })
                  }
                  placeholder="Concise overview displayed on the main services grid"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Full Detailed Description (Modal View)
                </label>
                <textarea
                  rows={3}
                  value={editingService.fullDesc || ''}
                  onChange={(e) =>
                    setEditingService({ ...editingService, fullDesc: e.target.value })
                  }
                  placeholder="Detailed breakdown of capabilities and equipment used"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Key Features (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={featuresText}
                    onChange={(e) => setFeaturesText(e.target.value)}
                    placeholder="Industrial UV & eco-solvent fade-resistant inks&#10;Roll-up banners & stands&#10;Reflective vinyl vehicle wraps"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Available Materials / Finishes (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={materialsText}
                    onChange={(e) => setMaterialsText(e.target.value)}
                    placeholder="Heavy Flex Vinyl (440-510gsm)&#10;Savit Vinyl Sticker&#10;Backlit Film"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Service"
        message="Are you sure you want to delete this service? It will no longer be visible on the public website or in the quote calculator."
        confirmText="Delete Service"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
