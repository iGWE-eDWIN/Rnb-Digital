'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteSettings, getNavigationLinks, DEFAULT_SITE_SETTINGS, DEFAULT_NAVIGATION_LINKS } from '@/lib/cms-data';
import { SiteSettings, NavigationLink } from '@/types/cms';
import { LOGO_IMAGE_SRC } from '@/lib/logo-base64';

interface FooterProps {
  settings?: SiteSettings;
  navigationLinks?: NavigationLink[];
}

export default function Footer({ settings: propSettings, navigationLinks: propNav }: FooterProps) {
  const [settings, setSettings] = useState<SiteSettings>(propSettings || DEFAULT_SITE_SETTINGS);
  const [navLinks, setNavLinks] = useState<NavigationLink[]>(
    propNav || DEFAULT_NAVIGATION_LINKS.filter((l) => l.is_footer && l.is_active)
  );
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function load() {
      if (!propSettings) {
        const loaded = await getSiteSettings();
        if (loaded) setSettings(loaded);
      }
      if (!propNav) {
        const loadedNav = await getNavigationLinks();
        if (loadedNav) setNavLinks(loadedNav.filter((l) => l.is_footer && l.is_active));
      }
    }
    load();
  }, [propSettings, propNav]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-surface-deep text-on-primary border-t border-outline-variant/20">
      {/* Top Footer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 px-4 sm:px-6 md:px-8 lg:px-10 py-16 w-full">
        {/* Brand Column */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link href="#hero" className="flex items-center group py-0.5">
            <img
              src={(settings.logo_url && settings.logo_url.startsWith('http')) ? settings.logo_url : LOGO_IMAGE_SRC}
              alt={settings.site_name || 'RnB Digitals'}
              className="h-10 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <p className="text-sm text-on-primary/80 leading-relaxed max-w-sm">
            {settings.footer_description}
          </p>
          <div className="text-xs text-on-primary/70 pt-2 flex flex-col gap-1">
            <span className="flex items-center gap-1.5 text-secondary-container font-semibold">
              <span className="material-symbols-outlined text-sm">location_on</span>
              {settings.contact_address.split(',')[0]}, Port Harcourt, Rivers State
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-secondary-container">call</span>
              {settings.contact_phone} • {settings.contact_email}
            </span>
          </div>
        </div>

        {/* Services Links */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-on-primary uppercase tracking-wider mb-1 text-secondary-container">
            Core Services
          </h4>
          <a href="#services" className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors">
            Large Format Printing
          </a>
          <a href="#services" className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors">
            Custom Apparel & Embroidery
          </a>
          <a href="#services" className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors">
            Branded Merchandise
          </a>
          <a href="#services" className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors">
            Wrapping Tissue & Packaging
          </a>
          <a href="#services" className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors">
            Brand Identity & Stationery
          </a>
          <a href="#services" className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors">
            Web & Digital Solutions
          </a>
        </div>

        {/* Quick Links from Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-on-primary uppercase tracking-wider mb-1 text-secondary-container">
            Quick Navigation
          </h4>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="text-xs sm:text-sm text-on-primary/70 hover:text-secondary-container transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Newsletter & Direct Order */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-sm text-on-primary uppercase tracking-wider mb-1 text-secondary-container">
            Stay Connected
          </h4>
          <p className="text-xs text-on-primary/70 leading-relaxed">
            Subscribe for seasonal discounts, bulk print offers, and branding insights.
          </p>

          {subscribed ? (
            <div className="bg-primary-container text-secondary-container p-3 rounded-lg text-xs font-bold text-center border border-secondary-container/30">
              ✓ Subscribed Successfully!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-surface-container-highest/15 border border-white/10 text-on-primary placeholder:text-on-primary/40 focus:ring-2 focus:ring-secondary-container rounded-l-xl px-3 py-2.5 w-full text-xs outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="bg-secondary-container text-on-secondary-container px-4 py-2.5 rounded-r-xl hover:bg-secondary-fixed transition-colors flex items-center justify-center font-bold"
              >
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>
          )}

          <div className="pt-2">
            <a
              href={`https://wa.me/${settings.contact_whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-secondary-container font-semibold hover:underline"
            >
              <span>Instant WhatsApp Inquiry</span>
              <span className="material-symbols-outlined text-xs">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-white/10 px-margin-mobile md:px-margin-desktop py-6">
        <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left text-xs text-on-primary/60">
          <div>
            {settings.footer_copyright}
          </div>
          <div className="flex items-center gap-6">
            <span>Port Harcourt • Lagos • Abuja • Nationwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
