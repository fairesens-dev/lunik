const pills = [
  "⭐ Trustpilot 4.9/5",
  "🇫🇷 Fabriqué en France",
  "🛡️ Garantie 5 ans",
  "🎨 Toile Dickson",
  "⚙️ Motorisation Somfy",
  "💡 Éclairage LED",
  "📦 Livraison 4-5 semaines",
  "📐 100% Sur-Mesure",
];

const MarqueeSection = () => (
  <section className="py-4 overflow-hidden bg-foreground/5 backdrop-blur-sm border-y border-border">
    <div className="flex animate-marquee whitespace-nowrap">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-6 mx-3">
          {pills.map((pill, j) => (
            <span
              key={`${i}-${j}`}
              className="inline-flex items-center rounded-full px-5 py-2 text-xs uppercase tracking-[0.15em] text-foreground/70 font-medium whitespace-nowrap"
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
