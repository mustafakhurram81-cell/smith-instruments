-- Supabase RPC Function to efficiently get distinct category names
-- This is MUCH faster than fetching all products and extracting categories in JavaScript

CREATE OR REPLACE FUNCTION get_distinct_categories()
RETURNS TABLE(category text) AS $$
  SELECT DISTINCT category 
  FROM products 
  WHERE category IS NOT NULL AND category != '' 
  ORDER BY category;
$$ LANGUAGE SQL STABLE;

-- Grant access to anonymous users (public access)
GRANT EXECUTE ON FUNCTION get_distinct_categories() TO anon, authenticated;
