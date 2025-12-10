-- Quote Requests Table for storing all quote submissions
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Create the quote_requests table
CREATE TABLE IF NOT EXISTS public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer info
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    customer_company TEXT,
    customer_country TEXT,
    
    -- Quote details
    products JSONB NOT NULL, -- Array of {sku, name, quantity, image_url}
    message TEXT,
    
    -- Status tracking
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'converted', 'archived')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID REFERENCES auth.users(id),
    notes TEXT -- Internal notes for admin
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to insert quote requests" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated to read all quotes" ON public.quote_requests;
DROP POLICY IF EXISTS "Allow authenticated to update quotes" ON public.quote_requests;

-- Public can submit quotes (INSERT only)
CREATE POLICY "Allow public to insert quote requests" ON public.quote_requests
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Authenticated users can read all quotes
CREATE POLICY "Allow authenticated to read all quotes" ON public.quote_requests
    FOR SELECT TO authenticated
    USING (true);

-- Authenticated users can update quotes
CREATE POLICY "Allow authenticated to update quotes" ON public.quote_requests
    FOR UPDATE TO authenticated
    USING (true);

-- Step 3: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON public.quote_requests(created_at DESC);

-- Step 4: Grant permissions
GRANT INSERT ON public.quote_requests TO anon;
GRANT ALL ON public.quote_requests TO authenticated;

-- Step 5: Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_quote_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamp
DROP TRIGGER IF EXISTS update_quote_requests_updated_at ON public.quote_requests;
CREATE TRIGGER update_quote_requests_updated_at
    BEFORE UPDATE ON public.quote_requests
    FOR EACH ROW EXECUTE FUNCTION public.update_quote_updated_at();

-- Verify
SELECT 'quote_requests table created successfully!' as result;
