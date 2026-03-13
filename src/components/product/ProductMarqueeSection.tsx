const pills = [
  "STORE COFFRE SUR-MESURE",
  "TOILE DICKSON",
  "ARMATURE ALUMINIUM",
  "MOTORISATION SOMFY",
  "ÉCLAIRAGE LED",
  "GARANTIE 5 ANS",
  "FABRIQUÉ EN FRANCE",
  "LIVRAISON 4-5 SEMAINES",
];

const ProductMarqueeSection = () => (
  <section className="py-4 overflow-hidden border-y border-border">
    <div className="flex animate-marquee whitespace-nowrap">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-4 mx-2">
          {pills.map((pill, j) => (
            <span
              key={`${i}-${j}`}
              className="inline-flex items-center border border-border rounded-full px-5 py-2 text-xs tracking-[0.15em] uppercase font-medium text-muted-foreground whitespace-nowrap"
            >
              {pill}
            </span>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default ProductMarqueeSection;
