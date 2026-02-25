import AnimatedSection from "@/components/AnimatedSection";

const sections = [
  {
    id: "objet",
    title: "Article 1 — Objet",
    content: "Les présentes conditions générales de vente (CGV) s'appliquent à toutes les commandes passées auprès de [BRAND] SAS, société spécialisée dans la fabrication et la vente de stores bannes et stores coffres sur mesure. Elles régissent l'ensemble des relations contractuelles entre [BRAND] et ses clients, qu'ils soient particuliers ou professionnels.\n\nToute commande implique l'acceptation pleine et entière des présentes CGV, qui prévalent sur tout autre document émanant du client.",
  },
  {
    id: "produits",
    title: "Article 2 — Produits et services",
    content: "Les produits proposés par [BRAND] sont des stores bannes et stores coffres fabriqués sur mesure selon les spécifications du client : dimensions, coloris de toile, couleur d'armature et options (motorisation, éclairage LED, pack connecté).\n\nLes photographies et illustrations présentées sur le site sont données à titre indicatif. Les coloris peuvent varier légèrement selon les réglages d'écran. Des échantillons de toile peuvent être commandés gratuitement.",
  },
  {
    id: "prix",
    title: "Article 3 — Prix et tarifs",
    content: "Les prix sont indiqués en euros toutes taxes comprises (TTC), TVA française en vigueur incluse. Ils sont calculés en temps réel selon les dimensions, le coloris et les options sélectionnés par le client dans le configurateur en ligne.\n\nLes prix sont susceptibles de modification sans préavis. Le prix applicable est celui affiché au moment de la validation de la commande. Un devis récapitulatif est adressé au client avant toute confirmation définitive.",
  },
  {
    id: "commande",
    title: "Article 4 — Commande et validation",
    content: "La commande n'est définitive qu'après confirmation écrite de [BRAND] et réception de l'acompte de 30 % du montant total. Un email de confirmation récapitulant les caractéristiques du produit commandé est envoyé au client.\n\nLe client dispose d'un délai de 24h après réception de la confirmation pour signaler toute erreur dans les spécifications de sa commande (dimensions, coloris, options).",
  },
  {
    id: "paiement",
    title: "Article 5 — Modalités de paiement",
    content: "Le paiement s'effectue en trois fois : 30 % à la commande (acompte), 40 % à la mise en fabrication, et le solde de 30 % à la livraison ou à l'installation.\n\nLes moyens de paiement acceptés sont : virement bancaire, chèque et carte bancaire (via notre plateforme de paiement sécurisée). Un paiement en 3× sans frais par carte bancaire est également proposé pour les commandes inférieures à 5 000 € TTC.",
  },
  {
    id: "livraison",
    title: "Article 6 — Livraison et installation",
    content: "Les délais de livraison sont donnés à titre indicatif. Le délai moyen est de 4 à 6 semaines à compter de la validation de la commande et de la réception de l'acompte. Le client est informé par email à chaque étape : mise en fabrication, expédition, livraison.\n\nLa livraison est effectuée à l'adresse indiquée lors de la commande, en France métropolitaine. L'installation par nos techniciens certifiés est proposée en option. Le client peut également procéder à une installation autonome grâce au guide fourni.",
  },
  {
    id: "transfert",
    title: "Article 7 — Transfert de propriété",
    content: "Le transfert de propriété des produits au profit du client n'est réalisé qu'après paiement complet du prix par celui-ci. Toutefois, le transfert des risques de perte et de détérioration s'opère dès la livraison des produits au client ou à son transporteur.",
  },
  {
    id: "retractation",
    title: "Article 8 — Droit de rétractation",
    content: "Conformément aux articles L.221-18 et suivants du Code de la consommation, le client dispose d'un délai de 14 jours calendaires à compter de la réception du produit pour exercer son droit de rétractation, sans avoir à justifier de motif ni à payer de pénalités.\n\nCe droit ne s'applique pas aux produits sur mesure dont la fabrication a été engagée conformément à l'article L.221-28 du Code de la consommation. Le client en est informé lors de la validation de sa commande.",
  },
  {
    id: "garantie-legale",
    title: "Article 9 — Garantie légale de conformité",
    content: "Conformément aux articles L.217-4 et suivants du Code de la consommation, le client bénéficie de la garantie légale de conformité pendant 2 ans à compter de la livraison du produit. En cas de défaut de conformité, le client peut choisir entre la réparation ou le remplacement du produit.\n\nLe client bénéficie également de la garantie des vices cachés conformément aux articles 1641 et suivants du Code civil.",
  },
  {
    id: "garantie-commerciale",
    title: "Article 10 — Garantie commerciale et SAV",
    content: "En complément des garanties légales, [BRAND] offre une garantie commerciale : 10 ans sur la structure aluminium, 5 ans sur la toile Dickson et 5 ans sur la motorisation Somfy. Cette garantie couvre les défauts de fabrication et de matériaux dans des conditions normales d'utilisation.\n\nLe service après-vente est joignable par téléphone et email du lundi au vendredi de 9h à 18h. Les pièces détachées sont disponibles et expédiées sous 48h.",
  },
  {
    id: "responsabilite",
    title: "Article 11 — Responsabilité",
    content: "La responsabilité de [BRAND] ne saurait être engagée en cas de non-respect de la législation du pays dans lequel les produits sont livrés. Il appartient au client de vérifier auprès des autorités locales les possibilités d'importation ou d'utilisation des produits.\n\n[BRAND] ne saurait être tenu responsable des dommages résultant d'une mauvaise utilisation du produit, d'un défaut d'entretien, ou d'une installation non conforme aux instructions fournies.",
  },
  {
    id: "donnees",
    title: "Article 12 — Données personnelles",
    content: "Les informations collectées lors de la commande sont nécessaires au traitement de celle-ci et sont traitées conformément au Règlement Général sur la Protection des Données (RGPD). Le client dispose d'un droit d'accès, de rectification, de suppression et de portabilité de ses données.\n\nPour exercer ces droits, le client peut adresser sa demande à : dpo@brand-store.fr. Pour plus d'informations, consultez notre politique de confidentialité.",
  },
  {
    id: "litiges",
    title: "Article 13 — Litiges et médiation",
    content: "Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, le client peut recourir gratuitement au service de médiation de la consommation dont relève [BRAND].\n\nLe médiateur peut être saisi en ligne à l'adresse : [URL du médiateur]. En dernier recours, le tribunal compétent sera celui du siège social de [BRAND].",
  },
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
                {s.content.split("\n\n").map((p, i) => (
                  <p key={i} className="text-muted-foreground text-sm leading-relaxed mb-3 last:mb-0">
                    {p}
                  </p>
                ))}
              </article>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CGVPage;
