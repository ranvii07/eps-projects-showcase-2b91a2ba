import { createFileRoute, useRouterState } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/$")({
  component: ComingSoonPage,
});

function ComingSoonPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segment = pathname.split("/").filter(Boolean).pop() ?? "section";
  const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
          <CardDescription className="text-slate-400">
            This admin section is part of EPS CMS and will be available soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <span className="inline-flex items-center rounded-full bg-cyan-400/10 text-cyan-400 px-2.5 py-0.5 text-xs font-medium">
            Coming soon
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
