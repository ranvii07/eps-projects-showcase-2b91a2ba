const STATS = [
  { value: "25+", label: "Years of Team Experience" },
  { value: "1000+", label: "Projects Delivered" },
  { value: "₹100 Cr+", label: "Revenue in Last 5 Years" },
  { value: "150+", label: "Technical Workforce (incl. 25+ Core Engineers)" },
  { value: "PAN India", label: "Execution Reach" },
  { value: "100%", label: "Turnkey Capability" },
];

const CompanyStats = () => {
  return (
    <section data-testid="company-stats" className="bg-zinc-900 border-y border-zinc-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl md:text-4xl font-bold text-cyan-400 leading-tight">
                {stat.value}
              </div>
              <div className="text-sm text-slate-300 mt-2 leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyStats;
