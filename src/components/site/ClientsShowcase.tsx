import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ClientsGrid, { type ClientRow } from "@/components/site/ClientsGrid";

// Homepage client teaser: a capped, static card grid (replaces the old marquee).
// Mirrors FeaturedProjects — fetches its own published, sort-ordered rows and
// hides the whole section until at least one client exists (safe pre-seeding).
const ClientsShowcase = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRow[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id,name,industry,logo_url,sort_order,published")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(10);
      if (!active) return;
      if (error) setClients([]);
      else setClients((data as ClientRow[]) ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  if (!clients || clients.length === 0) return null;

  return (
    <section className="py-20 bg-zinc-950" data-testid="home-clients">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Leading Industrial Clients
          </h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
        </div>

        <ClientsGrid clients={clients} />

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate({ to: "/clients" })}
            data-testid="home-clients-view-all-btn"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
          >
            View All Clients
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ClientsShowcase;
