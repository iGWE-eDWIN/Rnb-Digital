'use client';

import React, { useState } from 'react';

interface QuoteCalculatorProps {
  initialService?: string;
}

interface ServiceConfig {
  id: string;
  name: string;
  unitLabel: string;
  baseRate: number;
  minQty: number;
  options: { name: string; extraPrice: number }[];
}

const CALCULATOR_SERVICES: Record<string, ServiceConfig> = {
  'Large Format Printing': {
    id: 'banner',
    name: 'Large Format Printing',
    unitLabel: 'Square Feet / Units',
    baseRate: 350, // ₦350 per sq ft
    minQty: 24,
    options: [
      { name: 'Standard Flex Banner (440gsm)', extraPrice: 0 },
      { name: 'Heavy Duty Mesh / Backlit (510gsm)', extraPrice: 150 },
      { name: 'With Eyelets & Reinforced Hemming', extraPrice: 50 },
      { name: 'Includes Rollup Banner Stand Hardware', extraPrice: 12000 },
    ],
  },
  'Custom Apparel & Embroidery': {
    id: 'apparel',
    name: 'Custom Apparel & Embroidery',
    unitLabel: 'Number of Shirts',
    baseRate: 6500, // ₦6,500 per shirt
    minQty: 5,
    options: [
      { name: 'Single-Location Chest Embroidery', extraPrice: 0 },
      { name: 'Dual-Location (Chest + Sleeve / Back)', extraPrice: 1500 },
      { name: 'Heavyweight 220gsm Pique Cotton', extraPrice: 1200 },
      { name: 'Individual Custom Polybag Packaging', extraPrice: 300 },
    ],
  },
  'Branded Wrapping Tissue Paper': {
    id: 'tissue',
    name: 'Branded Wrapping Tissue Paper',
    unitLabel: 'Packs (500 Sheets/Pack)',
    baseRate: 28000, // ₦28,000 per 500 sheets
    minQty: 1,
    options: [
      { name: 'Single Color Brand Pattern (17gsm)', extraPrice: 0 },
      { name: 'Dual Color Brand Pattern (22gsm)', extraPrice: 5000 },
      { name: 'Metallic Gold / Silver Ink Accent', extraPrice: 8000 },
    ],
  },
  'Luxury Business Cards': {
    id: 'cards',
    name: 'Luxury Business Cards',
    unitLabel: 'Packs (100 Cards/Pack)',
    baseRate: 9500, // ₦9,500 per 100
    minQty: 1,
    options: [
      { name: 'Standard Matte Lamination (350gsm)', extraPrice: 0 },
      { name: 'Velvet Soft-Touch Luxury Finish (600gsm)', extraPrice: 4500 },
      { name: 'Dual-Sided Metallic Gold Foil Stamping', extraPrice: 5000 },
      { name: 'Curved Corner Die-Cut Finishing', extraPrice: 1500 },
    ],
  },
  'Branded Merchandise & Drinkware': {
    id: 'merch',
    name: 'Branded Merchandise & Drinkware',
    unitLabel: 'Units',
    baseRate: 4500,
    minQty: 10,
    options: [
      { name: 'Premium Ceramic Two-Tone Coffee Mug', extraPrice: 0 },
      { name: 'Stainless Steel Smart LED Thermal Tumbler', extraPrice: 3500 },
      { name: 'Laser Engraved Metallic Executive Pen', extraPrice: 1500 },
      { name: 'Luxury Presentation Gift Box', extraPrice: 2000 },
    ],
  },
  'Web Development & Digital Presence': {
    id: 'web',
    name: 'Web Development & Digital Presence',
    unitLabel: 'Project Package',
    baseRate: 150000,
    minQty: 1,
    options: [
      { name: 'Starter Business Website (4-5 Pages + SEO)', extraPrice: 0 },
      { name: 'E-Commerce Store (Payment Gateway + Catalog)', extraPrice: 120000 },
      { name: 'Custom Web Application & Client Portal', extraPrice: 250000 },
      { name: '3-Month Digital Marketing & Ads Management', extraPrice: 90000 },
    ],
  },
};

export default function QuoteCalculator({ initialService }: QuoteCalculatorProps) {
  const serviceKeys = Object.keys(CALCULATOR_SERVICES);
  const [selectedServiceKey, setSelectedServiceKey] = useState<string>(
    initialService && CALCULATOR_SERVICES[initialService]
      ? initialService
      : serviceKeys[0]
  );

  const activeService = CALCULATOR_SERVICES[selectedServiceKey];
  const [quantity, setQuantity] = useState<number>(activeService.minQty);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([0]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  const handleServiceChange = (key: string) => {
    setSelectedServiceKey(key);
    const newService = CALCULATOR_SERVICES[key];
    setQuantity(newService.minQty);
    setSelectedOptions([0]);
  };

  const toggleOption = (index: number) => {
    if (selectedOptions.includes(index)) {
      if (selectedOptions.length > 1) {
        setSelectedOptions(selectedOptions.filter((i) => i !== index));
      }
    } else {
      setSelectedOptions([...selectedOptions, index]);
    }
  };

  // Calculate estimated cost
  const optionsExtraTotal = selectedOptions.reduce((acc, optIdx) => {
    const opt = activeService.options[optIdx];
    return acc + (opt ? opt.extraPrice : 0);
  }, 0);

  const estimatedTotal = (activeService.baseRate + optionsExtraTotal) * quantity;
  const formattedTotal = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(estimatedTotal);

  const getWhatsAppMessage = () => {
    const selectedOptionNames = selectedOptions
      .map((idx) => activeService.options[idx]?.name)
      .filter(Boolean)
      .join(', ');

    const text = `Hello RnB Digitals! I used your online estimator for:
- Service: ${activeService.name}
- Quantity: ${quantity} ${activeService.unitLabel}
- Specifications: ${selectedOptionNames}
- Estimated Total: ${formattedTotal}
${customerName ? `- Name: ${customerName}` : ''}
${customerPhone ? `- Phone: ${customerPhone}` : ''}

Please let me know how to proceed with placing this order.`;

    return encodeURIComponent(text);
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
              {serviceKeys.map((key) => {
                const isSelected = selectedServiceKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleServiceChange(key)}
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
                      <span className="truncate">{key}</span>
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
                {activeService.options.map((opt, idx) => {
                  const isChecked = selectedOptions.includes(idx);
                  return (
                    <label
                      key={idx}
                      onClick={() => toggleOption(idx)}
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
                      {opt.extraPrice > 0 && (
                        <span className="text-[11px] font-bold text-primary-container bg-surface-container px-2 py-0.5 rounded">
                          +₦{opt.extraPrice.toLocaleString()}
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
                  3. Quantity ({activeService.unitLabel})
                </label>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(activeService.minQty, quantity - (activeService.id === 'banner' ? 10 : 5)))}
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container font-bold text-lg flex items-center justify-center border border-outline-variant/30 cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={activeService.minQty}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 text-center font-bold text-lg py-2 border rounded-lg bg-surface border-outline-variant/50 focus:ring-2 focus:ring-secondary-container"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + (activeService.id === 'banner' ? 10 : 5))}
                    className="w-10 h-10 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary-container font-bold text-lg flex items-center justify-center border border-outline-variant/30 cursor-pointer"
                  >
                    +
                  </button>
                  <span className="text-xs text-on-surface-variant">Min: {activeService.minQty}</span>
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
                  <div className="text-3xl font-extrabold text-secondary-container tracking-tight">
                    {formattedTotal}
                  </div>
                  <p className="text-[11px] text-on-primary/70 mt-1">
                    *Indicative estimate. Final pricing may vary based on exact custom artwork or bulk discounts.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <a
                  href={`https://wa.me/2348164171414?text=${getWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-secondary-container text-on-secondary-container font-bold text-sm py-3 px-4 rounded-xl hover:bg-secondary-fixed transition-colors shadow-md hover:shadow-gold-glow flex items-center justify-center gap-2 text-center"
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
