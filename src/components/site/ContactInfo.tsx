import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactInfo = () => {
  return (
    <div className="lg:col-span-1 space-y-6" data-testid="contact-info">
      <Card className="border-l-4 border-blue-600">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Office Address</h3>
              <p className="text-slate-600 leading-relaxed">
                EPS Projects Private Ltd.<br />
                212, Ansal Chambers - II,<br />
                Bhikaji Cama Place,<br />
                New Delhi – 110 066
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-green-600">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Phone className="text-green-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Phone Numbers</h3>
              <p className="text-slate-600">
                <a href="tel:+919810731116" className="hover:text-green-600 transition-colors block">
                  +91 98107-31116
                </a>
                <a href="tel:+919315617532" className="hover:text-green-600 transition-colors block">
                  +91 93156 17532
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-orange-600">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="text-orange-600" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-2">Email Addresses</h3>
              <p className="text-slate-600">
                <a href="mailto:dvt@epsprojects.in" className="hover:text-orange-600 transition-colors block">
                  dvt@epsprojects.in
                </a>
                <a href="mailto:info@epsprojects.in" className="hover:text-orange-600 transition-colors block">
                  info@epsprojects.in
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactInfo;
