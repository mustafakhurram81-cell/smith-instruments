-- User Roles Table for Admin Dashboard Access Control
-- Run this SQL in your Supabase SQL Editor

-- Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Only admins can manage roles (optional, for future role management UI)
CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Function to automatically create a role entry when a new user signs up
-- Default role is 'editor' - you can manually change to 'admin' in Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'editor')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create role on user signup
DROP TRIGGER IF EXISTS on_auth_user_created_role ON auth.users;
CREATE TRIGGER on_auth_user_created_role
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Grant permissions
GRANT SELECT ON public.user_roles TO authenticated;

-- IMPORTANT: After running this migration, you need to:
-- 1. Insert a row for your existing admin user(s):
--    INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR_USER_UUID', 'admin');
-- 2. You can find user UUIDs in the Supabase Dashboard under Authentication > Users

