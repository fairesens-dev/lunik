import AnimatedSection from "@/components/AnimatedSection";

const sections = [
  { id: "objet", title: "Article 1 — Objet", content: "Les présentes conditions générales de vente s'appliquent à toutes les commandes passées auprès de [BRAND], société spécialisée dans la fabrication et la vente de stores bannes et stores coffres sur mesure." },
  { id: "commandes", title: "Article 2 — Commandes", content: "Toute commande implique l'acceptation pleine et entière des présentes conditions générales de vente. La commande ne sera définitive qu'après confirmation écrite de [BRAND] et réception de l'acompte de 30% du montant total." },
  { id: "prix", title: "Article 3 — Prix", content: "Les prix sont indiqués en euros TTC. Ils sont susceptibles de modification sans préavis. Le prix applicable est celui en vigueur au jour de la commande. Un devis personnalisé est établi pour chaque commande sur mesure." },
  { id: "paiement", title: "Article 4 — Modalités de paiement", content: "Le paiement s'effectue en trois fois : 30% à la commande, 40% à la fabrication, et le solde à la livraison. Les moyens de paiement acceptés sont : virement bancaire, chèque, carte bancaire." },
  { id: "livraison", title: "Article 5 — Livraison et installation", content: "Les délais de livraison sont donnés à titre indicatif. Le délai moyen est de 4 à 6 semaines à compter de la validation de la commande. L'installation est réalisée par nos équipes qualifiées." },
  { id: "garantie", title: "Article 6 — Garantie", content: "Nos produits bénéficient d'une garantie structure de 10 ans, toile de 5 ans et motorisation de 5 ans. La garantie couvre les défauts de fabrication et de matériaux dans des conditions normales d'utilisation." },
  { id: "retractation", title: "Article 7 — Droit de rétractation", content: "Conformément au Code de la consommation, le client dispose d'un délai de 14 jours pour exercer son droit de rétractation. Ce droit ne s'applique pas aux produits sur mesure une fois la fabrication engagée." },
  { id: "litiges", title: "Article 8 — Litiges", content: "En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le tribunal compétent sera celui du siège social de [BRAND]. Le droit français est applicable." },
];

const CGVPage = () => {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-6">
            Conditions Générales <span className="italic">de Vente</span>
          </h1>
          <p className="text-muted-foreground text-sm mb-12">Dernière mise à jour : janvier 2025</p>

          {/* TOC */}
          <nav className="border border-border p-6 mb-16">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">Sommaire</p>
            <ul className="space-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-primary hover:underline">{s.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        </AnimatedSection>

        <div className="space-y-12">
          {sections.map((s) => (
            <AnimatedSection key={s.id}>
              <article id={s.id}>
                <h2 className="font-serif text-2xl mb-4">{s.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.content}</p>
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CGVPage;
