import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });

    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .limit(1);

    if (rolesError || !roles || roles.length === 0) {
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
