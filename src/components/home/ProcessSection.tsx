import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  { title: "Je configure", desc: "Dimensions et options en temps réel" },
  { title: "Je commande", desc: "Paiement sécurisé, confirmation immédiate" },
  { title: "Fabrication", desc: "Sur-mesure en France selon vos côtes" },
  { title: "Livraison", desc: "Chez vous en 4 à 5 semaines" },
  { title: "Je profite !", desc: "Installation pro ou en autonomie" },
];

const ProcessSection = () => (
  <section className="py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-16">
      <AnimatedSection>
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium mb-4">
            Simple & rapide
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            Comment ça marche ?
          </h2>
        </div>
      </AnimatedSection>

      {/* Horizontal timeline */}
      <div className="relative">
        {/* Connecting line — desktop only */}
        <div className="hidden md:block absolute top-5 left-[10%] right-[10%] h-px bg-border" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 relative z-10 mb-4">
                  {i + 1}
                </div>
                <h3 className="font-display text-base font-bold mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-[180px]">{step.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
