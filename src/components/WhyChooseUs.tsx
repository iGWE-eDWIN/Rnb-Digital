'use client';

import React, { useState, useEffect } from 'react';
import { getAboutPillars, getSiteStats, DEFAULT_ABOUT_PILLARS, DEFAULT_SITE_STATS } from '@/lib/cms-data';
import { AboutPillar, SiteStat } from '@/types/cms';

interface WhyChooseUsProps {
  pillars?: AboutPillar[];
  stats?: SiteStat[];
}

export default function WhyChooseUs({ pillars: propPillars, stats: propStats }: WhyChooseUsProps) {
  const [pillars, setPillars] = useState<AboutPillar[]>(propPillars || DEFAULT_ABOUT_PILLARS);
  const [stats, setStats] = useState<SiteStat[]>(propStats || DEFAULT_SITE_STATS);

  useEffect(() => {
    async function load() {
      if (!propPillars) {
        const loadedPillars = await getAboutPillars();
        if (loadedPillars && loadedPillars.length > 0) {
          setPillars(loadedPillars.filter((p) => p.is_active));
        }
      }
      if (!propStats) {
        const loadedStats = await getSiteStats();
        if (loadedStats && loadedStats.length > 0) {
          setStats(loadedStats.filter((s) => s.is_active));
        }
      }
    }
    load();
  }, [propPillars, propStats]);

  return (
    <section id="about" className="py-20 md:py-32 bg-primary-container text-on-primary relative overflow-hidden">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-deep border border-white/10 text-secondary-container text-xs font-bold uppercase tracking-wider mb-4">
            <span className="material-symbols-outlined text-sm text-secondary-container">diamond</span>
            The RnB Digitals Standard
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-primary tracking-tight mb-4 font-display">
            Why Nigeria’s Top Brands Choose RnB Digitals
          </h2>
          <p className="text-base md:text-lg text-on-primary/80 leading-relaxed">
            From emerging startups to established multinationals, we combine creative excellence with industrial manufacturing speed.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              className="bg-surface-deep/70 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-secondary-container/50 transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-secondary-container mb-5 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-2xl">{pillar.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-primary mb-2 group-hover:text-secondary-container transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-on-primary/75 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Counter Bar */}
        <div className="bg-primary/80 border border-white/15 rounded-2xl p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
          {stats.map((stat) => (
            <div key={stat.id}>
              <div className="text-3xl md:text-5xl font-extrabold text-secondary-container font-display">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-on-primary/80 mt-1 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-fixed/10 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
