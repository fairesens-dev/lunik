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
  <section className="py-6 overflow-hidden border-y border-border">
    <div className="flex animate-marquee whitespace-nowrap">
      {[0, 1].map((i) => (
        <div key={i} className="flex gap-4 mx-2">
          {pills.map((pill, j) => (
            <span
              key={`${i}-${j}`}
              className="inline-flex items-center border border-border rounded-full px-5 py-2 text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium whitespace-nowrap"
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
