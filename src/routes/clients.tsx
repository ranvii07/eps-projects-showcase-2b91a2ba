import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";
import ClientsGrid, { type ClientRow } from "@/components/site/ClientsGrid";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/clients")({
  head: () =>
    buildPageHead({
      title: "Clients",
      description:
        "EPS Projects is trusted by leading organizations across power, sugar, distillery, steel, and infrastructure sectors throughout India — delivering integrated Electrical & Instrumentation project solutions.",
      path: "/clients",
    }),
  component: ClientsPage,
});

function ClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id,name,industry,logo_url,sort_order,published")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setClients((data as ClientRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div data-testid="clients-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Our Clients"
        subtitle="We are proud to partner with leading organizations across power, sugar, distillery, steel, and infrastructure industries throughout India and beyond."
      />

      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12" data-testid="clients-loading">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <p className="text-center text-red-400" data-testid="clients-error">
              Failed to load clients.
            </p>
          ) : clients.length === 0 ? (
            <p className="text-center text-slate-400" data-testid="clients-empty">
              No clients available.
            </p>
          ) : (
            <ClientsGrid clients={clients} />
          )}
        </div>
      </section>
    </div>
  );
}
