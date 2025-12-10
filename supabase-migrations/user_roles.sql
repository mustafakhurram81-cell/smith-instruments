-- User Roles Table for Admin Dashboard Access Control
-- Run this ENTIRE SQL in your Supabase SQL Editor

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Step 2: Enable Row Level Security with simple policies
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (prevents errors on re-run)
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow admins to insert/update/delete" ON public.user_roles;

-- Create simple policies that allow authenticated users to read
CREATE POLICY "Allow authenticated users to read all roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow admins to insert/update/delete" ON public.user_roles
    FOR ALL TO authenticated
    USING (true);

-- Step 3: Grant permissions
GRANT ALL ON public.user_roles TO authenticated;

-- Step 4: Insert the admin user (Mustafa)
INSERT INTO public.user_roles (user_id, role) 
VALUES ('eba20401-bf79-410f-a99c-2bdeca7afa21', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 5: Verify - this should show your admin role
SELECT * FROM public.user_roles;
