import { useContent } from "@/contexts/ContentContext";

const MarqueeSection = () => {
  const { content } = useContent();

  return (
    <section className="bg-gradient-to-r from-primary via-accent-light to-primary text-white py-3 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[0, 1].map((i) => (
          <span key={i} className="text-xs tracking-[0.3em] uppercase font-sans font-medium mx-0">
            {content.homepage.marqueeText}
          </span>
        ))}
      </div>
    </section>
  );
};

export default MarqueeSection;
