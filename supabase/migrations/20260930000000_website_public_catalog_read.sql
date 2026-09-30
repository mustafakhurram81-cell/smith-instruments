-- Website catalog read access without exposing ERP columns (unit_cost, selling_price, stock, reorder_point).
-- Applied to production (jnvdysssdnttlybycefh) on 2026-09-30.

grant select (id, sku, name, category, subcategory, description, image_url, status, catalogue_id,
              created_at, updated_at, specifications, variant_group, instrument_category,
              instrument_subcategory, specialty_category, specialty_subcategory, is_native_catalogue)
  on public.products to anon, authenticated;

drop policy if exists public_select_active_products on public.products;
create policy public_select_active_products on public.products
  for select to anon using (status = 'active');

create or replace view public.catalog_products
with (security_invoker = true) as
  select id, sku, name, category, subcategory, description, image_url, catalogue_id,
         created_at, updated_at, specifications, variant_group, instrument_category,
         instrument_subcategory, specialty_category, specialty_subcategory, is_native_catalogue
  from public.products
  where status = 'active';

grant select on public.catalog_products to anon, authenticated;

-- Category RPCs: search_path is '' so table refs must be schema-qualified.
create or replace function public.get_category_details()
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select category, count(*), max(nullif(image_url, ''))
  from public.catalog_products where category is not null
  group by category order by 1 asc;
$$;

create or replace function public.get_distinct_categories()
returns table(category text) language sql stable set search_path to '' as $$
  select distinct category from public.catalog_products
  where category is not null and category <> '' order by category;
$$;

create or replace function public.get_subcategory_details(p_category text)
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select subcategory, count(*), max(nullif(image_url, ''))
  from public.catalog_products
  where category = p_category and subcategory is not null and subcategory <> 'General'
  group by subcategory order by 1 asc;
$$;

create or replace function public.get_all_instrument_types()
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select subcategory, count(*), max(nullif(image_url, ''))
  from public.catalog_products
  where subcategory is not null and subcategory <> 'General'
  group by subcategory order by 2 desc;
$$;

create or replace function public.get_instrument_categories_with_subs()
returns table(name text, count bigint, image text, subcategories text[]) language sql stable set search_path to '' as $$
  select instrument_category, count(*), max(nullif(image_url, '')),
         array_agg(distinct subcategory) filter (where subcategory is not null and subcategory <> 'General')
  from public.catalog_products where instrument_category is not null
  group by instrument_category order by 2 desc;
$$;

create or replace function public.get_instrument_category_details()
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select instrument_category, count(*), max(nullif(image_url, ''))
  from public.catalog_products where instrument_category is not null
  group by instrument_category order by 2 desc;
$$;

create or replace function public.get_instrument_subcategory_details(p_category text)
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select instrument_subcategory, count(*), max(nullif(image_url, ''))
  from public.catalog_products
  where instrument_category = p_category and instrument_subcategory is not null
  group by instrument_subcategory order by 2 desc;
$$;

create or replace function public.get_specialty_categories_details()
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select specialty_category, count(*), max(nullif(image_url, ''))
  from public.catalog_products where specialty_category is not null
  group by specialty_category order by 2 desc;
$$;

create or replace function public.get_specialty_subcategory_details(p_category text)
returns table(name text, count bigint, image text) language sql stable set search_path to '' as $$
  select specialty_subcategory, count(*), max(nullif(image_url, ''))
  from public.catalog_products
  where specialty_category = p_category and specialty_subcategory is not null
  group by specialty_subcategory order by 2 desc;
$$;
