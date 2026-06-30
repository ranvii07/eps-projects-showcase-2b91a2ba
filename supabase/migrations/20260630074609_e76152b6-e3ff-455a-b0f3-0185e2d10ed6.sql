
CREATE POLICY "Staff can read CMS storage objects"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id IN ('project-images', 'client-images', 'documents')
  AND public.is_staff(auth.uid())
);

CREATE POLICY "Staff can upload CMS storage objects"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('project-images', 'client-images', 'documents')
  AND public.is_staff(auth.uid())
);

CREATE POLICY "Staff can update CMS storage objects"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('project-images', 'client-images', 'documents')
  AND public.is_staff(auth.uid())
)
WITH CHECK (
  bucket_id IN ('project-images', 'client-images', 'documents')
  AND public.is_staff(auth.uid())
);

CREATE POLICY "Staff can delete CMS storage objects"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('project-images', 'client-images', 'documents')
  AND public.is_staff(auth.uid())
);
