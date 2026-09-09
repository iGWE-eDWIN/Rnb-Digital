# RnB Digitals - Supabase CMS Setup & Deployment Guide

This guide will walk you through connecting your **RnB Digitals** website and Admin Dashboard to your Supabase backend.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and log in or create a free account.
2. Click **New Project**.
3. Choose your project name (e.g. `rnb-digitals`), enter a strong database password, and choose your preferred region.
4. Wait 1-2 minutes for your project to provision.

---

## 2. Execute the Database Migration & Seed Script

1. In your Supabase Dashboard, navigate to the **SQL Editor** tab in the left sidebar.
2. Click **New Query**.
3. Open the file [supabase/schema.sql](supabase/schema.sql) in this repository.
4. Copy the entire contents of `supabase/schema.sql` and paste it into the Supabase SQL editor.
5. Click **Run** (or press `Ctrl+Enter`).

This single script will automatically:
- Create all database tables (`site_settings`, `navigation_links`, `hero_slides`, `services`, `estimator_categories`, `estimator_options`, `portfolio_items`, `products`, `about_pillars`, `site_stats`, `testimonials`, `media_assets`, `quote_inquiries`).
- Enable Row Level Security (RLS) policies allowing public read access and authenticated admin write access.
- Create the public Supabase Storage bucket `rnb-media` with size and mime-type security rules.
- Pre-seed the database with 100% of your existing website's content, services, slideshow, estimator prices, portfolio, and contact info.

---

## 3. Create Your Admin User

1. In your Supabase Dashboard, go to **Authentication** > **Users**.
2. Click **Add User** > **Create User**.
3. Enter your administrator email (e.g. `admin@rnbdigitals.com` or your personal email) and a secure password.
4. Make sure **Auto Confirm User?** is checked so the user is active immediately.
5. Click **Create User**.

---

## 4. Add Environment Variables

1. In your Supabase Dashboard, click on the **Project Settings** (gear icon) at the bottom of the left sidebar.
2. Go to **API**.
3. Copy your:
   - **Project URL**
   - **anon / public key**
4. Open your `.env.local` file in the website root directory and paste them in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key-here...
```

---

## 5. Log in to the Admin Dashboard

1. Start your development server:
   ```bash
   npm run dev
   ```
2. Navigate to:
   ```
   http://localhost:3000/admin
   ```
3. You will be redirected to the secure **Admin Login** page (`/admin/login`).
4. Log in using the email and password you created in Step 3 (or use the built-in demo credentials `admin@rnbdigitals.com` / `admin@rnbdigitals` if testing offline).
5. You now have full CMS control over:
   - **Dashboard Overview**: Statistics & live lead inquiries feed
   - **Header & Logo**: Upload/replace brand logo, configure navigation menu
   - **Hero Section**: Headlines, subheadings, trust badges, buttons, and automated Slideshow
   - **Services Catalog**: Full CRUD, pricing, feature bullet lists, and image uploads
   - **Price Estimator**: Real-time service categories, base rates, minimum order quantities, and add-on finishings
   - **Portfolio**: Case studies, client names, category filters, and tags
   - **Store Catalog**: Ready-to-brand essentials, minimum orders, and prices
   - **About & Pillars**: Why Choose Us pillars and metric counters
   - **Testimonials**: Star ratings, client names, roles, quotes, and avatars
   - **Contact & Inquiries**: Address, telephone, WhatsApp, business hours, and interactive quote inbox
   - **Footer**: Brand bio, copyright, and navigation links
   - **Media Library**: Supabase Storage file explorer with drag-and-drop uploads and URL copying
