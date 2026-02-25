import AnimatedSection from "@/components/AnimatedSection";

const MentionsLegalesPage = () => {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-12">
            Mentions <span className="italic">Légales</span>
          </h1>
        </AnimatedSection>

        <div className="space-y-12">
          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Éditeur du site</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-1">
                <p>[BRAND] SAS</p>
                <p>Capital social : XX XXX €</p>
                <p>RCS : XXX XXX XXX</p>
                <p>Siège social : Zone Industrielle des Oliviers, 13100 Aix-en-Provence</p>
                <p>Téléphone : +33 (0)4 XX XX XX XX</p>
                <p>Email : contact@brand-store.fr</p>
                <p>Directeur de la publication : [Nom du dirigeant]</p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Hébergement</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-1">
                <p>[Nom de l'hébergeur]</p>
                <p>[Adresse de l'hébergeur]</p>
                <p>[Téléphone de l'hébergeur]</p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Propriété intellectuelle</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                L'ensemble des éléments constituant ce site (textes, photographies, illustrations, logos, icônes, etc.) 
                est la propriété exclusive de [BRAND] SAS ou de ses partenaires. Toute reproduction, représentation, 
                modification ou exploitation, même partielle, est strictement interdite sans autorisation écrite préalable.
              </p>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Données personnelles</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles 
                vous concernant. Pour exercer ces droits, contactez-nous à : contact@brand-store.fr
              </p>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Cookies</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Ce site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visites. 
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités du site 
                pourraient ne plus être disponibles.
              </p>
            </article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default MentionsLegalesPage;
