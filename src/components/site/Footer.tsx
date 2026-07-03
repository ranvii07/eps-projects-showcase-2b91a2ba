import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", to: "/" },
    { name: "About Us", to: "/about" },
    { name: "Services", to: "/services" },
    { name: "Why Choose Us", to: "/why-choose-us" },
    { name: "Projects", to: "/projects" },
    { name: "Clients", to: "/clients" },
    { name: "Contact", to: "/contact" },
  ] as const;

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Link to="/" data-testid="footer-logo">
              <img
                src="https://customer-assets.emergentagent.com/job_engineeringsps/artifacts/vuj1ba3q_edit1%20epsp%20%281%29.png"
                alt="EPS Projects Logo"
                className="h-12 w-auto mb-4 brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 leading-relaxed mb-4">
              Leading provider of Electrical &amp; Instrumentation engineering solutions with over 25 years of industry experience.
            </p>
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
                  212, Ansal Chambers - II,<br />
                  Bhikaji Cama Place,<br />
                  New Delhi – 110 066
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="text-cyan-400 flex-shrink-0 mt-1" size={18} />
                <div className="text-slate-400 text-sm">
                  <a href="tel:+919810731116" className="hover:text-cyan-400 transition-colors block">
                    +91 98107-31116
                  </a>
                  <a href="tel:+919315617532" className="hover:text-cyan-400 transition-colors block">
                    +91 93156 17532
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="text-cyan-400 flex-shrink-0 mt-1" size={18} />
                <div className="text-slate-400 text-sm">
                  <a href="mailto:dvt@epsprojects.in" className="hover:text-cyan-400 transition-colors block">
                    dvt@epsprojects.in
                  </a>
                  <a href="mailto:info@epsprojects.in" className="hover:text-cyan-400 transition-colors block">
                    info@epsprojects.in
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
    </footer>
  );
};

export default Footer;
