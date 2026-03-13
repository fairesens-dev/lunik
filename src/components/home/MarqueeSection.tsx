import { useContent } from "@/contexts/ContentContext";

const MarqueeSection = () => {
  const { content } = useContent();
  const marqueeText = content.homepage.marqueeText;

  // Parse pills from marqueeText (separated by · or •)
  const pills = marqueeText
    .split(/[·•]/)
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <section className="py-0 overflow-hidden bg-accent">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center mx-0">
            {pills.map((pill, j) => (
              <div key={`${i}-${j}`} className="flex items-center">
                <span className="px-8 py-4 text-[13px] uppercase tracking-[0.2em] text-white/90 font-medium whitespace-nowrap">
                  {pill}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/30 flex-shrink-0" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
