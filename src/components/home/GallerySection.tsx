import AnimatedSection from "@/components/AnimatedSection";
import { useContent } from "@/contexts/ContentContext";

const heights = ["h-80", "h-64", "h-72", "h-64", "h-80", "h-72"];

const GallerySection = () => {
  const { content } = useContent();
  const items = (content.homepage.galleryItems || []).filter(i => i.active);

  if (items.length === 0) return null;

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-4">
              Ils ont sauté <span className="text-primary">le pas</span>
            </h2>
            <p className="text-muted-foreground text-sm">Quelques réalisations parmi nos clients satisfaits</p>
          </div>
        </AnimatedSection>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
          {items.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.1}>
              <div className={`${heights[i % heights.length]} overflow-hidden rounded-xl break-inside-avoid relative group`}>
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 to-transparent p-4 pt-8 rounded-b-xl">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
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
