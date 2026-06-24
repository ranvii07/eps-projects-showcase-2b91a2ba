import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const sections = [
  { title: "Projects", description: "Manage project showcase entries." },
  { title: "Clients", description: "Manage client logos and listings." },
  { title: "Services", description: "Manage service offerings." },
  { title: "FAQs", description: "Manage frequently asked questions." },
  { title: "HSE Content", description: "Manage HSE / safety content." },
  { title: "Credentials", description: "Manage CIN, GST, ISO, MSME details." },
  { title: "Contact Submissions", description: "Review enquiries from the website." },
  { title: "Settings", description: "Site-wide settings and metadata." },
];

export const Route = createFileRoute("/_authenticated/admin/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome to EPS CMS</h1>
        <p className="text-slate-400 mt-1">Manage your website content from one place.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Card key={section.title} className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white text-lg">{section.title}</CardTitle>
              <CardDescription className="text-slate-400">{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="inline-flex items-center rounded-full bg-cyan-400/10 text-cyan-400 px-2.5 py-0.5 text-xs font-medium">
                Coming soon
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
