-- Activity Log Table for tracking admin actions
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Create the activity_log table
CREATE TABLE IF NOT EXISTS public.activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Who performed the action
    user_id UUID REFERENCES auth.users(id),
    user_email TEXT,
    
    -- What action was performed
    action TEXT NOT NULL, -- e.g., 'product_created', 'product_updated', 'csv_imported', 'csv_exported'
    entity_type TEXT, -- e.g., 'product', 'category', 'quote', 'user'
    entity_id TEXT, -- SKU or ID of the affected entity
    entity_name TEXT, -- Name for display
    
    -- Details
    details JSONB, -- Additional data about the action
    
    -- When
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated to read activity log" ON public.activity_log;
DROP POLICY IF EXISTS "Allow authenticated to insert activity log" ON public.activity_log;

-- Authenticated users can read the activity log
CREATE POLICY "Allow authenticated to read activity log" ON public.activity_log
    FOR SELECT TO authenticated
    USING (true);

-- Authenticated users can insert into activity log
CREATE POLICY "Allow authenticated to insert activity log" ON public.activity_log
    FOR INSERT TO authenticated
    WITH CHECK (true);

-- Step 3: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON public.activity_log(action);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity_type ON public.activity_log(entity_type);

-- Step 4: Grant permissions
GRANT ALL ON public.activity_log TO authenticated;

-- Verify
SELECT 'activity_log table created successfully!' as result;
