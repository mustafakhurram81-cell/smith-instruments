
-- Create Products Table
create table products (
  id uuid default gen_random_uuid() primary key,
  sku text unique not null,
  name text not null,
  description text,
  category text,
  subcategory text,
  image_url text, /* Connects to Storage */
  specifications jsonb, /* Flexible JSON for things like Material, Size */
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Storage Bucket for Images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Set up Row Level Security (RLS)
-- 1. Everyone can READ products
alter table products enable row level security;
create policy "Public Products are viewable by everyone" on products for select using (true);

-- 2. Only authenticated users (Admins) can INSERT/UPDATE/DELETE
create policy "Admins can insert products" on products for insert with check (auth.role() = 'authenticated');
create policy "Admins can update products" on products for update using (auth.role() = 'authenticated');
create policy "Admins can delete products" on products for delete using (auth.role() = 'authenticated');

-- 3. Storage Policies
create policy "Public Images are viewable by everyone" on storage.objects for select using ( bucket_id = 'product-images' );
create policy "Admins can upload images" on storage.objects for insert with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
