CREATE POLICY "Public can list Website files"
ON storage.objects FOR SELECT
USING (bucket_id = 'Website');

CREATE POLICY "Auth can upload to Website"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Website');

CREATE POLICY "Auth can update Website files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'Website');

CREATE POLICY "Auth can delete Website files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'Website');