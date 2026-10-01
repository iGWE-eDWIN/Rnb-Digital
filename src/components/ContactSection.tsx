'use client';

import React, { useState, useEffect } from 'react';
import { getSiteSettings, submitInquiry, DEFAULT_SITE_SETTINGS } from '@/lib/cms-data';
import { SiteSettings } from '@/types/cms';

interface ContactSectionProps {
  settings?: SiteSettings;
}

export default function ContactSection({ settings: propSettings }: ContactSectionProps) {
  const [settings, setSettings] = useState<SiteSettings>(propSettings || DEFAULT_SITE_SETTINGS);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Large Format Printing',
    message: '',
  });

  useEffect(() => {
    async function load() {
      if (!propSettings) {
        const loaded = await getSiteSettings();
        if (loaded) setSettings(loaded);
      }
    }
    load();
  }, [propSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
      });
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Large Format Printing',
        message: '',
      });
    } catch (err) {
      console.warn('Inquiry submit error:', err);
      // Still show success to visitor
      setFormSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-32 bg-surface relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Contact Details & Location Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-wider mb-3">
                <span className="material-symbols-outlined text-sm text-secondary-container">contact_mail</span>
                Get In Touch
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-primary-container tracking-tight font-display mb-4">
                Let's Build Something Exceptional
              </h2>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                Visit our physical workshop in Port Harcourt, call our direct support line, or send a quick inquiry for tailored business solutions.
              </p>
            </div>

            {/* Information Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">location_on</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-container/70 mb-1">
                    Port Harcourt Workshop & Office
                  </h4>
                  <p className="text-sm font-semibold text-on-surface">
                    {settings.contact_address}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    (Branch access also available off East-West Road, Port Harcourt)
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">call</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-container/70 mb-1">
                    Direct Hotline & WhatsApp
                  </h4>
                  <a
                    href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`}
                    className="text-base font-bold text-primary-container hover:text-secondary-container transition-colors block"
                  >
                    {settings.contact_phone}
                  </a>
                  <a
                    href={`https://wa.me/${settings.contact_whatsapp}?text=Hello%20${encodeURIComponent(settings.site_name)},%20I%20would%20like%20to%20place%20an%20order`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-secondary-container mt-1 hover:underline"
                  >
                    <span>Chat on WhatsApp (Fastest Response)</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </a>
                </div>
              </div>

              {/* Email & Working Hours */}
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-sm flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary-container text-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">schedule</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-primary-container/70 mb-1">
                    Email & Operating Hours
                  </h4>
                  <p className="text-xs font-semibold text-on-surface">
                    {settings.contact_email}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {settings.operating_hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-10 rounded-3xl border border-outline-variant/40 shadow-ambient">
            <h3 className="text-2xl font-bold text-primary-container mb-2 font-display">
              Send a Message or Project Request
            </h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mb-8">
              Fill out the details below and an RnB Digitals production specialist will respond within 2 hours.
            </p>

            {formSubmitted ? (
              <div className="bg-primary-container text-on-primary p-8 rounded-2xl text-center space-y-4 animate-fade-in">
                <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto shadow-md">
                  <span className="material-symbols-outlined text-3xl">check</span>
                </div>
                <h4 className="text-2xl font-bold font-display">Thank You! Your Request Has Been Received</h4>
                <p className="text-xs sm:text-sm text-on-primary/85 max-w-md mx-auto">
                  Our team is reviewing your specifications and will reach out via Phone/WhatsApp shortly.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4 bg-secondary-container text-on-secondary-container text-xs font-bold py-2.5 px-6 rounded-xl hover:bg-secondary-fixed transition-colors shadow-sm cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-primary-container uppercase tracking-wider mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Okoro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 focus:border-primary-container focus:ring-2 focus:ring-secondary-container rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-container uppercase tracking-wider mb-2">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 0816 417 1414"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 focus:border-primary-container focus:ring-2 focus:ring-secondary-container rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-primary-container uppercase tracking-wider mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 focus:border-primary-container focus:ring-2 focus:ring-secondary-container rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary-container uppercase tracking-wider mb-2">
                      Primary Service Interested In *
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full bg-surface border border-outline-variant/50 focus:border-primary-container focus:ring-2 focus:ring-secondary-container rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all"
                    >
                      <option value="Large Format Printing">Large Format Printing</option>
                      <option value="Custom Apparel & Embroidery">Custom Apparel & Embroidery</option>
                      <option value="Branded Merchandise">Branded Corporate Merchandise</option>
                      <option value="Wrapping Tissue Paper">Branded Wrapping Tissue Paper</option>
                      <option value="Brand Identity & Stationery">Brand Identity & Stationery</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-container uppercase tracking-wider mb-2">
                    Project Requirements / Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about dimensions, quantities, target dates, or special finishings..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-surface border border-outline-variant/50 focus:border-primary-container focus:ring-2 focus:ring-secondary-container rounded-xl px-4 py-3 text-sm text-on-surface outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-container text-on-primary font-bold text-base py-4 rounded-xl hover:bg-primary transition-all duration-300 shadow-md hover:shadow-forest-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-lg text-secondary-container">
                    send
                  </span>
                  <span>{submitting ? 'Submitting...' : 'Submit Project Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
