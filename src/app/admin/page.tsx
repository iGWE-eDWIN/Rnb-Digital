'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getServices,
  getPortfolioItems,
  getEstimatorCategories,
  getProducts,
  getTestimonials,
  getInquiries,
  getHeroSlides,
  updateInquiryStatus,
} from '@/lib/cms-data';
import { QuoteInquiry } from '@/types/cms';
import { useAuth } from '@/context/AuthContext';
import Toast, { ToastMessage } from '@/components/admin/Toast';

export default function AdminDashboardPage() {
  const { isSupabaseLive } = useAuth();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    services: 0,
    portfolio: 0,
    estimator: 0,
    products: 0,
    testimonials: 0,
    inquiries: 0,
    slides: 0,
  });
  const [recentInquiries, setRecentInquiries] = useState<QuoteInquiry[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToasts((prev) => [...prev, { id: `${Date.now()}`, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    async function loadStats() {
      try {
        const [services, portfolio, estimator, products, testimonials, inquiries, slides] =
          await Promise.all([
            getServices(),
            getPortfolioItems(),
            getEstimatorCategories(),
            getProducts(),
            getTestimonials(),
            getInquiries(),
            getHeroSlides(),
          ]);

        setCounts({
          services: services.length,
          portfolio: portfolio.length,
          estimator: estimator.length,
          products: products.length,
          testimonials: testimonials.length,
          inquiries: inquiries.length,
          slides: slides.length,
        });

        setRecentInquiries(inquiries.slice(0, 5));
      } catch (e) {
        console.error('Error loading dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const handleStatusChange = async (id: string, newStatus: QuoteInquiry['status']) => {
    await updateInquiryStatus(id, newStatus);
    setRecentInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
    addToast('success', `Inquiry status updated to ${newStatus}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-primary-container">
        <div className="w-8 h-8 border-3 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Loading dashboard overview...</span>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Services',
      count: counts.services,
      icon: 'home_repair_service',
      href: '/admin/services',
      color: 'border-emerald-500/40 bg-emerald-500/5 text-emerald-700',
    },
    {
      title: 'Estimator Categories',
      count: counts.estimator,
      icon: 'calculate',
      href: '/admin/estimator',
      color: 'border-amber-500/40 bg-amber-500/5 text-amber-700',
    },
    {
      title: 'Portfolio Projects',
      count: counts.portfolio,
      icon: 'photo_library',
      href: '/admin/portfolio',
      color: 'border-blue-500/40 bg-blue-500/5 text-blue-700',
    },
    {
      title: 'Store Products',
      count: counts.products,
      icon: 'shopping_bag',
      href: '/admin/store',
      color: 'border-purple-500/40 bg-purple-500/5 text-purple-700',
    },
    {
      title: 'Client Testimonials',
      count: counts.testimonials,
      icon: 'reviews',
      href: '/admin/testimonials',
      color: 'border-rose-500/40 bg-rose-500/5 text-rose-700',
    },
    {
      title: 'Hero Slides',
      count: counts.slides,
      icon: 'view_carousel',
      href: '/admin/hero',
      color: 'border-cyan-500/40 bg-cyan-500/5 text-cyan-700',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Supabase Notice Banner */}
      {!isSupabaseLive && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-2xl">info</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Running in Local Fallback Mode
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                All changes you make are instantly reactive and stored in your browser. To sync live with your cloud Supabase database, add your credentials in <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">.env.local</code> and run the SQL migration from <code className="bg-amber-500/20 px-1 py-0.5 rounded font-mono">supabase/schema.sql</code>.
              </p>
            </div>
          </div>

          <Link
            href="/admin/settings"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors"
          >
            View Config Guide
          </Link>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-primary-container text-on-primary rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-container/20 text-secondary-container text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-sm">tune</span>
            Complete CMS Control Center
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
            Welcome to the RnB Digitals Content Studio
          </h2>
          <p className="text-sm sm:text-base text-on-primary/80 mt-2 leading-relaxed">
            Manage every section of the website in real time without writing code. Updates to copy, prices, services, portfolio, and images reflect immediately on the live website.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <Link
              href="/admin/hero"
              className="px-4 py-2.5 bg-secondary-container text-on-secondary-container font-bold text-xs rounded-xl hover:bg-secondary-fixed transition-colors shadow-md flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Edit Hero Section
            </Link>
            <Link
              href="/admin/estimator"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors border border-white/15 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-secondary-container">
                calculate
              </span>
              Update Estimator Pricing
            </Link>
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors border border-white/15 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base text-secondary-container">
                visibility
              </span>
              Preview Live Site
            </Link>
          </div>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-secondary-container/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Grid */}
      <div>
        <h3 className="text-base font-extrabold text-primary-container mb-4 font-display flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">analytics</span>
          Website Content Overview
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className={`p-5 rounded-2xl border bg-surface transition-all duration-200 hover:shadow-ambient hover:-translate-y-0.5 group block`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="material-symbols-outlined text-2xl text-secondary-container group-hover:scale-110 transition-transform">
                  {stat.icon}
                </span>
                <span className="text-xs text-on-surface-variant group-hover:text-primary-container material-symbols-outlined">
                  arrow_forward
                </span>
              </div>
              <div className="text-2xl font-extrabold text-primary-container font-display">
                {stat.count}
              </div>
              <div className="text-xs font-semibold text-on-surface-variant mt-1 truncate">
                {stat.title}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-extrabold text-primary-container font-display flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-container">inbox</span>
              Recent Quote & Contact Inquiries
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Leads submitted from the public estimator and contact inquiry forms
            </p>
          </div>

          <Link
            href="/admin/contact"
            className="text-xs font-bold text-primary-container hover:text-secondary-container flex items-center gap-1"
          >
            <span>View All Inquiries</span>
            <span className="material-symbols-outlined text-xs">arrow_forward</span>
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <div className="text-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">
              mark_email_read
            </span>
            <p className="text-sm font-semibold">No inquiries submitted yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant/30 text-on-surface-variant uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Service & Estimate</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-primary-container">{inq.name}</div>
                      {inq.message && (
                        <div className="text-[11px] text-on-surface-variant line-clamp-1 max-w-xs">
                          {inq.message}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-on-surface">{inq.phone}</div>
                      {inq.email && (
                        <div className="text-[11px] text-on-surface-variant">{inq.email}</div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-primary-container">
                        {inq.service || 'General Inquiry'}
                      </div>
                      {inq.estimated_total && (
                        <div className="text-[11px] font-bold text-secondary-container bg-primary-container px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {inq.estimated_total}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleStatusChange(inq.id, e.target.value as QuoteInquiry['status'])
                        }
                        className={`text-[11px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                          inq.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30'
                            : inq.status === 'contacted'
                            ? 'bg-blue-500/10 text-blue-700 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-700 border-amber-500/30'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="contacted">Contacted</option>
                        <option value="completed">Completed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(
                          inq.name
                        )},%20thank%20you%20for%20contacting%20RnB%20Digitals!`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary-container bg-primary-container hover:bg-primary py-1 px-2 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">chat</span>
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
