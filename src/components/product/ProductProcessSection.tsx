import AnimatedSection from "@/components/AnimatedSection";

const steps = [
  { emoji: "🖥️", title: "Je configure", desc: "Dimensions, coloris et options en temps réel" },
  { emoji: "✅", title: "Je commande", desc: "Confirmation et paiement sécurisé" },
  { emoji: "🏭", title: "Fabrication", desc: "Votre store fabriqué en France selon vos côtes" },
  { emoji: "🚚", title: "Livraison", desc: "Sous 4 à 5 semaines, suivi en temps réel" },
  { emoji: "🌞", title: "Je profite !", desc: "Pose autonome ou par nos installateurs certifiés" },
];

const ProductProcessSection = () => (
  <section className="py-28 lg:py-36 bg-[#1A1A1A] text-white">
    <div className="max-w-[1280px] mx-auto px-6 lg:px-12">
      <AnimatedSection>
        <div className="text-center mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight">
            De votre terrasse à votre store
            <br />
            <span className="italic">en 5 étapes</span>
          </h2>
        </div>
      </AnimatedSection>

      <div className="hidden md:flex items-start justify-between gap-4">
        {steps.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.1}>
            <div className="flex-1 text-center relative">
              <div className="text-3xl mb-4">{step.emoji}</div>
              <h3 className="font-serif text-lg mb-2">{step.title}</h3>
              <p className="text-white/60 text-xs leading-relaxed">{step.desc}</p>
              {i < steps.length - 1 && <div className="absolute top-5 left-[60%] w-[80%] h-px bg-white/20" />}
            </div>
          </AnimatedSection>
        ))}
      </div>

      <div className="md:hidden space-y-10">
        {steps.map((step, i) => (
          <AnimatedSection key={step.title} delay={i * 0.1}>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl">{step.emoji}</span>
                {i < steps.length - 1 && <div className="w-px flex-1 bg-white/20 mt-2" />}
              </div>
              <div>
                <h3 className="font-serif text-lg mb-1">{step.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

export default ProductProcessSection;
