-- Allow anyone to list and read files in the toile-colors bucket
CREATE POLICY "Public can list toile-colors"
ON storage.objects FOR SELECT
USING (bucket_id = 'toile-colors');
