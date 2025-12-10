-- Security Fix: Restrict user_roles modifications to admins only
-- Run this SQL in your Supabase SQL Editor

-- Step 1: Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow admins to insert/update/delete" ON public.user_roles;

-- Step 2: Create a proper admin-only policy for modifications
-- Only existing admins can INSERT, UPDATE, or DELETE roles
CREATE POLICY "Only admins can modify roles" ON public.user_roles
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_roles ur
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Step 3: Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_roles';

-- Expected output should show:
-- 1. "Allow authenticated users to read all roles" - SELECT
-- 2. "Only admins can modify roles" - ALL
