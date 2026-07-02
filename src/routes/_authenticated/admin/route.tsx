import { useEffect, useState } from "react";
import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  Wrench,
  HelpCircle,
  ShieldCheck,
  Award,
  Mail,
  Settings as SettingsIcon,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Projects", url: "/admin/projects", icon: FolderKanban },
  { title: "Clients", url: "/admin/clients", icon: Building2 },
  { title: "Services", url: "/admin/services", icon: Wrench },
  { title: "FAQs", url: "/admin/faq", icon: HelpCircle },
  { title: "HSE", url: "/admin/hse", icon: ShieldCheck },
  { title: "Credentials", url: "/admin/credentials", icon: Award },
  { title: "Contact Management", url: "/admin/contact-management", icon: Mail },
  { title: "Settings", url: "/admin/settings", icon: SettingsIcon },
] as const;

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-zinc-950 text-white">
        <Sidebar collapsible="icon">
          <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
            <span className="font-bold tracking-wide">EPS CMS</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Manage</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => {
                    const isActive = pathname === item.url || pathname.startsWith(item.url + "/");
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center justify-between border-b border-zinc-800 px-4 bg-zinc-900">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <span className="text-sm text-slate-400">Content Management</span>
            </div>
            <div className="flex items-center gap-3">
              {email && <span className="text-sm text-slate-300 hidden sm:inline">{email}</span>}
              <Button
                size="sm"
                variant="outline"
                onClick={handleSignOut}
                className="border-zinc-700 text-slate-200 hover:bg-zinc-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
