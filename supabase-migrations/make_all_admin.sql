-- PROMOTE ALL USERS TO ADMIN
-- This script will give ADMIN access to ALL registered users.
-- This bypasses any "wrong user ID" issues.

-- 1. Insert/Update all users to be admins
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin' FROM auth.users
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- 2. Verify results
SELECT * FROM public.user_roles;
