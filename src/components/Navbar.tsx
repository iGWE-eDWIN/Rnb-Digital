'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavbarProps {
  onOpenQuoteModal?: () => void;
}

export default function Navbar({ onOpenQuoteModal }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-secondary-container">location_on</span>
              177 Ada George by Pepperoni Junction, Port Harcourt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[15px] text-secondary-container">schedule</span>
              Mon - Sat: 8:00 AM - 6:00 PM
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="tel:+2348164171414"
              className="flex items-center gap-1 hover:text-secondary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[15px] text-secondary-container">call</span>
              +234 816 417 1414
            </a>
            <span className="text-primary-container">|</span>
            <a
              href="https://wa.me/2348164171414?text=Hello%20RnB%20Digitals,%20I%20would%20like%20to%20inquire%20about%20your%20services"
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
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-primary-container border border-secondary-container/40 flex items-center justify-center text-secondary-container shadow-md group-hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform duration-300">
              stars
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold text-secondary-container tracking-tight leading-none font-display">
              RnB Digitals
            </span>
            <span className="text-[10px] tracking-wider text-primary-fixed uppercase font-semibold mt-0.5">
              Premium Print & Branding
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#hero"
            className="text-secondary-container font-semibold text-sm tracking-wide border-b-2 border-secondary-container pb-0.5 px-1 hover:text-secondary-fixed transition-colors"
          >
            Home
          </a>
          <a
            href="#services"
            className="text-on-primary/85 hover:text-on-primary font-medium text-sm tracking-wide hover:bg-primary-container/40 duration-200 px-2 py-1 rounded-sm transition-colors"
          >
            Services
          </a>
          <a
            href="#portfolio"
            className="text-on-primary/85 hover:text-on-primary font-medium text-sm tracking-wide hover:bg-primary-container/40 duration-200 px-2 py-1 rounded-sm transition-colors"
          >
            Portfolio
          </a>
          <a
            href="#store"
            className="text-on-primary/85 hover:text-on-primary font-medium text-sm tracking-wide hover:bg-primary-container/40 duration-200 px-2 py-1 rounded-sm transition-colors"
          >
            Store
          </a>
          <a
            href="#calculator"
            className="text-on-primary/85 hover:text-on-primary font-medium text-sm tracking-wide hover:bg-primary-container/40 duration-200 px-2 py-1 rounded-sm transition-colors"
          >
            Estimator
          </a>
          <a
            href="#about"
            className="text-on-primary/85 hover:text-on-primary font-medium text-sm tracking-wide hover:bg-primary-container/40 duration-200 px-2 py-1 rounded-sm transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="text-on-primary/85 hover:text-on-primary font-medium text-sm tracking-wide hover:bg-primary-container/40 duration-200 px-2 py-1 rounded-sm transition-colors"
          >
            Contact
          </a>
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
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="text-secondary-container font-semibold text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
            >
              <span>Home</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-primary/90 hover:text-on-primary font-medium text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
            >
              <span>Services</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
            <a
              href="#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-primary/90 hover:text-on-primary font-medium text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
            >
              <span>Portfolio</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
            <a
              href="#store"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-primary/90 hover:text-on-primary font-medium text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
            >
              <span>Product Catalog</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-primary/90 hover:text-on-primary font-medium text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
            >
              <span>Instant Price Estimator</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-primary/90 hover:text-on-primary font-medium text-base py-2 border-b border-primary-container/50 flex items-center justify-between"
            >
              <span>About Us</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-on-primary/90 hover:text-on-primary font-medium text-base py-2 flex items-center justify-between"
            >
              <span>Contact & Location</span>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </a>
          </nav>

          <div className="pt-4 border-t border-primary-container/60 flex flex-col gap-3">
            <a
              href="tel:+2348164171414"
              className="flex items-center justify-center gap-2 bg-primary-container text-on-primary py-3 rounded-lg font-semibold text-sm"
            >
              <span className="material-symbols-outlined text-lg text-secondary-container">call</span>
              Call +234 816 417 1414
            </a>
            <a
              href="https://wa.me/2348164171414?text=Hello%20RnB%20Digitals,%20I%20would%20like%20to%20place%20an%20order"
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
