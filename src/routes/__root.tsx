import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_NAME, SITE_URL, SITE_LOGO } from "@/lib/site";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import ScrollToTop from "@/components/site/ScrollToTop";
import { Toaster } from "@/components/ui/sonner";

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  alternateName: "EPS Projects",
  url: SITE_URL,
  logo: SITE_LOGO,
  description:
    "EPS Projects Pvt. Ltd. is a leading Electrical & Instrumentation Project Solutions company providing integrated engineering, supply, installation, testing, commissioning, and automation services for industrial and clean-energy projects across India.",
  foundingDate: "2021",
  founder: { "@type": "Person", name: "Digvijay Tanwar" },
  address: {
    "@type": "PostalAddress",
    streetAddress: "212, Ansal Chambers - II, Bhikaji Cama Place",
    addressLocality: "New Delhi",
    postalCode: "110066",
    addressCountry: "IN",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-98107-31116",
      contactType: "sales",
      email: "info@epsprojects.in",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  ],
  email: "info@epsprojects.in",
  areaServed: "India",
  knowsAbout: [
    "Electrical Engineering",
    "Instrumentation Engineering",
    "Industrial Automation",
    "PLC, DCS and SCADA Solutions",
    "Installation, Testing and Commissioning",
    "Clean Energy Projects",
  ],
};

function NotFoundComponent() {
  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-cyan-400 mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-slate-300 text-lg mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold text-white">This page didn't load</h1>
        <p className="mt-2 text-slate-300">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#000000" },
      { title: `${SITE_NAME} | Electrical & Instrumentation Solutions` },
      {
        name: "description",
        content:
          "EPS Projects Pvt. Ltd. delivers integrated Electrical & Instrumentation solutions for industrial and clean-energy projects across India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORG_JSON_LD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-zinc-950 text-white">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdminArea = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollToTop />
      {isAdminArea ? (
        <Outlet />
      ) : (
        <>
          <Navbar />
          <main data-testid="page-main">
            <Outlet />
          </main>
          <Footer />
        </>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
