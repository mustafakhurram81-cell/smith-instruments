-- PROMOTE SPECIFIC USER TO ADMIN
-- Run this in Supabase SQL Editor

-- 1. Remove any existing entry for this user to avoid conflicts
DELETE FROM public.user_roles WHERE user_id = 'eba20401-bf79-410f-a99c-2bdeca7afa21';

-- 2. Insert the admin privilege freshly
INSERT INTO public.user_roles (user_id, role) 
VALUES ('eba20401-bf79-410f-a99c-2bdeca7afa21', 'admin');

-- 3. Verify the result
SELECT * FROM public.user_roles WHERE user_id = 'eba20401-bf79-410f-a99c-2bdeca7afa21';
