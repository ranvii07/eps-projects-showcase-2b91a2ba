import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  // TEMPORARY: CMS login gate disabled on request. The auth + staff-role check
  // below will be restored later; nothing else about this layout changed.
  //
  // beforeLoad: async () => {
  //   const { data, error } = await supabase.auth.getUser();
  //   if (error || !data.user) throw redirect({ to: "/admin/login" });
  //   const { data: roles, error: rolesError } = await supabase
  //     .from("user_roles")
  //     .select("role")
  //     .eq("user_id", data.user.id)
  //     .limit(1);
  //   if (rolesError || !roles || roles.length === 0) {
  //     await supabase.auth.signOut();
  //     toast.error("Not authorized", {
  //       description: "Your account doesn't have access to the CMS.",
  //     });
  //     throw redirect({ to: "/admin/login" });
  //   }
  //   return { user: data.user };
  // },
  component: () => <Outlet />,
});

