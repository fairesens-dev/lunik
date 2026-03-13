const pills = [
  "Trustpilot 4.9/5",
  "Fabriqué en France",
  "Garantie 5 ans",
  "Toile Dickson",
  "Motorisation Somfy",
  "Éclairage LED",
  "Livraison 4-5 semaines",
  "100% Sur-Mesure",
];

const MarqueeSection = () => (
  <section className="py-5 overflow-hidden bg-accent border-y border-accent">
    <div className="flex animate-marquee whitespace-nowrap">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-8 mx-4">
          {pills.map((pill, j) => (
            <span
              key={`${i}-${j}`}
              className="inline-flex items-center rounded-full px-5 py-2 text-sm uppercase tracking-[0.15em] text-white/90 font-semibold whitespace-nowrap"
            >
              {pill}
            </span>
          ))}
        </div>
      ))}
    </div>
  </section>
);

export default MarqueeSection;
