import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSignedUrl } from "@/lib/use-signed-url";

const BUCKET = "project-images";

type ProjectRow = {
  id: string;
  name: string;
  industry: string | null;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  published: boolean;
};

// Same presentational wrapper the /projects route uses locally, backed by the
// shared useSignedUrl hook (T0.3). Kept in sync with routes/projects.tsx so the
// homepage teaser cards match the /projects card styling exactly.
function SignedProjectImage({ path, alt }: { path: string; alt: string }) {
  const { url, failed } = useSignedUrl(BUCKET, path);
  if (failed)
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
        <ImageIcon className="h-8 w-8 text-zinc-700" />
      </div>
    );
  if (!url)
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-800">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
      </div>
    );
  return (
    <img
      src={url}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
    />
  );
}

const FeaturedProjects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id,name,industry,description,image_url,sort_order,published")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(3);
      if (!active) return;
      if (error) setProjects([]);
      else setProjects((data as ProjectRow[]) ?? []);
    })();
    return () => {
      active = false;
    };
  }, []);

  // Hidden entirely until at least one published project exists (also covers the
  // not-yet-loaded and error states) — safe to keep mounted pre-seeding.
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-20 bg-black" data-testid="featured-projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          data-testid="featured-projects-grid"
        >
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
              data-testid={`featured-project-card-${project.id}`}
            >
              {project.image_url && (
                <div className="aspect-video overflow-hidden">
                  <SignedProjectImage path={project.image_url} alt={project.name} />
                </div>
              )}
              <CardContent className="pt-6">
                {project.industry && (
                  <span className="text-cyan-400 text-sm font-medium uppercase tracking-wide">
                    {project.industry}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mt-2 mb-3">{project.name}</h3>
                {project.description && (
                  <p className="text-slate-300 leading-relaxed">{project.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={() => navigate({ to: "/projects" })}
            data-testid="featured-projects-view-all-btn"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
          >
            View All Projects
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;
