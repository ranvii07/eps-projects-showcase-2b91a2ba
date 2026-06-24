import { useEffect, useRef } from "react";

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

const ClientsBanner = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0;
      }
      scrollContainer.scrollLeft = scrollPosition;
    };

    const intervalId = setInterval(scroll, 20);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-4">
          Trusted by Leading Organizations
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex space-x-12 overflow-x-hidden"
          style={{ scrollBehavior: "auto" }}
        >
          {[...clients, ...clients].map((client, index) => (
            <div
              key={`${client}-${index}`}
              className="flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-lg px-8 py-6 min-w-[280px] border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <p className="text-slate-700 font-semibold text-center whitespace-nowrap">{client}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientsBanner;
