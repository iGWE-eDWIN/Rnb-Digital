'use client';

import React, { useState, useEffect } from 'react';
import { getServices } from '@/lib/cms-data';
import { SERVICES_DATA } from '@/data/services';
import { ServiceItem } from '@/types';
import ServiceModal from './ServiceModal';

interface ServicesGridProps {
  onSelectServiceForQuote?: (serviceTitle: string) => void;
  services?: ServiceItem[];
}

export default function ServicesGrid({ onSelectServiceForQuote, services: propServices }: ServicesGridProps) {
  const [services, setServices] = useState<ServiceItem[]>(propServices || SERVICES_DATA);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  useEffect(() => {
    async function load() {
      if (!propServices) {
        const loaded = await getServices();
        if (loaded && loaded.length > 0) {
          setServices(loaded);
        }
      }
    }
    load();
  }, [propServices]);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'printer':
        return 'print';
      case 'shirt':
        return 'apparel';
      case 'gift':
        return 'featured_seasonal_and_gifts';
      case 'package':
        return 'inventory_2';
      case 'palette':
        return 'brush';
      case 'globe':
        return 'devices';
      default:
        return 'design_services';
    }
  };

  return (
    <section id="services" className="py-20 md:py-32 bg-surface relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm text-secondary-container">stars</span>
            What We Do
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-container tracking-tight mb-5 font-display">
            Print, Design & Branding Solutions
          </h2>
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            We bring your brand to life with high-grade industrial materials, flawless precision execution, and state-of-the-art digital technology.
          </p>
        </div>

        {/* Services Grid (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-ambient hover:shadow-ambient-hover transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1.5"
            >
              <div>
                {/* Icon & Category Tag */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-primary-container text-secondary-container rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all duration-300 shadow-md">
                    <span className="material-symbols-outlined text-3xl">
                      {getServiceIcon(service.iconName)}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-container text-primary-container">
                    {service.category}
                  </span>
                </div>

                {/* Title & Short Description */}
                <h3 className="text-xl md:text-2xl font-bold text-primary-container mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-on-surface-variant mb-6 leading-relaxed line-clamp-3">
                  {service.shortDesc}
                </p>

                {/* Features Snippet */}
                <div className="space-y-2 mb-6 pt-4 border-t border-outline-variant/20">
                  {service.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-on-surface/90">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary-container shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between">
                <button
                  onClick={() => setSelectedService(service)}
                  className="inline-flex items-center gap-1.5 text-primary-container font-semibold text-xs tracking-wide hover:text-secondary-container transition-colors group/link cursor-pointer"
                >
                  <span>Explore Specs</span>
                  <span className="material-symbols-outlined text-sm group-hover/link:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>

                {service.startingPrice && (
                  <span className="text-xs font-bold text-primary-container bg-primary-container/5 px-2.5 py-1 rounded-full">
                    From {service.startingPrice}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner callout */}
        <div className="mt-16 bg-primary-container rounded-2xl p-8 md:p-10 text-on-primary flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold mb-2 font-display">
              Have a Custom Project or Urgent Delivery?
            </h3>
            <p className="text-sm md:text-base text-on-primary/80">
              Our workshop in Port Harcourt is equipped for rapid bulk runs, custom dimensions, and same-day turnaround.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/2348164171414?text=Hello%20RnB%20Digitals,%20I%20have%20an%20urgent%20print%20project"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-secondary-container text-on-secondary-container font-bold text-sm py-3 px-6 rounded-xl hover:bg-secondary-fixed transition-all duration-300 shadow-md hover:shadow-gold-glow flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              Chat with Our Team
            </a>
            <a
              href="#calculator"
              className="bg-transparent border-2 border-on-primary text-on-primary font-bold text-sm py-3 px-6 rounded-xl hover:bg-on-primary/10 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">calculate</span>
              Try Price Estimator
            </a>
          </div>

          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSelectForQuote={(title) => {
          if (onSelectServiceForQuote) {
            onSelectServiceForQuote(title);
          }
          const calc = document.getElementById('calculator');
          if (calc) calc.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </section>
  );
}
