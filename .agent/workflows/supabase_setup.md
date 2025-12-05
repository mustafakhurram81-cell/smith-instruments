
# Supabase Integration Workflow

This workflow sets up Supabase for the Smith Instruments project, including database schema, storage buckets, and client integration.

## 1. Prerequisites (User Action Required)
The user must create a Supabase project at https://supabase.com/dashboard and provide the following:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 2. Infrastructure Setup (Once keys are provided)
We will create a specific `setup_supabase.sql` script to run in the Supabase SQL Editor. This script will:
- Create a `products` table (id, sku, name, description, category, subcategory, image_url, specifications, created_at).
- Create a `storage` bucket named `product-images`.
- Set up Row Level Security (RLS) policies to allow public read access and authenticated write access.

## 3. Client Integration
- Install `@supabase/supabase-js`.
- Create `src/lib/supabase.ts` to initialize the client.
- Update `src/utils/storage.ts` (or create a new `src/utils/db.ts`) to use Supabase instead of localStorage.

## 4. Migration Tool Update
- Update `pages/admin/Migration.tsx` to:
    1. Fetch product data from `smithsurgical.uk`.
    2. Download the image from the WordPress URL.
    3. Upload the image to Supabase Storage.
    4. Get the new public URL from Supabase.
    5. Insert the product record (with the new image URL) into the `products` table.

## 5. Catalogues Optimization
- To fix the reload/performance issue, we will implement lazy loading and caching for the thumbnails.
- We will ensure the FlipBook viewer is only initialized when needed and properly cleaned up.

