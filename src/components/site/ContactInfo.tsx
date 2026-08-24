import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="lg:col-span-1 space-y-6" data-testid="contact-info">
      <Card className="bg-zinc-900 border border-zinc-800 border-l-4 border-l-cyan-400">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-cyan-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="text-cyan-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Office Address</h3>
              <p className="text-slate-300 leading-relaxed">
                EPS Projects Pvt. Ltd.
                <br />
                212, 2nd Floor, Ansal Chamber-2,
                <br />
                6 Bhikaji Cama Place,
                <br />
                New Delhi – 110 066
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border border-zinc-800 border-l-4 border-l-green-400">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="text-green-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Phone Numbers</h3>
              <div className="text-slate-300 space-y-3">
                <div>
                  <p className="font-medium text-foreground">Surender Chahal, Chief Operating Officer</p>
                  <a
                    href="tel:+919071970000"
                    className="hover:text-green-400 transition-colors block"
                  >
                    +91 90719 70000
                  </a>
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Digvijay Tanwar, Director
                  </p>
                  <a
                    href="tel:+919810731116"
                    className="hover:text-green-400 transition-colors block"
                  >
                    +91 98107 31116
                  </a>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border border-zinc-800 border-l-4 border-l-orange-400">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="text-orange-400" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Email Addresses</h3>
              <div className="text-slate-300 space-y-1">
                <a
                  href="mailto:info@epsprojects.in"
                  className="hover:text-orange-400 transition-colors block"
                >
                  info@epsprojects.in
                </a>
                <a
                  href="mailto:surender@epsprojects.in"
                  className="hover:text-orange-400 transition-colors block"
                >
                  surender@epsprojects.in
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
