const marqueeText = "FABRIQUÉ EN FRANCE · SUR-MESURE · LIVRAISON 4-5 SEMAINES · GARANTIE 5 ANS · MOTORISATION SOMFY · TOILE DICKSON · MADE IN FRANCE · ";

const MarqueeSection = () => (
  <section className="bg-primary text-primary-foreground py-3 overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {[0, 1].map((i) => (
        <span key={i} className="text-xs tracking-[0.3em] uppercase font-sans font-medium mx-0">
          {marqueeText}
        </span>
      ))}
    </div>
  </section>
);

export default MarqueeSection;
