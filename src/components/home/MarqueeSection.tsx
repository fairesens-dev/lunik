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

export default MarqueeSection;
