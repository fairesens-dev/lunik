import { Link } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";
import logoLunik from "@/assets/logo-lunik.png";

const Footer = () => {
  const { content } = useContent();
  const { global: g } = content;

  const socialLinks = [
    { label: "Instagram", url: g.socialInstagram },
    { label: "Facebook", url: g.socialFacebook },
    { label: "Pinterest", url: g.socialPinterest },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* Col 1: Brand */}
          <div>
            <img src={logoLunik} alt={g.brandName} className="h-8 brightness-0 invert mb-2" />
            <p className="text-background/60 text-sm leading-relaxed mb-6 max-w-xs">
              L'excellence du store sur mesure, fabriqué en France avec passion et savoir-faire depuis plus de 20 ans.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/40 hover:text-background transition-colors text-xs uppercase tracking-widest"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-background/40 mb-6 font-sans font-medium">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Notre Store", href: "/store-coffre" },
                { label: "Échantillons gratuits", href: "/echantillons" },
                { label: "Service Après-Vente", href: "/service-apres-vente" },
                { label: "Contact", href: "/contact" },
                { label: "CGV", href: "/conditions-generales-de-vente" },
                { label: "Mentions Légales", href: "/mentions-legales" },
                { label: "Politique de cookies", href: "/cookies" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-background/60 hover:text-background transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3: Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-background/40 mb-6 font-sans font-medium">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-background/60">
              <p>{g.email}</p>
              <p>{g.phone}</p>
              <p>Lundi – Vendredi : 9h – 18h</p>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 border border-background/20 px-4 py-2 text-xs uppercase tracking-widest text-background/60">
              <span>🇫🇷</span>
              <span>Fabriqué en France</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-background/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-background/30 text-xs">
            © {new Date().getFullYear()} {g.brandName}. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/conditions-generales-de-vente" className="text-background/30 hover:text-background/60 transition-colors text-xs">
              CGV
            </Link>
            <Link to="/mentions-legales" className="text-background/30 hover:text-background/60 transition-colors text-xs">
              Mentions Légales
            </Link>
            <Link to="/cookies" className="text-background/30 hover:text-background/60 transition-colors text-xs">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
