import { createFileRoute } from "@tanstack/react-router";
import { buildPageHead } from "@/lib/site";
import PageHeader from "@/components/site/PageHeader";
import ClientsBanner from "@/components/site/ClientsBanner";

const clients = [
  "NANDADEVI BIO ENERGY LLP",
  "RUNGTA MINES LTD",
  "DCM SHRIRAM LTD",
  "NIKA CG",
  "Triveni Engineering & Ind. Ltd.",
  "BANNARI AMMAN SUGARS LTD",
  "BALRAMPUR CHINI MILLS",
  "NSL SUGARS LTD",
  "Aditya Birla Group",
  "THIRU MAVADI BIO ENERGY",
  "RADICO NV DISTILLERY",
  "THERMAX INST. LTD",
  "DAFFPL",
  "Dalmia Bharat Sugar & Ind. Ltd.",
  "INDIAN OIL SKY TANKING",
  "JSW - BHUSHAN POWER & STEEL LTD",
  "EPSILON CARBON",
  "FIVES CAIL KCP LTD",
  "INDIANA SUCROTECH",
  "Kraft Technysys",
];

export const Route = createFileRoute("/clients")({
  head: () =>
    buildPageHead({
      title: "Clients",
      description:
        "EPS Projects is trusted by leading organizations across power, sugar, distillery, steel, and infrastructure sectors, including Triveni Engineering, DCM Shriram, JSW, and Aditya Birla Group.",
      path: "/clients",
    }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <div data-testid="clients-page" className="bg-zinc-950 min-h-screen">
      <PageHeader
        title="Our Clients"
        subtitle="We are proud to partner with leading organizations across power, sugar, distillery, steel, and infrastructure industries throughout India and beyond."
      />

      <ClientsBanner />

      <section className="py-20 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="clients-grid">
            {clients.map((client, index) => (
              <div
                key={client}
                data-testid={`client-item-${index}`}
                className="flex items-center justify-center text-center bg-zinc-900 border border-zinc-800 rounded-lg px-6 py-8 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
              >
                <p className="text-slate-200 font-medium">{client}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
