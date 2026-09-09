'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.replace('/admin/login');
    }
  }, [user, loading, isLoginPage, router]);

  // If on login page, render children directly without dashboard shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center text-primary-container gap-4 p-4 text-center">
        <div className="w-10 h-10 border-4 border-secondary-container border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-bold tracking-wide animate-pulse">
          Verifying Admin Credentials...
        </p>
        <a
          href="/admin/login"
          className="text-xs font-semibold text-secondary-container hover:underline mt-2"
        >
          Proceed to Login &rarr;
        </a>
      </div>
    );
  }

  // Not authenticated and redirected
  if (!user) {
    return null;
  }

  // Extract page title from route
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname.includes('/settings')) return 'Site Settings & Header';
    if (pathname.includes('/hero')) return 'Hero & Slideshow';
    if (pathname.includes('/services')) return 'Services Management';
    if (pathname.includes('/estimator')) return 'Price Estimator Settings';
    if (pathname.includes('/portfolio')) return 'Portfolio & Projects';
    if (pathname.includes('/store')) return 'Store & Product Catalog';
    if (pathname.includes('/about')) return 'About & Value Pillars';
    if (pathname.includes('/testimonials')) return 'Client Testimonials';
    if (pathname.includes('/contact')) return 'Contact & Inquiries';
    if (pathname.includes('/footer')) return 'Footer Management';
    if (pathname.includes('/media')) return 'Media Library';
    return 'Admin CMS';
  };

  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          title={getPageTitle()}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
