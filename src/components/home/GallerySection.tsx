import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const heights = ["h-80", "h-64", "h-72", "h-64", "h-80", "h-72"];

const GallerySection = () => {
  const { content } = useContent();
  const items = (content.homepage.galleryItems || []).filter(i => i.active);

  if (items.length === 0) return null;

  return (
    <section className="pt-20 pb-6 lg:pt-28 lg:pb-6">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
              Galerie
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight whitespace-pre-line">
              {content.homepage.galleryTitle || "Installés\npar nos clients"}
            </h2>
          </div>
        </AnimatedSection>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.08}>
              <div className={`${heights[i % heights.length]} overflow-hidden rounded-2xl break-inside-avoid relative group`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 pt-8 rounded-b-2xl">
                    <p className="text-background text-sm font-medium">{item.caption}</p>
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
