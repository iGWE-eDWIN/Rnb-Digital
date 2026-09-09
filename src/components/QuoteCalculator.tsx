'use client';

import React, { useState, useEffect } from 'react';
import { getEstimatorCategories, submitInquiry, DEFAULT_ESTIMATOR_CATEGORIES } from '@/lib/cms-data';
import { EstimatorCategory } from '@/types/cms';

interface QuoteCalculatorProps {
  initialService?: string;
  categories?: EstimatorCategory[];
}

export default function QuoteCalculator({ initialService, categories: propCategories }: QuoteCalculatorProps) {
  const [categories, setCategories] = useState<EstimatorCategory[]>(
    propCategories || DEFAULT_ESTIMATOR_CATEGORIES
  );
  const [selectedCatId, setSelectedCatId] = useState<string>(
    propCategories?.[0]?.id || DEFAULT_ESTIMATOR_CATEGORIES[0].id
  );

  const [quantity, setQuantity] = useState<number>(24);
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [inquirySaved, setInquirySaved] = useState(false);

  // Load latest configuration from Supabase / CMS
  useEffect(() => {
    async function load() {
      if (!propCategories) {
        const loaded = await getEstimatorCategories();
        if (loaded && loaded.length > 0) {
          setCategories(loaded);
          // If initialService provided, try to match by name or slug
          if (initialService) {
            const matched = loaded.find(
              (c) =>
                c.name.toLowerCase() === initialService.toLowerCase() ||
                c.slug.toLowerCase() === initialService.toLowerCase()
            );
            if (matched) {
              setSelectedCatId(matched.id);
              setQuantity(matched.min_qty || 1);
              const defaultOpts = (matched.options || [])
                .filter((o) => o.is_default && o.is_active)
                .map((o) => o.id);
              setSelectedOptionIds(defaultOpts.length > 0 ? defaultOpts : (matched.options?.[0] ? [matched.options[0].id] : []));
              return;
            }
          }
          if (!selectedCatId || !loaded.some((c) => c.id === selectedCatId)) {
            setSelectedCatId(loaded[0].id);
            setQuantity(loaded[0].min_qty || 1);
            const defaultOpts = (loaded[0].options || [])
              .filter((o) => o.is_default && o.is_active)
              .map((o) => o.id);
            setSelectedOptionIds(defaultOpts.length > 0 ? defaultOpts : (loaded[0].options?.[0] ? [loaded[0].options[0].id] : []));
          }
        }
      }
    }
    load();
  }, [propCategories, initialService]);

  // Synchronize when initialService prop changes
  useEffect(() => {
    if (initialService && categories.length > 0) {
      const matched = categories.find(
        (c) =>
          c.name.toLowerCase() === initialService.toLowerCase() ||
          c.slug.toLowerCase() === initialService.toLowerCase()
      );
      if (matched) {
        setSelectedCatId(matched.id);
        setQuantity(matched.min_qty || 1);
        const defaultOpts = (matched.options || [])
          .filter((o) => o.is_default && o.is_active)
          .map((o) => o.id);
        setSelectedOptionIds(defaultOpts.length > 0 ? defaultOpts : (matched.options?.[0] ? [matched.options[0].id] : []));
      }
    }
  }, [initialService, categories]);

  const activeCategory =
    categories.find((c) => c.id === selectedCatId) || categories[0] || DEFAULT_ESTIMATOR_CATEGORIES[0];

  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const newCat = categories.find((c) => c.id === catId);
    if (newCat) {
      setQuantity(newCat.min_qty || 1);
      const defaultOpts = (newCat.options || [])
        .filter((o) => o.is_default && o.is_active)
        .map((o) => o.id);
      setSelectedOptionIds(defaultOpts.length > 0 ? defaultOpts : (newCat.options?.[0] ? [newCat.options[0].id] : []));
    }
  };

  const toggleOption = (optId: string) => {
    if (selectedOptionIds.includes(optId)) {
      if (selectedOptionIds.length > 1) {
        setSelectedOptionIds(selectedOptionIds.filter((id) => id !== optId));
      }
    } else {
      setSelectedOptionIds([...selectedOptionIds, optId]);
    }
  };

  // Dynamic price calculation
  const availableOptions = (activeCategory.options || []).filter((o) => o.is_active);
  const optionsExtraTotal = selectedOptionIds.reduce((sum, optId) => {
    const opt = availableOptions.find((o) => o.id === optId);
    return sum + (opt ? Number(opt.extra_price) : 0);
  }, 0);

  const baseRate = Number(activeCategory.base_rate) || 0;
  const estimatedTotal = (baseRate + optionsExtraTotal) * quantity;
  const formattedTotal = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(estimatedTotal);

  const getWhatsAppMessage = () => {
    const selectedOptionNames = selectedOptionIds
      .map((id) => availableOptions.find((o) => o.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const text = `Hello RnB Digitals! I used your online estimator for:
- Service: ${activeCategory.name}
- Quantity: ${quantity} ${activeCategory.unit_label}
- Specifications: ${selectedOptionNames || 'Standard'}
- Estimated Total: ${formattedTotal}
${customerName ? `- Name: ${customerName}` : ''}
${customerPhone ? `- Phone: ${customerPhone}` : ''}

Please let me know how to proceed with placing this order.`;

    return encodeURIComponent(text);
  };

  const handleRecordInquiry = async () => {
    try {
      const selectedOptionNames = selectedOptionIds
        .map((id) => availableOptions.find((o) => o.id === id)?.name)
        .filter(Boolean)
        .join(', ');

      await submitInquiry({
        name: customerName || 'Website Estimator Visitor',
        phone: customerPhone || '+234 816 417 1414',
        service: activeCategory.name,
        quantity: `${quantity} ${activeCategory.unit_label}`,
        estimated_total: formattedTotal,
        message: `Specifications: ${selectedOptionNames || 'Standard'}`,
      });
      setInquirySaved(true);
    } catch (e) {
      console.warn('Inquiry record warning:', e);
    }
  };

  return (
    <section id="calculator" className="py-20 md:py-28 bg-surface-container-lowest border-y border-outline-variant/30 relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-on-secondary-container text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm text-secondary-container">calculate</span>
            Transparent Pricing
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary-container tracking-tight mb-4 font-display">
            Instant Project Price Estimator
          </h2>
          <p className="text-sm md:text-base text-on-surface-variant">
            Select your service, choose options, and get an immediate estimate for your print or branding project.
          </p>
        </div>

        {/* Estimator Container */}
        <div className="max-w-5xl lg:max-w-6xl mx-auto bg-surface p-6 md:p-10 rounded-2xl md:rounded-3xl border border-outline-variant/40 shadow-ambient">
          {/* Service Selector Tabs */}
          <div className="mb-8">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-3">
              1. Select Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const isSelected = selectedCatId === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`text-left p-3 rounded-xl border text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-primary-container text-on-primary border-primary-container shadow-md'
                        : 'bg-surface-container-lowest text-on-surface border-outline-variant/40 hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isSelected ? 'bg-secondary-container' : 'bg-outline'
                        }`}
                      />
                      <span className="truncate">{cat.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Options & Quantity Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-outline-variant/30">
            {/* Left Column: Custom Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-3">
                2. Choose Specifications & Finishing
              </label>
              <div className="space-y-2.5">
                {availableOptions.map((opt) => {
                  const isChecked = selectedOptionIds.includes(opt.id);
                  return (
                    <label
                      key={opt.id}
                      onClick={() => toggleOption(opt.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-secondary-container/15 border-secondary-container/60 font-semibold text-primary-container'
                          : 'bg-surface-container-lowest border-outline-variant/30 text-on-surface hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="rounded text-primary-container focus:ring-secondary-container"
                        />
                        <span>{opt.name}</span>
                      </div>
                      {Number(opt.extra_price) > 0 && (
                        <span className="text-[11px] font-bold text-primary-container bg-surface-container px-2 py-0.5 rounded">
                          +₦{Number(opt.extra_price).toLocaleString()}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Quantity & Instant Summary */}
            <div className="flex flex-col justify-between bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/40">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-primary-container mb-2">
                  3. Quantity ({activeCategory.unit_label})
                </label>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(activeCategory.min_qty || 1, quantity - (activeCategory.slug === 'banner' ? 10 : 5))
                      )
                    }
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container font-bold text-lg flex items-center justify-center border border-outline-variant/30 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={activeCategory.min_qty || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center font-bold text-lg py-2 border rounded-lg bg-surface border-outline-variant/50 focus:ring-2 focus:ring-secondary-container"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(quantity + (activeCategory.slug === 'banner' ? 10 : 5))
                    }
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container font-bold text-lg flex items-center justify-center border border-outline-variant/30 cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-on-surface-variant">
                    Min: {activeCategory.min_qty || 1}
                  </span>
                </div>

                {/* Estimate Result Box */}
                <div className="bg-primary-container text-on-primary p-5 rounded-xl mb-4 shadow-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-on-primary/70 uppercase font-bold tracking-wider">
                      Estimated Investment
                    </span>
                    <span className="text-[10px] bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-bold">
                      Instant Calc
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-secondary-container tracking-tight font-display">
                    {formattedTotal}
                  </div>
                  <p className="text-[11px] text-on-primary/70 mt-1">
                    *Indicative estimate. Final pricing may vary based on exact custom artwork or bulk discounts.
                  </p>
                </div>

                {/* Optional Contact Inputs for Lead Capture */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="text-xs p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface"
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="text-xs p-2.5 rounded-lg border border-outline-variant/40 bg-surface text-on-surface"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://wa.me/2348164171414?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleRecordInquiry}
                  className="w-full bg-secondary-container text-on-secondary-container font-bold text-sm py-3 px-4 rounded-xl hover:bg-secondary-fixed transition-colors shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 text-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  Send Estimate via WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
