import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, EyeOff, Loader2, MapPin } from "lucide-react";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";
import SignedImage from "@/components/site/SignedImage";
import { supabase } from "@/integrations/supabase/client";
import { SITE_SETTING_KEYS, fetchSiteSetting } from "@/lib/site-settings";

const BUCKET = "project-images";

// The two read paths (public gallery, token preview) are normalised onto this
// one shape so the rendering below is identical for both.
type GalleryImage = {
  id: string;
  project_id: string;
  project_name: string;
  image_url: string;
  caption: string | null;
  location: string | null;
  category: string | null;
  sort_order: number;
  is_cover: boolean;
  visibility: string;
};

// PostgREST returns a to-one embed as an object, but the generated types model
// some embeds as arrays; accept either rather than casting the whole row.
type EmbeddedProject = { name: string } | { name: string }[] | null;

const projectName = (embed: EmbeddedProject): string =>
  Array.isArray(embed) ? (embed[0]?.name ?? "") : (embed?.name ?? "");

export const Route = createFileRoute("/projects_/gallery")({
  // `?preview=<token>` opens a private-preview gallery for one project. Anything
  // else (absent, non-string) falls through to the normal public gallery.
  validateSearch: (search: Record<string, unknown>): { preview?: string } => ({
    preview: typeof search.preview === "string" && search.preview ? search.preview : undefined,
  }),
  // The gallery is publicly reachable only while the `project_gallery_enabled`
  // CMS toggle is on; otherwise the route 404s through the root's
  // notFoundComponent, so a shared or guessed URL reveals nothing. Runs in
  // beforeLoad rather than the component so the 404 is decided before render and
  // on the SSR pass too.
  //
  // A `?preview=<token>` request is exempt: those links are already gated by the
  // per-project preview_token + preview_enabled pair in the database, and being
  // able to show unpublished work to a client is the whole point of that
  // feature — including while the public gallery is still switched off.
  beforeLoad: async ({ search }) => {
    if (search.preview) return;
    // fetchSiteSetting fails closed, so a DB or network error also 404s.
    if (!(await fetchSiteSetting(SITE_SETTING_KEYS.projectGallery))) throw notFound();
  },
  head: () =>
    buildPageHead({
      title: "Project Gallery",
      description:
        "Site photographs from Electrical & Instrumentation projects executed by EPS Projects across power, sugar, distillery, ethanol, steel, cement, infrastructure, oil & gas, and hydro power sectors.",
      path: "/projects/gallery",
    }),
  component: ProjectGalleryPage,
});

function ProjectGalleryPage() {
  const navigate = useNavigate();
  const { preview } = Route.useSearch();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    (async () => {
      if (preview) {
        // Token path: RLS cannot see a query parameter, so the SECURITY DEFINER
        // accessor decides. An unknown, stale, or disabled token returns 0 rows.
        const { data, error } = await supabase.rpc("get_preview_gallery_images", {
          p_token: preview,
        });
        if (!active) return;
        if (error) setError(error.message);
        else setImages((data as GalleryImage[]) ?? []);
        setLoading(false);
        return;
      }

      // Public path: RLS already restricts this to published + public images
      // belonging to a published project. The explicit filters state the same
      // intent client-side, and `!inner` drops rows whose project is not visible.
      const { data, error } = await supabase
        .from("project_images")
        .select(
          "id,project_id,image_url,caption,location,category,sort_order,is_cover,visibility,projects!inner(name)",
        )
        .eq("published", true)
        .eq("visibility", "public")
        .order("sort_order", { ascending: true });
      if (!active) return;
      if (error) {
        setError(error.message);
      } else {
        const rows = (data ?? []) as unknown as Array<
          Omit<GalleryImage, "project_name"> & { projects: EmbeddedProject }
        >;
        setImages(
          rows.map(({ projects, ...row }) => ({ ...row, project_name: projectName(projects) })),
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [preview]);

  // Images are grouped under their project, preserving the sort_order the CMS set.
  // The cover is the project's thumbnail; it still appears in the grid below, so
  // marking a cover never removes an image from the gallery.
  const groups = useMemo(() => {
    const byProject = new Map<string, { name: string; images: GalleryImage[] }>();
    for (const image of images) {
      const group = byProject.get(image.project_id);
      if (group) group.images.push(image);
      else byProject.set(image.project_id, { name: image.project_name, images: [image] });
    }
    return [...byProject.entries()].map(([id, group]) => ({
      id,
      ...group,
      // Fall back to the first image so a project without an explicit cover still
      // gets a thumbnail.
      cover: group.images.find((i) => i.is_cover) ?? group.images[0],
    }));
  }, [images]);

  return (
    <div data-testid="project-gallery-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Project Gallery"
        subtitle="Photographs from our project sites — erection, installation, panel and commissioning work captured across the plants we deliver."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {preview && (
            <div
              className="mb-10 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3"
              data-testid="gallery-preview-banner"
            >
              <EyeOff className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-medium text-amber-300">Private preview</p>
                <p className="text-sm text-slate-300">
                  You are viewing a shared preview link. These images are not published on the
                  public website — please do not share this link further.
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12" data-testid="gallery-loading">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <p className="text-center text-red-400" data-testid="gallery-error">
              Failed to load the project gallery.
            </p>
          ) : groups.length === 0 ? (
            <div className="text-center max-w-2xl mx-auto" data-testid="gallery-empty-state">
              <div className="w-20 h-20 bg-cyan-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Camera className="text-cyan-400" size={40} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {preview ? "This preview link is no longer active" : "Project Gallery Coming Soon"}
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                {preview
                  ? "The link you followed has been disabled or replaced. Please ask your EPS contact for a current preview link."
                  : "We are curating photographs from our completed and ongoing project sites. In the meantime, browse the project directory or reach out to learn more about our project experience."}
              </p>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/contact" })}
                data-testid="gallery-contact-btn"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
              >
                Talk to Our Team
                <ArrowRight
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                  size={20}
                />
              </Button>
            </div>
          ) : (
            <div className="space-y-16" data-testid="gallery-groups">
              {groups.map((group) => (
                <div key={group.id} data-testid={`gallery-group-${group.id}`}>
                  <div className="flex items-center gap-4 mb-6">
                    {group.cover && (
                      <SignedImage
                        bucket={BUCKET}
                        path={group.cover.image_url}
                        alt={group.cover.caption ?? `${group.name} cover photograph`}
                        fit="object-cover"
                        className="h-14 w-20 shrink-0 rounded border border-zinc-800"
                      />
                    )}
                    <h2 className="text-2xl font-bold text-foreground">{group.name}</h2>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {group.images.map((image) => (
                      <Card
                        key={image.id}
                        className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                        data-testid={`gallery-image-card-${image.id}`}
                      >
                        <div className="aspect-video overflow-hidden">
                          <SignedImage
                            bucket={BUCKET}
                            path={image.image_url}
                            alt={image.caption ?? `${group.name} site photograph`}
                            fit="object-cover"
                            className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {(image.category || image.caption || image.location) && (
                          <CardContent className="pt-6">
                            {image.category && (
                              <span className="text-cyan-400 text-sm font-medium uppercase tracking-wide">
                                {image.category}
                              </span>
                            )}
                            {image.caption && (
                              <p className="text-slate-200 leading-relaxed mt-2">{image.caption}</p>
                            )}
                            {image.location && (
                              <p className="text-slate-400 text-sm mt-3 inline-flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5" />
                                {image.location}
                              </p>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
