

## Problem

The "Website" bucket exists and is public (files accessible by direct URL), but there are **no RLS policies** on `storage.objects` for `bucket_id = 'Website'`. The Supabase JS client's `.list()` method queries `storage.objects` which requires a SELECT policy — that's why the modal shows "Tout (0)".

Additionally, the file/folder detection logic in `ImagePicker.tsx` has a flaw: `supabase.storage.list()` returns items where folders have `id: null` and files have a valid `id`. The current check `f.metadata` is unreliable — some files might not have metadata populated immediately.

## Fix

### 1. Add RLS policies for "Website" bucket (SQL migration)

```sql
-- Allow anyone to list/view files (bucket is public)
CREATE POLICY "Public can list Website files"
ON storage.objects FOR SELECT
USING (bucket_id = 'Website');

-- Allow authenticated users to upload
CREATE POLICY "Auth can upload to Website"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'Website');

-- Allow authenticated users to update
CREATE POLICY "Auth can update Website files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'Website');

-- Allow authenticated users to delete
CREATE POLICY "Auth can delete Website files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'Website');
```

### 2. Fix folder detection logic in `ImagePicker.tsx`

Replace the unreliable `f.metadata` check with `f.id !== null` to detect files vs folders:

```typescript
for (const f of data) {
  if (f.id) {
    // It's a file
    const fullPath = folder ? `${folder}/${f.name}` : f.name;
    allFiles.push({ name: f.name, folder, fullPath, url: getPublicUrl(fullPath) });
  } else {
    // It's a folder — recurse
    const subFolder = folder ? `${folder}/${f.name}` : f.name;
    await listFolder(subFolder);
  }
}
```

Also filter out `.emptyFolderPlaceholder` files that Supabase creates.

### Files modified
- SQL migration (new RLS policies)
- `src/components/admin/ImagePicker.tsx` (fix detection logic)

