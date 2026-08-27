'use client';

import React from 'react';
import { PRODUCTS_DATA } from '@/data/products';

export default function StorePreview() {
  return (
    <section id="store" className="py-20 md:py-28 bg-surface-container-low relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm text-secondary-container">local_mall</span>
              Merchandise & Print Catalog
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary-container tracking-tight font-display">
              Ready-to-Brand Essentials
            </h2>
            <p className="text-sm md:text-base text-on-surface-variant max-w-xl mt-2">
              Order customized bestsellers with rapid turnaround, precision logo application, and direct delivery.
            </p>
          </div>

          <a
            href="https://wa.me/2348164171414?text=Hello%20RnB%20Digitals,%20please%20send%20me%20your%20complete%20product%20catalog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary-container text-on-primary hover:bg-primary text-xs md:text-sm font-bold py-2.5 px-5 rounded-xl transition-colors shadow-md"
          >
            <span>Request Full PDF Catalog</span>
            <span className="material-symbols-outlined text-sm text-secondary-container">download</span>
          </a>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS_DATA.map((product) => (
            <div
              key={product.id}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-ambient hover:shadow-ambient-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-48 w-full overflow-hidden bg-surface-container">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-secondary-container text-on-secondary-container shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded bg-primary/80 text-on-primary">
                  Min: {product.minOrder}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-container/70 block mb-1">
                    {product.category}
                  </span>
                  <h3 className="text-base font-bold text-primary-container mb-1.5 leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed mb-4">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-on-surface-variant block">From</span>
                    <span className="text-base font-bold text-primary-container">
                      {product.priceFormatted}
                    </span>
                  </div>

                  <a
                    href={`https://wa.me/2348164171414?text=Hello%20RnB%20Digitals,%20I%20want%20to%20order%20the%20${encodeURIComponent(
                      product.name
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container text-xs font-bold py-2 px-3 rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <span>Order Now</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
