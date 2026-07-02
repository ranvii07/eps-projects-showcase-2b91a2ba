import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type ClientRow = { id: string; name: string };

const ClientsBanner = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [clients, setClients] = useState<ClientRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("id,name")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(20);
      if (cancelled) return;
      if (error) {
        setError(error.message);
        setClients([]);
      } else {
        setClients((data as ClientRow[]) ?? []);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || !clients || clients.length === 0) return;

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
  }, [clients]);

  return (
    <section className="py-16 bg-white border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-4">
          Trusted by Leading Organizations
        </h2>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      <div className="relative overflow-hidden">
        {clients === null ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        ) : error ? (
          <p className="text-center text-slate-500 py-6">
            Unable to load clients at the moment.
          </p>
        ) : clients.length === 0 ? (
          <p className="text-center text-slate-500 py-6">No clients available.</p>
        ) : (
          <div
            ref={scrollRef}
            className="flex space-x-12 overflow-x-hidden"
            style={{ scrollBehavior: "auto" }}
          >
            {[...clients, ...clients].map((client, index) => (
              <div
                key={`${client.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center bg-slate-50 rounded-lg px-8 py-6 min-w-[280px] border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <p className="text-slate-700 font-semibold text-center whitespace-nowrap">
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsBanner;
