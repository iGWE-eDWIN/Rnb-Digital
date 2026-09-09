'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSlideshow from '@/components/HeroSlideshow';
import ServicesGrid from '@/components/ServicesGrid';
import QuoteCalculator from '@/components/QuoteCalculator';
import PortfolioGallery from '@/components/PortfolioGallery';
import StorePreview from '@/components/StorePreview';
import WhyChooseUs from '@/components/WhyChooseUs';
import Testimonials from '@/components/Testimonials';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/cms-data';
import { SiteSettings } from '@/types/cms';

export default function Home() {
  const [activeQuoteService, setActiveQuoteService] = useState<string>('Large Format Printing');
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    async function loadSettings() {
      const s = await getSiteSettings();
      if (s) setSettings(s);
    }
    loadSettings();
  }, []);

  const handleOpenQuote = (serviceName?: string) => {
    if (serviceName) {
      setActiveQuoteService(serviceName);
    }
    const calc = document.getElementById('calculator');
    if (calc) {
      calc.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface text-on-surface">
      {/* Navigation Bar */}
      <Navbar onOpenQuoteModal={() => handleOpenQuote()} siteSettings={settings} />

      <main className="flex-grow">
        {/* ===================== HERO SECTION ===================== */}
        <section
          id="hero"
          className="relative bg-primary-container pt-10 pb-28 md:pt-18 md:pb-44 overflow-hidden rounded-b-[2.5rem] md:rounded-b-[4.5rem] shadow-xl"
        >
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center relative z-10">
            {/* Left Column: Hero Text Content */}
            <div className="flex flex-col items-start gap-6 max-w-2xl lg:max-w-3xl text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge border border-secondary-container/30 text-secondary-container text-xs font-bold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary-container animate-ping" />
                <span>{settings.announcement_badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-extrabold text-on-primary text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] font-display">
                {settings.hero_title.includes('Deserves') ? (
                  <>
                    Your Brand <br />
                    Deserves <br />
                    <span className="text-secondary-container drop-shadow-sm">
                      {settings.hero_subtitle || 'to Be Seen'}
                    </span>
                  </>
                ) : (
                  <>
                    {settings.hero_title} <br />
                    <span className="text-secondary-container drop-shadow-sm">
                      {settings.hero_subtitle}
                    </span>
                  </>
                )}
              </h1>

              {/* Supporting Copy */}
              <p className="text-on-primary/90 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
                {settings.hero_description}
              </p>

              {/* Dual Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-2 w-full sm:w-auto">
                <a
                  href={settings.hero_cta1_link || '#calculator'}
                  className="w-full sm:w-auto bg-secondary-container text-on-secondary-container font-extrabold text-sm sm:text-base py-3.5 px-8 rounded-xl hover:bg-secondary-fixed transition-all duration-300 shadow-md hover:shadow-gold-glow hover:-translate-y-1 flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">calculate</span>
                  <span>{settings.hero_cta1_text || 'Get Instant Quote'}</span>
                </a>
                <a
                  href={settings.hero_cta2_link || '#portfolio'}
                  className="w-full sm:w-auto bg-transparent border-2 border-on-primary text-on-primary font-bold text-sm sm:text-base py-3.5 px-8 rounded-xl hover:bg-on-primary/10 transition-all duration-300 flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">grid_view</span>
                  <span>{settings.hero_cta2_text || 'View Portfolio'}</span>
                </a>
              </div>

              {/* Trust Metrics Pill Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-on-primary/80 border-t border-white/15 w-full">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-base">verified</span>
                  <span>Industrial Precision</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-base">bolt</span>
                  <span>24-48h Rush Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container text-base">local_shipping</span>
                  <span>Nationwide Courier</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Automated Slideshow / Carousel */}
            <div className="w-full relative">
              <HeroSlideshow onExploreService={(svc) => handleOpenQuote(svc)} />
            </div>
          </div>

          {/* Abstract background decorative ambient lighting */}
          <div className="absolute -bottom-28 -right-28 w-96 h-96 bg-primary-fixed/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-12 -left-16 w-72 h-72 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />
        </section>

        {/* ===================== SERVICES SECTION ===================== */}
        <ServicesGrid onSelectServiceForQuote={(title) => setActiveQuoteService(title)} />

        {/* ===================== INSTANT ESTIMATOR SECTION ===================== */}
        <QuoteCalculator initialService={activeQuoteService} />

        {/* ===================== PORTFOLIO SHOWCASE ===================== */}
        <PortfolioGallery />

        {/* ===================== STORE / CATALOG PREVIEW ===================== */}
        <StorePreview />

        {/* ===================== WHY CHOOSE US ===================== */}
        <WhyChooseUs />

        {/* ===================== TESTIMONIALS ===================== */}
        <Testimonials />

        {/* ===================== CONTACT & WORKSHOP LOCATION ===================== */}
        <ContactSection settings={settings} />
      </main>

      {/* Footer */}
      <Footer settings={settings} />
    </div>
  );
}
