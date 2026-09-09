'use client';

import React, { useState, useEffect } from 'react';
import { getTestimonials } from '@/lib/cms-data';
import { TESTIMONIALS_DATA } from '@/data/testimonials';
import { TestimonialItem } from '@/types';

interface TestimonialsProps {
  testimonials?: TestimonialItem[];
}

export default function Testimonials({ testimonials: propTestimonials }: TestimonialsProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    propTestimonials || TESTIMONIALS_DATA
  );

  useEffect(() => {
    async function load() {
      if (!propTestimonials) {
        const loaded = await getTestimonials();
        if (loaded && loaded.length > 0) {
          setTestimonials(loaded);
        }
      }
    }
    load();
  }, [propTestimonials]);

  return (
    <section className="py-20 md:py-28 bg-surface relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm text-secondary-container">sentiment_very_satisfied</span>
            Client Feedback
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary-container tracking-tight font-display mb-3">
            Trusted by Leaders & Creators
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Here is what our clients say about our printing precision, apparel quality, and customer service.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-ambient hover:shadow-ambient-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Rating Stars & Project tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-secondary-container">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-lg fill-current">
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-surface-container text-primary-container">
                    {t.projectType}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/20">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-secondary-container"
                />
                <div>
                  <h4 className="text-sm font-bold text-primary-container">{t.name}</h4>
                  <p className="text-[11px] text-on-surface-variant font-medium">
                    {t.role}, <span className="text-primary-container">{t.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
