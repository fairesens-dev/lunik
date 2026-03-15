import { Link } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";
import logoLunik from "@/assets/logo-lunik.svg";
import logoFairesens from "@/assets/logo-fairesens.png";

const Footer = () => {
  const { content } = useContent();
  const { global: g } = content;

  const socialLinks = [
    { label: "Instagram", url: g.socialInstagram },
    { label: "Facebook", url: g.socialFacebook },
    { label: "Pinterest", url: g.socialPinterest },
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">
          <div>
            <img src={logoLunik} alt={g.brandName} className="h-12 mb-4 brightness-0 invert" />
            <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs">
              L'excellence du store sur mesure, fabriqué en France avec passion et savoir-faire.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/40 mb-6 font-sans font-medium">
              Navigation
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "Accueil", href: "/" },
                { label: "Configurateur", href: "/configurateur" },
                { label: "Service Après-Vente", href: "/service-apres-vente" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/40 mb-6 font-sans font-medium">
              Légal
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { label: "CGV", href: "/conditions-generales-de-vente" },
                { label: "Mentions Légales", href: "/mentions-legales" },
                { label: "Politique de cookies", href: "/cookies" },
              ].map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/40 mb-6 font-sans font-medium">
              Contact
            </h4>
            <div className="space-y-3 text-sm text-primary-foreground/60">
              <p>{g.email}</p>
              <p>{g.phone}</p>
              <p>Lundi – Vendredi : 9h – 18h</p>
            </div>
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/40 hover:text-primary-foreground transition-colors text-xs uppercase tracking-widest"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-6 flex flex-col items-center gap-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <p className="text-primary-foreground/60 text-xs">
              © {new Date().getFullYear()} {g.brandName}. Tous droits réservés.
            </p>
            <div className="inline-flex items-center gap-2 text-xs text-primary-foreground/40">
              <span>🇫🇷</span>
              <span>Fabriqué en France</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 pt-2">
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/30">
              Une marque accompagnée par
            </p>
            <img src={logoFairesens} alt="Fairesens IA & Digital" className="h-20 opacity-60" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
