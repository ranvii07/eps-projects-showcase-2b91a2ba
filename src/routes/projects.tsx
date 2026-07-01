import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowRight, Loader2 } from "lucide-react";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";
import { supabase } from "@/integrations/supabase/client";

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

export const Route = createFileRoute("/projects")({
  head: () =>
    buildPageHead({
      title: "Projects",
      description:
        "Explore Electrical & Instrumentation projects executed by EPS Projects across power, sugar, distillery, ethanol, steel, cement, infrastructure, oil & gas, and hydro power sectors.",
      path: "/projects",
    }),
  component: ProjectsPage,
});

function SignedProjectImage({ path, alt }: { path: string; alt: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setUrl(null);
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

function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id,name,industry,description,image_url,sort_order,published")
        .eq("published", true)
        .order("sort_order", { ascending: true });
      if (!active) return;
      if (error) setError(error.message);
      else setProjects((data as ProjectRow[]) ?? []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div data-testid="projects-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Our Projects"
        subtitle="A showcase of Electrical & Instrumentation projects delivered across diverse industrial and clean-energy sectors. Detailed case studies will be published here soon."
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-12" data-testid="projects-loading">
              <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
            </div>
          ) : error ? (
            <p className="text-center text-red-400" data-testid="projects-error">
              Failed to load projects.
            </p>
          ) : projects.length === 0 ? (
            <div className="text-center max-w-2xl mx-auto" data-testid="projects-empty-state">
              <div className="w-20 h-20 bg-cyan-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Building2 className="text-cyan-400" size={40} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Project Showcase Coming Soon
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                We are currently curating detailed case studies of our completed and ongoing
                projects across power, sugar, distillery, ethanol, steel, cement, infrastructure,
                oil &amp; gas, and hydro power sectors. In the meantime, reach out to learn more
                about our project experience.
              </p>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/contact" })}
                data-testid="projects-contact-btn"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg group"
              >
                Talk to Our Team
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="projects-grid">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden bg-zinc-900 border-zinc-800 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2"
                  data-testid={`project-card-${project.id}`}
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
          )}
        </div>
      </section>
    </div>
  );
}
