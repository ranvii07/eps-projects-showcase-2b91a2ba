-- Idempotent: the reconstructed baseline (20260628000000) already creates this
-- policy, so a fresh `supabase db reset` / new-environment provision would fail
-- on "policy already exists" without the DROP. Editing an already-applied
-- migration does not re-run it on the live DB (it is tracked as applied); this
-- only fixes clean re-provisioning.
DROP POLICY IF EXISTS "submissions staff delete" ON public.contact_submissions;
CREATE POLICY "submissions staff delete" ON public.contact_submissions FOR DELETE USING (public.is_staff(auth.uid()));
