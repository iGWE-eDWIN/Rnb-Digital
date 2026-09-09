'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSiteSettings, getNavigationLinks, DEFAULT_SITE_SETTINGS, DEFAULT_NAVIGATION_LINKS } from '@/lib/cms-data';
import { SiteSettings, NavigationLink } from '@/types/cms';

interface NavbarProps {
  onOpenQuoteModal?: () => void;
  siteSettings?: SiteSettings;
  navigation?: NavigationLink[];
}

export default function Navbar({ onOpenQuoteModal, siteSettings, navigation }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>(siteSettings || DEFAULT_SITE_SETTINGS);
  const [links, setLinks] = useState<NavigationLink[]>(
    navigation || DEFAULT_NAVIGATION_LINKS.filter((l) => l.is_header && l.is_active)
  );

  useEffect(() => {
    async function loadNavData() {
      if (!siteSettings) {
        const s = await getSiteSettings();
        setSettings(s);
      }
      if (!navigation) {
        const n = await getNavigationLinks();
        setLinks(n.filter((l) => l.is_header && l.is_active));
      }
    }
    loadNavData();
  }, [siteSettings, navigation]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-primary/95 backdrop-blur-md shadow-lg border-b border-primary-container'
          : 'bg-primary border-none shadow-sm'
      }`}
    >
      {/* Top micro bar for quick contact */}
      <div className="bg-surface-deep text-on-primary/80 text-xs py-1.5 px-4 sm:px-6 md:px-8 lg:px-10 border-b border-primary-container/40 hidden sm:block w-full">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 truncate max-w-md">
              <span className="material-symbols-outlined text-[15px] text-secondary-container">location_on</span>
              {settings.contact_address.split(',')[0]} by Pepperoni Junction, Port Harcourt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-secondary-container">schedule</span>
              {settings.operating_hours.split('(')[0]}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center gap-1 hover:text-secondary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary-container">call</span>
              {settings.contact_phone}
            </a>
            <span className="text-primary-container">|</span>
            <a
              href={`https://wa.me/${settings.contact_whatsapp}?text=Hello%20${encodeURIComponent(settings.site_name)},%20I%20would%20like%20to%20inquire%20about%20your%20services`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-secondary-container hover:underline font-semibold"
            >
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-3.5 md:py-4 w-full">
        {/* Brand Logo */}
        <Link href="#hero" className="flex items-center gap-2.5 group">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.site_name}
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary-container border border-secondary-container/40 flex items-center justify-center text-secondary-container shadow-md group-hover:scale-105 transition-transform duration-300">
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform duration-300">
                {settings.logo_icon || 'stars'}
              </span>
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold text-secondary-container tracking-tight leading-none font-display">
              {settings.site_name}
            </span>
            <span className="text-[10px] tracking-wider text-primary-fixed uppercase font-semibold mt-0.5">
              {settings.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7">
          {links.map((link, idx) => (
            <a
              key={link.id || idx}
              href={link.href}
              className={`font-medium text-sm tracking-wide transition-colors ${
                link.href === '#hero'
                  ? 'text-secondary-container font-semibold border-b-2 border-secondary-container pb-0.5 px-1 hover:text-secondary-fixed'
                  : 'text-on-primary/85 hover:text-on-primary hover:bg-primary-container/40 px-2 py-1 rounded-sm'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#store"
            className="hidden lg:inline-flex items-center gap-1.5 text-on-primary bg-primary-container hover:bg-primary-container/80 border border-on-primary-container/30 text-xs font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-base text-secondary-container">shopping_bag</span>
            Store Catalog
          </a>

          <button
            onClick={onOpenQuoteModal}
            className="inline-flex items-center gap-1.5 bg-secondary-container text-on-secondary-container font-bold text-xs md:text-sm py-2 md:py-2.5 px-4 md:px-5 rounded-lg hover:bg-secondary-fixed transition-all duration-300 shadow-md hover:shadow-gold-glow hover:-translate-y-0.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">request_quote</span>
            Get Quote
          </button>

          {/* Admin CMS Quick Portal Link (Discreet) */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex p-2 text-on-primary/60 hover:text-secondary-container rounded-lg transition-colors"
            title="Admin CMS Portal"
          >
            <span className="material-symbols-outlined text-lg">admin_panel_settings</span>
          </Link>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-primary p-2 hover:bg-primary-container rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-deep border-t border-primary-container px-margin-mobile py-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-on-primary/90 hover:text-secondary-container font-medium text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </a>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-secondary-container font-bold text-sm py-2 flex items-center justify-between pt-3"
            >
              <span>Admin CMS Portal</span>
              <span className="material-symbols-outlined text-sm">lock</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-primary-container/60 flex flex-col gap-3">
            <a
              href={`tel:${settings.contact_phone.replace(/[^0-9+]/g, '')}`}
              className="flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3 rounded-lg font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-lg text-secondary-container">call</span>
              Call {settings.contact_phone}
            </a>
            <a
              href={`https://wa.me/${settings.contact_whatsapp}?text=Hello%20${encodeURIComponent(settings.site_name)},%20I%20would%20like%20to%20place%20an%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-secondary-container text-on-secondary-container py-3 rounded-lg font-bold text-sm shadow-md"
            >
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
