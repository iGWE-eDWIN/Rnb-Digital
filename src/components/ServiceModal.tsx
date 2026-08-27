'use client';

import React from 'react';
import { ServiceItem } from '@/types';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectForQuote: (serviceTitle: string) => void;
}

export default function ServiceModal({ service, onClose, onSelectForQuote }: ServiceModalProps) {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/40"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header Banner */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-t-2xl bg-primary-container">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/40 to-transparent" />
          
          <button
            onClick={onClose}
            aria-label="Close Modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary/70 hover:bg-secondary-container hover:text-on-secondary-container text-on-primary flex items-center justify-center transition-colors shadow-md z-10"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-secondary-container text-on-secondary-container shadow-sm inline-block mb-2">
                {service.popularFor}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-primary font-display">
                {service.title}
              </h2>
            </div>
            {service.startingPrice && (
              <div className="text-right hidden sm:block">
                <span className="text-[11px] text-on-primary/70 block uppercase font-medium">Starting from</span>
                <span className="text-xl font-bold text-secondary-container">{service.startingPrice}</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-container mb-2">Overview</h4>
            <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed">
              {service.fullDesc}
            </p>
          </div>

          {/* Capabilities / Deliverables */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary-container mb-3">Key Features & Capabilities</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-on-surface bg-surface-container-low p-2.5 rounded-lg">
                  <span className="material-symbols-outlined text-secondary-container text-lg shrink-0 mt-0.5">check_circle</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          {service.materials && service.materials.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary-container mb-2">Available Materials & Options</h4>
              <div className="flex flex-wrap gap-2">
                {service.materials.map((mat, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary-container/10 text-primary-container border border-primary-container/20"
                  >
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 border-t border-outline-variant/30 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="text-xs text-on-surface-variant text-center sm:text-left">
              Fast production in Port Harcourt & nationwide shipping across Nigeria.
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  onSelectForQuote(service.title);
                  onClose();
                }}
                className="w-full sm:w-auto bg-secondary-container text-on-secondary-container font-bold text-sm py-2.5 px-6 rounded-lg hover:bg-secondary-fixed transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">calculate</span>
                Calculate Price / Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
