'use client';

import React, { useState, useEffect } from 'react';
import { getPortfolioItems } from '@/lib/cms-data';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { PortfolioItem } from '@/types';

interface PortfolioGalleryProps {
  items?: PortfolioItem[];
}

export default function PortfolioGallery({ items: propItems }: PortfolioGalleryProps) {
  const [items, setItems] = useState<PortfolioItem[]>(propItems || PORTFOLIO_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    async function load() {
      if (!propItems) {
        const loaded = await getPortfolioItems();
        if (loaded && loaded.length > 0) {
          setItems(loaded);
        }
      }
    }
    load();
  }, [propItems]);

  const categories = [
    { id: 'all', label: 'All Works' },
    { id: 'print', label: 'Large Format & Signs' },
    { id: 'apparel', label: 'Apparel & Uniforms' },
    { id: 'branding', label: 'Branding & Packaging' },
    { id: 'digital', label: 'Web & Digital' },
  ];

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-20 md:py-32 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-wider mb-3">
              <span className="material-symbols-outlined text-sm text-secondary-container">visibility</span>
              Recent Case Studies
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-primary-container tracking-tight font-display">
              Proof of Craftsmanship
            </h2>
            <p className="text-base text-on-surface-variant max-w-xl mt-3">
              Explore a curated selection of physical prints, executive corporate apparel, luxury packaging, and digital solutions delivered for leading brands.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-secondary-container shadow-md'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Portfolio Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-surface-container-lowest rounded-2xl overflow-hidden border border-outline-variant/30 shadow-ambient hover:shadow-ambient-hover transition-all duration-300 group cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative h-60 w-full overflow-hidden bg-surface-deep">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-container/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs font-bold text-secondary-container bg-primary/90 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">fullscreen</span>
                    View Project Details
                  </span>
                </div>
                <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-surface-deep/90 text-secondary-container border border-secondary-container/30">
                  {item.categoryLabel}
                </span>
              </div>

              {/* Text Meta */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-primary-container/70 uppercase tracking-wider mb-1">
                    Client: {item.client}
                  </div>
                  <h3 className="text-lg font-bold text-primary-container mb-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-outline-variant/20">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-surface-container text-on-surface-variant"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Item Detail Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/80 backdrop-blur-md animate-fade-in">
          <div className="relative bg-surface-container-lowest text-on-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/40">
            <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-t-2xl bg-surface-deep">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-primary/80 hover:bg-secondary-container hover:text-on-secondary-container text-on-primary flex items-center justify-center transition-colors shadow-md"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-primary-container text-secondary-container">
                  {selectedItem.categoryLabel}
                </span>
                <span className="text-xs font-medium text-on-surface-variant">
                  Client: <strong className="text-primary-container">{selectedItem.client}</strong>
                </span>
              </div>
              <h3 className="text-2xl font-bold text-primary-container font-display">
                {selectedItem.title}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {selectedItem.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-surface-container text-primary-container"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="pt-4 border-t border-outline-variant/30 flex justify-end">
                <a
                  href={`https://wa.me/2348164171414?text=Hello%20RnB%20Digitals,%20I%20saw%20your%20portfolio%20project:%20${encodeURIComponent(
                    selectedItem.title
                  )}%20and%20would%20like%20a%20similar%20service`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-secondary-container text-on-secondary-container font-bold text-sm py-2.5 px-6 rounded-lg hover:bg-secondary-fixed transition-colors shadow-md flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Request Similar Project
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
