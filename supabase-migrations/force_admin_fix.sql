-- COMPLETE ADMIN FIX
-- Run this ENTIRE script in your Supabase SQL Editor.

-- 1. Ensure the table exists and is readable
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 2. Reset RLS policies for reading
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated users to read all roles" ON public.user_roles;
CREATE POLICY "Allow authenticated users to read all roles" ON public.user_roles
    FOR SELECT TO authenticated
    USING (true);

-- 3. Force Admin Access for your User ID
INSERT INTO public.user_roles (user_id, role) 
VALUES ('eba20401-bf79-410f-a99c-2bdeca7afa21', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 4. Verify Immediate Result
SELECT * FROM public.user_roles WHERE user_id = 'eba20401-bf79-410f-a99c-2bdeca7afa21';
