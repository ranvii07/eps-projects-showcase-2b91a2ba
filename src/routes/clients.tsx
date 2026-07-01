import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ImageIcon } from "lucide-react";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";
import ClientsBanner from "@/components/site/ClientsBanner";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "client-images";

type ClientRow = {
  id: string;
  name: string;
  industry: string | null;
  logo_url: string | null;
  sort_order: number;
  published: boolean;
};

export const Route = createFileRoute("/clients")({
  head: () =>
    buildPageHead({
      title: "Clients",
      description:
        "EPS Projects is trusted by leading organizations across power, sugar, distillery, steel, and infrastructure sectors, including Triveni Engineering, DCM Shriram, JSW, and Aditya Birla Group.",
      path: "/clients",
    }),
  component: ClientsPage,
});

function SignedLogo({ path, alt }: { path: string | null; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setUrl(null);
    if (!path) return;
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 10)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      active = false;
    };
  }, [path]);
  if (!path)
    return (
      <div className="flex items-center justify-center h-12 w-full text-zinc-600">
        <ImageIcon className="h-5 w-5" />
      </div>
    );
  if (!url)
    return (
      <div className="flex items-center justify-center h-12 w-full">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
      </div>
    );
  return <img src={url} alt={alt} className="max-h-12 w-auto object-contain" />;
}

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

      <ClientsBanner />

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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="clients-grid">
              {clients.map((client, index) => (
                <div
                  key={client.id}
                  data-testid={`client-item-${index}`}
                  className="flex flex-col items-center justify-center gap-3 text-center bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-8 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
                >
                  {client.logo_url && <SignedLogo path={client.logo_url} alt={client.name} />}
                  <p className="text-slate-200 font-medium">{client.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
