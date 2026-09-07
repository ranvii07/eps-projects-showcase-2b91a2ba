import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SITE_SETTING_KEYS, useSiteSetting } from "@/lib/site-settings";

type CredentialRow = { id: string; kind: string; label: string | null; value: string | null };

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [credentials, setCredentials] = useState<CredentialRow[]>([]);
  // Same CMS toggle the navbar uses: while the gallery is off it must not be
  // linked from anywhere public, footer included.
  const { enabled: galleryEnabled } = useSiteSetting(SITE_SETTING_KEYS.projectGallery);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("company_credentials")
        .select("id,kind,label,value")
        .eq("published", true)
        .in("kind", ["CIN", "PAN", "GSTIN"])
        .order("sort_order", { ascending: true });
      if (!active) return;
      setCredentials(((data as CredentialRow[]) ?? []).filter((c) => c.value));
    })();
    return () => {
      active = false;
    };
  }, []);

  // Filtered rather than conditionally spread so the entries keep their literal
  // `to` types, which is what <Link to> type-checks against.
  const quickLinks = (
    [
      { name: "Home", to: "/" },
      { name: "About Us", to: "/about" },
      { name: "Services", to: "/services" },
      { name: "Industries", to: "/industries" },
      { name: "Projects", to: "/projects" },
      { name: "Project Gallery", to: "/projects/gallery" },
      { name: "Clients", to: "/clients" },
      { name: "Contact", to: "/contact" },
    ] as const
  ).filter((link) => galleryEnabled || link.to !== "/projects/gallery");

  return (
    <footer className="dark bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" data-testid="footer-logo">
              <img
                src="/eps-logo.png"
                alt="EPS Projects Logo"
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed mb-4">
              Leading provider of Electrical &amp; Instrumentation engineering solutions, backed by
              a leadership team with over 25 years of industry experience.
            </p>

            {/* ISO 9001:2015 trust badge — a transparent SVG printed directly
             * onto the footer: no plate, border, shadow or padding, so it reads
             * as an integrated certification mark rather than a pasted sticker.
             * The mark keeps its own blue; the white globe/ISO/9001 knockouts
             * are real white fills (not background holes), so they stay white on
             * the dark footer. my-8 gives generous air above and below. */}
            <img
              src="/iso-9001-2015.svg"
              alt="ISO 9001:2015 certified company"
              className="my-8 w-20"
              loading="lazy"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    className="text-slate-400 hover:text-cyan-400 transition-colors"
                    data-testid={`footer-link-${link.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Our Services</h3>
            <ul className="space-y-2 text-slate-400">
              <li>Electrical Engineering</li>
              <li>Instrumentation Engineering</li>
              <li>Project Management</li>
              <li>Design &amp; Consulting</li>
              <li>Installation &amp; Commissioning</li>
              <li>Maintenance &amp; Support</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin className="text-cyan-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-slate-400 text-sm">
                  212, 2nd Floor, Ansal Chamber-2,
                  <br />
                  6 Bhikaji Cama Place,
                  <br />
                  New Delhi – 110 066
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-cyan-400 flex-shrink-0 mt-1" size={18} />
                <div className="text-slate-400 text-sm space-y-2">
                  <div>
                    <span className="block text-slate-300">Surender Chahal, Chief Operating Officer</span>
                    <a
                      href="tel:+919071970000"
                      className="hover:text-cyan-400 transition-colors block"
                    >
                      +91 90719 70000
                    </a>
                  </div>
                  <div>
                    <span className="block text-slate-300">
                      Digvijay Tanwar, Director
                    </span>
                    <a
                      href="tel:+919810731116"
                      className="hover:text-cyan-400 transition-colors block"
                    >
                      +91 98107 31116&nbsp;
                    </a>
                  </div>
                  <div>
                    <span className="block text-slate-300">
                      Purnima Bhandari, Technical Project
                    </span>
                    <a
                      href="tel:+917678531008"
                      className="hover:text-cyan-400 transition-colors block"
                    >
                      +91 76785 31008
                    </a>
                  </div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="text-cyan-400 flex-shrink-0 mt-1" size={18} />
                <div className="text-slate-400 text-sm space-y-1">
                  <a
                    href="mailto:info@epsprojects.in"
                    className="hover:text-cyan-400 transition-colors block"
                  >
                    info@epsprojects.in
                  </a>
                  <a
                    href="mailto:surender@epsprojects.in"
                    className="hover:text-cyan-400 transition-colors block"
                  >
                    surender@epsprojects.in
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8">
          {credentials.length > 0 && (
            <p
              className="text-slate-500 text-xs text-center md:text-left mb-4"
              data-testid="footer-credentials"
            >
              {credentials.map((c) => `${c.label || c.kind}: ${c.value}`).join("  •  ")}
            </p>
          )}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm text-center md:text-left">
              © {currentYear} EPS Projects Private Limited. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                to="/privacy"
                className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                data-testid="footer-link-privacy"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-slate-400 hover:text-cyan-400 transition-colors text-sm"
                data-testid="footer-link-terms"
              >
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
