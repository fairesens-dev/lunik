import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  { title: "Je configure en ligne", desc: "Sélectionnez vos dimensions et options en temps réel" },
  { title: "Je valide et commande", desc: "Paiement sécurisé, confirmation immédiate par email" },
  { title: "Fabrication sur-mesure", desc: "Votre store est fabriqué en France selon vos côtes" },
  { title: "Livraison à domicile", desc: "Livré sous 4 à 5 semaines, pris en charge par nos transporteurs" },
  { title: "Je profite !", desc: "Installation possible avec nos poseurs certifiés ou en autonomie" },
];

const ProcessSection = () => (
  <section className="py-20 lg:py-28">
    <div className="max-w-[900px] mx-auto px-6">
      <AnimatedSection>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-center mb-20">
          Comment ça marche ?
        </h2>
      </AnimatedSection>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border hidden md:block" />

        <div className="space-y-12">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.1}>
              <div className="flex gap-6 items-start">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0 relative z-10">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="font-display text-lg font-semibold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessSection;
