'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getHeroSlides, DEFAULT_HERO_SLIDES } from '@/lib/cms-data';
import { HeroSlideItem } from '@/types/cms';

interface HeroSlideshowProps {
  onExploreService?: (serviceId: string) => void;
  slides?: HeroSlideItem[];
}

export default function HeroSlideshow({ onExploreService, slides: propSlides }: HeroSlideshowProps) {
  const [slides, setSlides] = useState<HeroSlideItem[]>(propSlides || DEFAULT_HERO_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 4500; // 4.5 seconds per slide
  const PROGRESS_TICK = 50; // Update progress bar every 50ms

  useEffect(() => {
    async function load() {
      if (!propSlides) {
        const loaded = await getHeroSlides();
        const activeOnly = loaded.filter((s) => s.is_active);
        if (activeOnly.length > 0) setSlides(activeOnly);
      }
    }
    load();
  }, [propSlides]);

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Setup auto-cycling timer and progress bar
  useEffect(() => {
    if (slides.length <= 1) return;

    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    progressIntervalRef.current = setInterval(() => {
      setProgress((oldProgress) => {
        const increment = (PROGRESS_TICK / SLIDE_DURATION) * 100;
        return oldProgress + increment;
      });
    }, PROGRESS_TICK);

    timerRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [currentIndex, isPaused, slides.length]);

  const currentSlide = slides[currentIndex] || slides[0] || DEFAULT_HERO_SLIDES[0];

  return (
    <div
      className="relative h-[420px] sm:h-[460px] md:h-[500px] lg:h-[520px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/60 bg-surface-deep group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="RnB Digitals Capability Showcase Slideshow"
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                isActive
                  ? 'opacity-100 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
            >
              {/* Background Slide Image */}
              <img
                src={slide.image_url}
                alt={slide.alt || slide.title}
                className="w-full h-full object-cover object-center transform transition-transform duration-7000 ease-out group-hover:scale-105"
              />

              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-primary/30" />
            </div>
          );
        })}
      </div>

      {/* Top Bar inside Slideshow: Active Tag & Auto-Play Indicator */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
        <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center gap-2 border border-secondary-container/40 shadow-lg pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="text-secondary-container font-bold text-xs tracking-wider uppercase">
            {currentSlide.tag}
          </span>
        </div>

        <div className="glass-panel px-3 py-1.5 rounded-full flex items-center gap-2 text-on-primary/90 text-xs border border-white/10 shadow-lg pointer-events-auto">
          <span className="material-symbols-outlined text-sm text-primary-fixed">
            {isPaused ? 'pause_circle' : 'autoplay'}
          </span>
          <span className="hidden sm:inline text-[11px] font-medium">
            {isPaused ? 'Paused' : 'Auto Playing'}
          </span>
        </div>
      </div>

      {/* Overlay Slide Details Card on Bottom */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-4 md:p-6 bg-gradient-to-t from-surface-deep via-surface-deep/95 to-transparent pt-12">
        <div className="flex flex-col gap-2 max-w-lg">
          <h3 className="text-lg md:text-2xl font-bold text-on-primary tracking-tight line-clamp-1 leading-snug drop-shadow-md">
            {currentSlide.title}
          </h3>
          <p className="text-xs md:text-sm text-on-primary/80 line-clamp-2 leading-relaxed">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Thumbnail Selector & Navigation Controls */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-white/15">
          {/* Slide Indicator Pills */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Jump to slide ${idx + 1}: ${slide.title}`}
                className={`transition-all duration-300 rounded-full cursor-pointer relative overflow-hidden ${
                  idx === currentIndex
                    ? 'w-8 md:w-10 h-2.5 bg-secondary-container shadow-gold-glow'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary-container/80 hover:bg-secondary-container hover:text-on-secondary-container text-on-primary flex items-center justify-center border border-white/20 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-primary-container/80 hover:bg-secondary-container hover:text-on-secondary-container text-on-primary flex items-center justify-center border border-white/20 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Slide Countdown Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-30 overflow-hidden">
        <div
          className="h-full bg-secondary-container transition-all duration-75 ease-linear"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  );
}
