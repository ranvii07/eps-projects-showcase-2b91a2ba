import { Loader2, ImageIcon } from "lucide-react";
import { useSignedUrl } from "@/lib/use-signed-url";

const BUCKET = "client-images";

export type ClientRow = {
  id: string;
  name: string;
  industry: string | null;
  logo_url: string | null;
  sort_order: number;
  published: boolean;
};

// Presentational, CMS-driven client card grid. Data (published, sort-ordered)
// is fetched by the caller — the /clients route and the homepage ClientsShowcase
// — mirroring the FeaturedProjects / routes.projects split. No hardcoded clients.
function ClientCard({ client, index }: { client: ClientRow; index: number }) {
  const { url, failed } = useSignedUrl(BUCKET, client.logo_url);

  return (
    <div
      data-testid={`client-item-${index}`}
      className="flex h-full flex-col items-center justify-start rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-center transition-colors duration-300 hover:border-cyan-400/50 hover:shadow-lg"
    >
      {/* Fixed-height logo zone: keeps every card uniform and centers the logo,
          which scales proportionally (object-contain) without distortion. */}
      <div className="mb-4 flex h-20 w-full items-center justify-center">
        {client.logo_url && !failed ? (
          url ? (
            <img
              src={url}
              alt={client.name}
              className="max-h-full max-w-full w-auto object-contain"
            />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
          )
        ) : (
          <ImageIcon className="h-8 w-8 text-zinc-500" />
        )}
      </div>
      <p className="font-medium text-slate-200">{client.name}</p>
    </div>
  );
}

export default function ClientsGrid({ clients }: { clients: ClientRow[] }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      data-testid="clients-grid"
    >
      {clients.map((client, index) => (
        <ClientCard key={client.id} client={client} index={index} />
      ))}
    </div>
  );
}
