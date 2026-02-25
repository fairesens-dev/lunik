import AnimatedSection from "@/components/AnimatedSection";
import SEOMeta from "@/components/SEOMeta";

const MentionsLegalesPage = () => {
  return (
    <section className="py-28 lg:py-36">
      <SEOMeta title="Mentions Légales | Mon Store" description="Mentions légales du site Mon Store : éditeur, hébergement, propriété intellectuelle et données personnelles." />
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
                <p>[BRAND] SAS au capital de XX XXX €</p>
                <p>RCS Aix-en-Provence : XXX XXX XXX</p>
                <p>N° TVA intracommunautaire : FR XX XXX XXX XXX</p>
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
              <h2 className="font-serif text-2xl mb-4">Données personnelles et RGPD</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
                  vous disposez d'un droit d'accès, de rectification, de suppression, de limitation, de portabilité et d'opposition
                  aux données personnelles vous concernant.
                </p>
                <p>
                  <strong className="text-foreground">Responsable du traitement :</strong> [BRAND] SAS<br />
                  <strong className="text-foreground">DPO :</strong> dpo@brand-store.fr<br />
                  <strong className="text-foreground">Base légale :</strong> Consentement, exécution contractuelle, intérêt légitime<br />
                  <strong className="text-foreground">Durée de conservation :</strong> 3 ans à compter du dernier contact pour les prospects, durée de la relation contractuelle + 5 ans pour les clients
                </p>
                <p>
                  Pour exercer vos droits, contactez-nous à : dpo@brand-store.fr ou par courrier à l'adresse du siège social.
                  Vous disposez également du droit d'introduire une réclamation auprès de la CNIL.
                </p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Cookies</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-3">
                <p>
                  Ce site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visites.
                </p>
                <p>
                  <strong className="text-foreground">Cookies strictement nécessaires :</strong> fonctionnement du site, mémorisation des préférences.<br />
                  <strong className="text-foreground">Cookies analytiques :</strong> mesure d'audience (Google Analytics ou équivalent).<br />
                  <strong className="text-foreground">Cookies marketing :</strong> personnalisation des publicités (désactivés par défaut).
                </p>
                <p>
                  Vous pouvez configurer vos préférences de cookies à tout moment via le bandeau de consentement
                  ou les paramètres de votre navigateur.
                </p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Liens hypertextes</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Le site peut contenir des liens vers des sites tiers. [BRAND] n'exerce aucun contrôle sur ces sites
                et décline toute responsabilité quant à leur contenu ou leurs pratiques en matière de protection des données.
              </p>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Crédits</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-1">
                <p>Conception et développement : [Agence / développeur]</p>
                <p>Photographies : [Photographe / banque d'images]</p>
                <p>Icônes : Lucide Icons (licence MIT)</p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Droit applicable</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Les présentes mentions légales sont soumises au droit français.
                En cas de litige, et à défaut de résolution amiable, les tribunaux français seront seuls compétents.
              </p>
            </article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default MentionsLegalesPage;
