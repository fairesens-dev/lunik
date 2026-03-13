import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContent } from "@/contexts/ContentContext";
import logoLunik from "@/assets/logo-lunik.png";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Configurateur", href: "/configurateur" },
  { label: "SAV", href: "/service-apres-vente" },
  { label: "Contact", href: "/contact" },
];

interface HeaderProps {
  bannerOffset?: boolean;
}

const Header = ({ bannerOffset = false }: HeaderProps) => {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-500",
          bannerOffset ? "top-[40px]" : "top-0",
          scrolled
            ? "bg-background/80 backdrop-blur-xl shadow-sm"
            : "bg-background/60 backdrop-blur-lg"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-24 flex items-center justify-between h-20">
          <Link to="/">
            <img src={logoLunik} alt={content.global.brandName} className="h-8" />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "story-link text-[13px] uppercase tracking-[0.15em] font-medium transition-colors",
                  location.pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <Link to="/configurateur" className="hidden lg:block">
            <Button variant="gradient" className="px-6 py-3 rounded-full tracking-[0.15em] uppercase text-xs font-medium h-auto">
              Configurer mon store
            </Button>
          </Link>

          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-gradient-to-b from-background to-card flex flex-col items-center justify-center gap-8 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-serif text-3xl tracking-wide transition-colors",
                location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
          <a href="/#configurator" onClick={() => setMobileOpen(false)}>
            <Button variant="gradient" className="px-8 py-4 rounded-full tracking-[0.15em] uppercase text-sm font-medium h-auto mt-4">
              Configurer mon store
            </Button>
          </a>
        </div>
      )}
    </>
  );
};

export default Header;
