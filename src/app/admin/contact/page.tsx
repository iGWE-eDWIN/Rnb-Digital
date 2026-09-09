'use client';

import React, { useState, useEffect } from 'react';
import {
  getSiteSettings,
  updateSiteSettings,
  getInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '@/lib/cms-data';
import { SiteSettings, QuoteInquiry } from '@/types/cms';
import ConfirmModal from '@/components/admin/ConfirmModal';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminContactPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [inquiries, setInquiries] = useState<QuoteInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [activeTab, setActiveTab] = useState<'inbox' | 'details'>('inbox');
  const [selectedInquiry, setSelectedInquiry] = useState<QuoteInquiry | null>(null);
  const [deletingInquiryId, setDeletingInquiryId] = useState<string | null>(null);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function load() {
      try {
        const [loadedSettings, loadedInquiries] = await Promise.all([
          getSiteSettings(),
          getInquiries(),
        ]);
        setSettings(loadedSettings);
        setInquiries(loadedInquiries);
      } catch {
        addToast('error', 'Failed to load contact data');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveContactDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSavingSettings(true);
    try {
      const updated = await updateSiteSettings({
        contact_address: settings.contact_address,
        contact_phone: settings.contact_phone,
        contact_whatsapp: settings.contact_whatsapp,
        contact_email: settings.contact_email,
        operating_hours: settings.operating_hours,
      });
      setSettings(updated);
      addToast('success', 'Contact information updated successfully!');
    } catch {
      addToast('error', 'Failed to save contact information');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: QuoteInquiry['status']) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
    addToast('success', `Status updated to ${newStatus}`);
  };

  const handleDeleteInquiry = async () => {
    if (!deletingInquiryId) return;
    try {
      await deleteInquiry(deletingInquiryId);
      setInquiries((prev) => prev.filter((i) => i.id !== deletingInquiryId));
      if (selectedInquiry?.id === deletingInquiryId) {
        setSelectedInquiry(null);
      }
      setDeletingInquiryId(null);
      addToast('success', 'Inquiry deleted.');
    } catch {
      addToast('error', 'Failed to delete inquiry');
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading Contact & Inquiries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-outline-variant/40 pb-3">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'inbox'
              ? 'bg-primary-container text-secondary-container shadow-sm'
              : 'bg-surface text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-base">inbox</span>
          <span>Inquiries & Quotes Inbox</span>
          <span className="bg-secondary-container text-on-secondary-container text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
            {inquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'details'
              ? 'bg-primary-container text-secondary-container shadow-sm'
              : 'bg-surface text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <span className="material-symbols-outlined text-base">contact_mail</span>
          <span>Contact Information & Workshop Address</span>
        </button>
      </div>

      {activeTab === 'inbox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Inquiries List */}
          <div className="lg:col-span-7 bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-primary-container font-display">
                Client Submissions
              </h3>
              <span className="text-xs text-on-surface-variant font-medium">
                {inquiries.length} total received
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="text-center py-16 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                  drafts
                </span>
                <p className="text-xs font-semibold">No inquiries in your inbox.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id}
                      onClick={() => setSelectedInquiry(inq)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-secondary-container bg-secondary-container/10 shadow-xs'
                          : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-primary-container">
                            {inq.name}
                          </h4>
                          <div className="text-xs font-semibold text-on-surface-variant mt-0.5">
                            {inq.phone} {inq.email ? `• ${inq.email}` : ''}
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            inq.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-700'
                              : inq.status === 'contacted'
                              ? 'bg-blue-500/15 text-blue-700'
                              : 'bg-amber-500/15 text-amber-700'
                          }`}
                        >
                          {inq.status}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between text-[11px] text-on-surface-variant pt-2 border-t border-outline-variant/20">
                        <span className="font-semibold text-primary-container">
                          {inq.service || 'Website Inquiry'}
                        </span>
                        {inq.estimated_total && (
                          <span className="font-bold text-secondary-container bg-primary-container px-2 py-0.5 rounded">
                            {inq.estimated_total}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Selected Inquiry Detail View */}
          <div className="lg:col-span-5 bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
            {selectedInquiry ? (
              <div className="space-y-5 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
                  <h3 className="text-base font-bold text-primary-container font-display">
                    Inquiry Details
                  </h3>
                  <button
                    type="button"
                    onClick={() => setDeletingInquiryId(selectedInquiry.id)}
                    className="text-xs text-error hover:bg-error/10 p-1.5 rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                  </button>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                    Client Name
                  </span>
                  <div className="text-base font-extrabold text-primary-container mt-0.5">
                    {selectedInquiry.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                      Phone Number
                    </span>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="font-bold text-primary-container hover:underline block mt-0.5"
                    >
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                      Email
                    </span>
                    <div className="font-semibold text-on-surface mt-0.5 truncate">
                      {selectedInquiry.email || 'None Provided'}
                    </div>
                  </div>
                </div>

                {selectedInquiry.service && (
                  <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block">
                      Requested Service
                    </span>
                    <div className="font-bold text-primary-container mt-0.5">
                      {selectedInquiry.service}
                    </div>
                    {selectedInquiry.quantity && (
                      <div className="text-xs text-on-surface-variant mt-1">
                        Quantity: <span className="font-semibold">{selectedInquiry.quantity}</span>
                      </div>
                    )}
                    {selectedInquiry.estimated_total && (
                      <div className="text-sm font-extrabold text-secondary-container bg-primary-container px-2 py-1 rounded inline-block mt-2">
                        Estimated: {selectedInquiry.estimated_total}
                      </div>
                    )}
                  </div>
                )}

                {selectedInquiry.message && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Client Note / Message
                    </span>
                    <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-on-surface leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    Status Workflow
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'contacted', 'completed', 'archived'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleStatusChange(selectedInquiry.id, st)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                          selectedInquiry.status === st
                            ? 'bg-primary-container text-secondary-container'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-outline-variant/30">
                  <a
                    href={`https://wa.me/${selectedInquiry.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                      selectedInquiry.name
                    )},%20this%20is%20RnB%20Digitals%20regarding%20your%20quote%20inquiry.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-secondary-container text-on-secondary-container font-bold py-2.5 px-4 rounded-xl hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-2 text-center"
                  >
                    <span className="material-symbols-outlined text-base">chat</span>
                    Reply via WhatsApp Direct
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
                  touch_app
                </span>
                <p className="text-xs font-semibold">
                  Select an inquiry from the list to view specifications and reply.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'details' && (
        <form onSubmit={handleSaveContactDetails} className="space-y-6">
          <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline-variant/30">
              <div>
                <h3 className="text-base font-bold text-primary-container font-display">
                  Physical Workshop & Contact Coordinates
                </h3>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Update the office address, operating hours, and customer contact lines shown on the public website.
                </p>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="px-5 py-2.5 bg-primary-container text-on-primary hover:bg-primary font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-sm text-secondary-container">
                  save
                </span>
                <span>{savingSettings ? 'Saving...' : 'Save Contact Details'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                  Workshop & Office Physical Address
                </label>
                <textarea
                  rows={2}
                  required
                  value={settings.contact_address}
                  onChange={(e) =>
                    setSettings({ ...settings, contact_address: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                    Direct Telephone
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
                    WhatsApp Hotline Number
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.contact_whatsapp}
                    onChange={(e) =>
                      setSettings({ ...settings, contact_whatsapp: e.target.value })
                    }
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-primary-container mb-1.5">
                    Primary Email
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
                  Operating Hours
                </label>
                <input
                  type="text"
                  required
                  value={settings.operating_hours}
                  onChange={(e) =>
                    setSettings({ ...settings, operating_hours: e.target.value })
                  }
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2.5 font-semibold text-on-surface focus:ring-2 focus:ring-secondary-container focus:outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deletingInquiryId}
        title="Delete Inquiry"
        message="Are you sure you want to delete this client inquiry from your records?"
        confirmText="Delete Inquiry"
        onConfirm={handleDeleteInquiry}
        onCancel={() => setDeletingInquiryId(null)}
      />
    </div>
  );
}
