'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, saveProduct, deleteProduct } from '@/lib/cms-data';
import { ProductItem } from '@/types';
import ImageUploader from '@/components/admin/ImageUploader';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminStorePage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [editingProduct, setEditingProduct] = useState<Partial<ProductItem> | null>(null);
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
        const data = await getProducts();
        setProducts(data);
      } catch {
        addToast('error', 'Failed to load catalog products');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEditor = (prod?: ProductItem) => {
    if (prod) {
      setEditingProduct(prod);
    } else {
      setEditingProduct({
        id: `prod-${Date.now()}`,
        name: '',
        category: 'Merchandise',
        description: '',
        priceFormatted: '₦5,000',
        minOrder: '10 pcs',
        image: '',
        badge: 'Popular',
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name || !editingProduct.id) {
      addToast('error', 'Please provide product name and details');
      return;
    }

    try {
      const toSave: ProductItem = {
        id: editingProduct.id,
        name: editingProduct.name,
        category: editingProduct.category || 'General',
        description: editingProduct.description || '',
        priceFormatted: editingProduct.priceFormatted || '₦0',
        minOrder: editingProduct.minOrder || '1 pc',
        image:
          editingProduct.image ||
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
        badge: editingProduct.badge || undefined,
      };

      await saveProduct(toSave);
      const updated = await getProducts();
      setProducts(updated);
      setEditingProduct(null);
      addToast('success', `Product "${toSave.name}" saved!`);
    } catch {
      addToast('error', 'Failed to save product');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteProduct(deletingId);
      setProducts((prev) => prev.filter((p) => p.id !== deletingId));
      setDeletingId(null);
      addToast('success', 'Product deleted from store catalog.');
    } catch {
      addToast('error', 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Store Catalog...</span>
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
            Ready-to-Brand Merchandise Catalog
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage featured products shown in the store preview section on the homepage.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openEditor()}
          className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
          <span>Add New Product</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-surface rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm hover:shadow-ambient transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 w-full bg-surface-container overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-xs">
                    {prod.badge}
                  </span>
                )}
                <span className="absolute bottom-2.5 right-2.5 bg-primary-container text-on-primary text-[10px] font-semibold px-2 py-0.5 rounded">
                  Min: {prod.minOrder}
                </span>
              </div>

              <div className="p-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">
                  {prod.category}
                </div>
                <h3 className="font-bold text-sm text-primary-container font-display mt-0.5 line-clamp-1">
                  {prod.name}
                </h3>
                <p className="text-xs text-on-surface-variant mt-1.5 line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>
                <div className="mt-3 text-base font-extrabold text-secondary-container bg-primary-container px-2 py-1 rounded-lg inline-block">
                  {prod.priceFormatted}
                </div>
              </div>
            </div>

            <div className="p-3 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => openEditor(prod)}
                className="px-3 py-1 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-xs">edit</span>
                Edit
              </button>
              <button
                type="button"
                onClick={() => setDeletingId(prod.id)}
                className="p-1 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-surface rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-outline-variant/40 my-8">
            <h3 className="text-base font-bold text-primary-container font-display mb-4">
              {editingProduct.id && products.some((p) => p.id === editingProduct.id)
                ? 'Edit Catalog Product'
                : 'Add New Product'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <ImageUploader
                  label="Product Photo (Supabase Storage)"
                  currentUrl={editingProduct.image}
                  onImageUploaded={(url) => setEditingProduct({ ...editingProduct, image: url })}
                  folder="products"
                  aspectRatio="square"
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Executive Thermal Smart Tumbler (500ml)"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, category: e.target.value })
                    }
                    placeholder="e.g. Merchandise, Packaging, Apparel"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Badge Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, badge: e.target.value })
                    }
                    placeholder="e.g. Best Seller, Popular, Premium"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Display Price
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.priceFormatted || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, priceFormatted: e.target.value })
                    }
                    placeholder="e.g. ₦7,500"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                    Minimum Order Quantity
                  </label>
                  <input
                    type="text"
                    value={editingProduct.minOrder || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, minOrder: e.target.value })
                    }
                    placeholder="e.g. 10 pcs, 1 pack, 200 pcs"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1">
                  Product Description
                </label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Material specifications, branding application method, dimensions"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-xl px-3 py-2 text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 font-semibold text-on-surface-variant hover:bg-surface-container rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-container text-on-primary font-bold rounded-xl hover:bg-primary cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Delete Product"
        message="Are you sure you want to delete this product from the store catalog?"
        confirmText="Delete Product"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
