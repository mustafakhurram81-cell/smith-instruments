-- Storage policies for Catalogues bucket
-- Run this in Supabase SQL Editor

-- Policy 1: Allow public read access (anyone can view/download)
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'Catalogues');

-- Policy 2: Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'Catalogues' AND auth.role() = 'authenticated');

-- Policy 3: Allow authenticated users to update
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'Catalogues' AND auth.role() = 'authenticated');

-- Policy 4: Allow authenticated users to delete
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'Catalogues' AND auth.role() = 'authenticated');
