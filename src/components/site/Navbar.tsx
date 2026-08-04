import { useState, useEffect } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SITE_SETTING_KEYS, useSiteSetting } from "@/lib/site-settings";

// The Projects entry is ALWAYS a dropdown over the Projects subpages — the
// navbar's structure does not change with content. The `project_gallery_enabled`
// CMS toggle controls only whether Project Gallery is one of the items, so with
// the gallery off the menu still opens and offers Project Directory alone.
const PROJECT_DIRECTORY = { name: "Project Directory", to: "/projects" } as const;
const PROJECT_GALLERY = { name: "Project Gallery", to: "/projects/gallery" } as const;

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Services", to: "/services" },
  { name: "Industries", to: "/industries" },
  { name: "Why Choose Us", to: "/why-choose-us" },
  { name: "Projects", to: "/projects" },
  { name: "Clients", to: "/clients" },
] as const;

const testId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Fails closed while loading, so the gallery link never flashes in and out.
  const { enabled: galleryEnabled } = useSiteSetting(SITE_SETTING_KEYS.projectGallery);

  const projectLinks = galleryEnabled ? [PROJECT_DIRECTORY, PROJECT_GALLERY] : [PROJECT_DIRECTORY];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActivePath = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  const linkClass = (to: string) =>
    `font-medium transition-colors duration-200 text-sm uppercase tracking-wide ${
      isActivePath(to) ? "text-cyan-400" : "text-slate-200 hover:text-cyan-400"
    }`;

  const mobileLinkClass = (to: string) =>
    `block font-medium py-2 transition-colors ${
      isActivePath(to) ? "text-cyan-400" : "text-slate-200 hover:text-cyan-400"
    }`;

  return (
    <nav
      className={`dark fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-surface-solid shadow-lg" : "nav-surface backdrop-blur-md"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center" data-testid="navbar-logo">
            <img src="/eps-logo.png" alt="EPS Projects Logo" className="h-12 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.name === "Projects" ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger
                    className={`${linkClass(link.to)} inline-flex items-center gap-1 outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-sm`}
                    data-testid="nav-link-projects"
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4" aria-hidden="true" />
                  </DropdownMenuTrigger>
                  {/* Portalled outside the nav, so it re-declares `dark` and the
                      nav's own surface treatment to stay visually continuous. */}
                  <DropdownMenuContent
                    align="start"
                    className="dark nav-surface-solid border-slate-700 min-w-52"
                    data-testid="nav-projects-menu"
                  >
                    {projectLinks.map((child) => (
                      <DropdownMenuItem key={child.to} asChild>
                        <Link
                          to={child.to}
                          className={`w-full cursor-pointer text-sm font-medium ${
                            pathname === child.to
                              ? "text-cyan-400"
                              : "text-slate-200 focus:text-cyan-400"
                          }`}
                          data-testid={`nav-projects-menu-${testId(child.name)}`}
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.name}
                  to={link.to}
                  className={linkClass(link.to)}
                  data-testid={`nav-link-${testId(link.name)}`}
                >
                  {link.name}
                </Link>
              ),
            )}
            <Button
              onClick={() => navigate({ to: "/contact" })}
              data-testid="nav-contact-btn"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Contact Us
            </Button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-200 hover:text-cyan-400 transition-colors"
              data-testid="mobile-menu-toggle"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden nav-surface-solid border-t border-slate-700 shadow-lg"
          data-testid="mobile-menu"
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) =>
              // No popup on mobile: the sub-pages are listed inline under a
              // non-interactive "Projects" heading, which is how a drawer menu
              // normally renders a nested group. Rendered unconditionally, to
              // match the desktop dropdown.
              link.name === "Projects" ? (
                <div key={link.name} data-testid="mobile-nav-projects-group">
                  <p className="font-medium py-2 text-sm uppercase tracking-wide text-slate-400">
                    {link.name}
                  </p>
                  <div className="pl-4 border-l border-slate-700 space-y-1">
                    {projectLinks.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block font-medium py-2 transition-colors ${
                          pathname === child.to
                            ? "text-cyan-400"
                            : "text-slate-200 hover:text-cyan-400"
                        }`}
                        data-testid={`mobile-nav-link-${testId(child.name)}`}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={mobileLinkClass(link.to)}
                  data-testid={`mobile-nav-link-${testId(link.name)}`}
                >
                  {link.name}
                </Link>
              ),
            )}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate({ to: "/contact" });
              }}
              data-testid="mobile-nav-contact-btn"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Contact Us
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
