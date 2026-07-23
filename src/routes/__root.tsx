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

// Shared across the Organization + LocalBusiness schemas so both emit the same
// T3.9-approved public contact roster (Delhi corporate office; two leadership
// numbers; info@ + surender@). Address is the §7.10 canonical wording.
const POSTAL_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "212, 2nd Floor, Ansal Chamber-2, 6 Bhikaji Cama Place",
  addressLocality: "New Delhi",
  addressRegion: "Delhi",
  postalCode: "110066",
  addressCountry: "IN",
} as const;

const CONTACT_POINTS = [
  {
    "@type": "ContactPoint",
    telephone: "+919810731116",
    contactType: "sales",
    email: "info@epsprojects.in",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
  {
    "@type": "ContactPoint",
    telephone: "+919071970000",
    contactType: "customer service",
    email: "surender@epsprojects.in",
    areaServed: "IN",
    availableLanguage: ["en", "hi"],
  },
] as const;

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "EPS Projects",
  url: SITE_URL,
  logo: SITE_LOGO,
  description:
    "EPS Projects Pvt. Ltd. is a leading Electrical & Instrumentation Project Solutions company providing integrated engineering, supply, installation, testing, commissioning, and automation services for industrial and clean-energy projects across India.",
  foundingDate: "2021",
  founder: { "@type": "Person", name: "Digvijay Tanwar" },
  address: POSTAL_ADDRESS,
  contactPoint: CONTACT_POINTS,
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

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#localbusiness`,
  name: SITE_NAME,
  alternateName: "EPS Projects",
  url: SITE_URL,
  logo: SITE_LOGO,
  image: SITE_LOGO,
  email: "info@epsprojects.in",
  telephone: "+919810731116",
  foundingDate: "2021",
  parentOrganization: { "@id": `${SITE_URL}/#organization` },
  address: POSTAL_ADDRESS,
  areaServed: "IN",
  contactPoint: CONTACT_POINTS,
};

function NotFoundComponent() {
  return (
    <div className="dark bg-zinc-950 min-h-screen flex items-center justify-center px-4">
      {/* React 19 hoists these into <head>; gives the 404 its own metadata
          instead of inheriting the sitewide root title/description. */}
      <title>404 | EPS Projects</title>
      <meta
        name="description"
        content="The page you are looking for doesn't exist or has been moved. Return to the EPS Projects homepage."
      />
      <meta name="robots" content="noindex" />
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
    <div className="dark bg-zinc-950 min-h-screen flex items-center justify-center px-4">
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
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(ORG_JSON_LD),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
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
      <body className="bg-zinc-950 text-foreground">
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
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:font-medium focus:text-white focus:shadow-lg"
          >
            Skip to main content
          </a>
          <Navbar />
          <main
            id="main-content"
            tabIndex={-1}
            data-testid="page-main"
            className="focus:outline-none"
          >
            <Outlet />
          </main>
          <Footer />
        </>
      )}
      <Toaster />
    </QueryClientProvider>
  );
}
