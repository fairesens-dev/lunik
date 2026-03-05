import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  { title: "Je configure en ligne", desc: "Sélectionnez vos dimensions et options en temps réel" },
  { title: "Je valide et commande", desc: "Paiement sécurisé, confirmation immédiate par email" },
  { title: "Fabrication sur-mesure", desc: "Votre store est fabriqué en France selon vos côtes" },
  { title: "Livraison à domicile", desc: "Livré sous 4 à 5 semaines, pris en charge par nos transporteurs" },
  { title: "Je profite !", desc: "Installation possible avec nos poseurs certifiés ou en autonomie" },
];

const ProcessSection = () => (
  <section className="py-16 lg:py-20 bg-card">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-20">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">
            De votre canapé à votre terrasse
            <br />
            <span className="text-primary">en 5 étapes</span>
          </h2>
        </div>
      </AnimatedSection>

      {/* Desktop horizontal */}
      <div className="hidden md:flex items-start justify-between gap-4">
        {steps.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.1}>
            <div className="flex-1 text-center relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-light text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="absolute top-6 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-accent-light/30" />
              )}
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* Mobile vertical */}
      <div className="md:hidden space-y-10">
        {steps.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.1}>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-light text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-primary/30 to-accent-light/30 mt-2" />}
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProcessSection;
