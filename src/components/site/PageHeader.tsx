type Props = {
  title: string;
  subtitle?: string;
};

export const PageHeader = ({ title, subtitle }: Props) => {
  return (
    <section
      className="relative bg-black pt-32 pb-16 border-b border-zinc-800"
      data-testid="page-header"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/60 to-black"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          className="text-4xl sm:text-5xl font-bold text-white mb-4"
          data-testid="page-header-title"
        >
          {title}
        </h1>
        <div className="w-24 h-1 bg-cyan-400 mx-auto mb-6"></div>
        {subtitle && (
          <p className="text-base md:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default PageHeader;
