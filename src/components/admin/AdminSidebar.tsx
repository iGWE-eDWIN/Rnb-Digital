'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOGO_IMAGE_SRC } from '@/lib/logo-base64';

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: 'dashboard' },
  { label: 'Header & Logo', href: '/admin/settings', icon: 'web' },
  { label: 'Hero & Slideshow', href: '/admin/hero', icon: 'view_carousel' },
  { label: 'Services', href: '/admin/services', icon: 'home_repair_service' },
  { label: 'Price Estimator', href: '/admin/estimator', icon: 'calculate', badge: 'Core' },
  { label: 'Portfolio & Projects', href: '/admin/portfolio', icon: 'photo_library' },
  { label: 'Store Catalog', href: '/admin/store', icon: 'shopping_bag' },
  { label: 'About & Pillars', href: '/admin/about', icon: 'info' },
  { label: 'Testimonials', href: '/admin/testimonials', icon: 'reviews' },
  { label: 'Contact & Inquiries', href: '/admin/contact', icon: 'mail' },
  { label: 'Footer Management', href: '/admin/footer', icon: 'dock' },
  { label: 'Media Library', href: '/admin/media', icon: 'perm_media' },
];

export default function AdminSidebar({ isOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-primary text-on-primary border-r border-primary-container/60 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-primary-container/40">
            <Link href="/admin" className="flex items-center group">
              <img
                src={LOGO_IMAGE_SRC}
                alt="RnB Digitals"
                className="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </Link>

            <button
              type="button"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-on-primary/70 hover:text-on-primary rounded-lg"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            <div className="px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-on-primary/50">
              Content Management
            </div>

            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-bold shadow-md'
                      : 'text-on-primary/80 hover:bg-primary-container/50 hover:text-on-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`material-symbols-outlined text-lg ${
                        isActive ? 'text-on-secondary-container' : 'text-secondary-container'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-primary text-secondary-container'
                          : 'bg-secondary-container/20 text-secondary-container'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Links */}
        <div className="p-4 border-t border-primary-container/40 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-primary-container hover:bg-primary-container/80 text-on-primary text-xs font-bold transition-all border border-white/10"
          >
            <span className="material-symbols-outlined text-sm text-secondary-container">
              open_in_new
            </span>
            <span>View Live Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
