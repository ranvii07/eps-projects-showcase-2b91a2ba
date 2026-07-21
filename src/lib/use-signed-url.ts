import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_TTL = 60 * 10;

export async function getSignedUrl(
  bucket: string,
  path: string,
  ttl: number = DEFAULT_TTL,
): Promise<{ url: string | null; error: string | null }> {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, ttl);
  return { url: data?.signedUrl ?? null, error: error?.message ?? null };
}

export type SignedUrlState = {
  url: string | null;
  /** True when signing failed (missing object, denied policy, network error).
      Lets callers render a fallback instead of an indefinite loading state. */
  failed: boolean;
};

export function useSignedUrl(
  bucket: string,
  path: string | null,
  ttl: number = DEFAULT_TTL,
): SignedUrlState {
  const [state, setState] = useState<SignedUrlState>({ url: null, failed: false });
  useEffect(() => {
    let active = true;
    setState({ url: null, failed: false });
    if (!path) return;
    getSignedUrl(bucket, path, ttl).then(({ url }) => {
      if (active) setState({ url, failed: !url });
    });
    return () => {
      active = false;
    };
  }, [bucket, path, ttl]);
  return state;
}
