import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/admin/login" });
    }

    // Role-gate (defense-in-depth only — RLS is the real security boundary).
    // is_staff() == "has any row in user_roles" (director/coo/admin), and the
    // "user_roles self or staff select" RLS policy lets every authenticated
    // user read their OWN rows, so this self-scoped query works for anyone and
    // returns an empty set (no error) for a role-less user. Fail closed: empty
    // OR unreadable is treated as not-staff.
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .limit(1);

    if (rolesError || !roles || roles.length === 0) {
      // Drop the session first: /admin/login bounces any logged-in user to the
      // dashboard, so without signing out a non-staff user would loop
      // login -> dashboard -> here -> login. Signing out also correctly denies
      // a non-staff account any admin session.
      await supabase.auth.signOut();
      toast.error("Not authorized", {
        description: "Your account doesn't have access to the CMS.",
      });
      throw redirect({ to: "/admin/login" });
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});
