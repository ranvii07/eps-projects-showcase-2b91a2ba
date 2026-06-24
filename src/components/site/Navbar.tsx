import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "About", to: "/about" },
  { name: "Services", to: "/services" },
  { name: "Why Choose Us", to: "/why-choose-us" },
  { name: "Projects", to: "/projects" },
  { name: "Clients", to: "/clients" },
  { name: "Contact", to: "/contact" },
] as const;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (to: string) => {
    const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return `font-medium transition-colors duration-200 text-sm uppercase tracking-wide ${
      isActive ? "text-cyan-400" : "text-slate-200 hover:text-cyan-400"
    }`;
  };

  const mobileLinkClass = (to: string) => {
    const isActive = to === "/" ? pathname === "/" : pathname.startsWith(to);
    return `block font-medium py-2 transition-colors ${
      isActive ? "text-cyan-400" : "text-slate-200 hover:text-cyan-400"
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black shadow-lg shadow-cyan-500/20" : "bg-black/95 backdrop-blur-md"
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center" data-testid="navbar-logo">
            <img
              src="https://customer-assets.emergentagent.com/job_engineeringsps/artifacts/vuj1ba3q_edit1%20epsp%20%281%29.png"
              alt="EPS Projects Logo"
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={linkClass(link.to)}
                data-testid={`nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              onClick={() => navigate({ to: "/contact" })}
              data-testid="nav-get-quote-btn"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Get Quote
            </Button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-200 hover:text-cyan-400 transition-colors"
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-black border-t border-slate-700 shadow-lg" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileLinkClass(link.to)}
                data-testid={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {link.name}
              </Link>
            ))}
            <Button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigate({ to: "/contact" });
              }}
              data-testid="mobile-nav-get-quote-btn"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get Quote
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
