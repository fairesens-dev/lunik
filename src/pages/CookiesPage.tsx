import AnimatedSection from "@/components/AnimatedSection";
import SEOMeta from "@/components/SEOMeta";

const CookiesPage = () => {
  return (
    <section className="py-28 lg:py-36">
      <SEOMeta
        title="Politique de Cookies | Mon Store"
        description="Découvrez comment nous utilisons les cookies sur notre site et gérez vos préférences."
      />
      <div className="max-w-[900px] mx-auto px-6 lg:px-12">
        <AnimatedSection>
          <h1 className="font-serif text-4xl md:text-5xl font-light mb-12">
            Politique de <span className="italic">Cookies</span>
          </h1>
        </AnimatedSection>

        <div className="space-y-12">
          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Qu'est-ce qu'un cookie ?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone)
                lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite,
                comme vos préférences de langue ou votre configuration en cours, pour faciliter votre navigation ultérieure.
              </p>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Cookies strictement nécessaires</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>Ces cookies sont indispensables au fonctionnement du site. Ils ne peuvent pas être désactivés.</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">cookie_consent</strong> — Mémorise vos préférences de cookies</li>
                  <li><strong className="text-foreground">lunik-cart</strong> — Sauvegarde votre panier et configuration en cours</li>
                  <li><strong className="text-foreground">cart_session_id</strong> — Identifiant de session pour le suivi de panier</li>
                </ul>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Cookies analytiques</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  Ces cookies nous permettent de mesurer l'audience du site et de comprendre comment les visiteurs
                  l'utilisent afin d'améliorer son fonctionnement et son contenu.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Google Analytics</strong> — Statistiques de visite anonymisées</li>
                  <li><strong className="text-foreground">Hotjar</strong> — Cartes de chaleur et enregistrements de session</li>
                </ul>
                <p>Ces cookies ne sont déposés qu'avec votre consentement.</p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Cookies marketing</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  Ces cookies sont utilisés pour vous proposer des publicités personnalisées sur d'autres sites
                  en fonction de votre navigation.
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-foreground">Facebook Pixel</strong> — Suivi de conversions et remarketing</li>
                  <li><strong className="text-foreground">Google Ads</strong> — Publicités ciblées</li>
                </ul>
                <p>Ces cookies ne sont déposés qu'avec votre consentement.</p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Gérer vos préférences</h2>
              <div className="text-muted-foreground text-sm leading-relaxed space-y-2">
                <p>
                  Vous pouvez modifier vos préférences de cookies à tout moment en supprimant le cookie
                  « cookie_consent » dans les paramètres de votre navigateur, ce qui réaffichera le bandeau
                  de consentement lors de votre prochaine visite.
                </p>
                <p>
                  Vous pouvez également configurer votre navigateur pour refuser tous les cookies ou être
                  averti(e) lorsqu'un cookie est envoyé. Notez que certaines fonctionnalités du site pourraient
                  ne plus fonctionner correctement.
                </p>
              </div>
            </article>
          </AnimatedSection>

          <AnimatedSection>
            <article>
              <h2 className="font-serif text-2xl mb-4">Contact</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Pour toute question relative à notre politique de cookies, vous pouvez nous contacter à
                l'adresse : <strong className="text-foreground">dpo@brand-store.fr</strong>
              </p>
            </article>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default CookiesPage;
