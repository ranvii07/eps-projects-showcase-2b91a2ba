import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// CMS-controlled feature toggles, stored one row per key in public.site_settings
// (migration 20260803010000). Read is open to anon, so these can gate public UI.
//
// Keys are declared here rather than typed as `string` so a typo in a component
// is a compile error instead of a silently-false flag.
export const SITE_SETTING_KEYS = {
  projectGallery: "project_gallery_enabled",
} as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[keyof typeof SITE_SETTING_KEYS];

/**
 * Reads one toggle. Fails closed: a missing row, an RLS denial, a network error,
 * and a thrown client (the supabase proxy throws on construction when the env
 * vars are absent) all resolve to `false`. Every caller is gating a feature that
 * is meant to stay hidden by default, so "couldn't tell" must mean "off" — and
 * the route guard in particular must never turn a broken read into an exception
 * page that leaks the page's existence.
 */
export async function fetchSiteSetting(key: SiteSettingKey): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("enabled")
      .eq("key", key)
      .maybeSingle();
    if (error || !data) return false;
    return data.enabled === true;
  } catch {
    return false;
  }
}

export type SiteSettingState = {
  enabled: boolean;
  /** True until the first read settles. Treat `enabled` as false while loading. */
  loading: boolean;
};

/**
 * Component-side reader for a toggle, in the same shape as useSignedUrl: local
 * state, one effect, cancel-on-unmount. `enabled` starts false so a hidden
 * feature never flashes into view before the answer arrives.
 */
export function useSiteSetting(key: SiteSettingKey): SiteSettingState {
  const [state, setState] = useState<SiteSettingState>({ enabled: false, loading: true });
  useEffect(() => {
    let active = true;
    setState({ enabled: false, loading: true });
    fetchSiteSetting(key).then((enabled) => {
      if (active) setState({ enabled, loading: false });
    });
    return () => {
      active = false;
    };
  }, [key]);
  return state;
}
