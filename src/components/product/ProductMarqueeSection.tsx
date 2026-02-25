const text = "STORE COFFRE SUR-MESURE · TOILE DICKSON · ARMATURE ALUMINIUM · MOTORISATION SOMFY · ÉCLAIRAGE LED · GARANTIE 5 ANS · FABRIQUÉ EN FRANCE · LIVRAISON 4-5 SEMAINES · ";

const ProductMarqueeSection = () => (
  <section className="bg-primary text-primary-foreground py-3 overflow-hidden">
    <div className="flex animate-marquee whitespace-nowrap">
      {[0, 1].map((i) => (
        <span key={i} className="text-xs tracking-[0.3em] uppercase font-sans font-medium mx-0">
          {text}
        </span>
      ))}
    </div>
  </section>
);

export default ProductMarqueeSection;
