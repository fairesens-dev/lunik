import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useContent } from "@/contexts/ContentContext";
import logoLunik from "@/assets/logo-lunik.svg";

const navLinks = [
  { label: "Lunik, simplement unique", href: "/" },
];

interface HeaderProps {
  bannerOffset?: boolean;
}

const Header = ({ bannerOffset = false }: HeaderProps) => {
  const { content } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const isHomepage = location.pathname === "/";
  const isTransparent = isHomepage && !scrolled;

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
          isTransparent
            ? "bg-transparent"
            : "bg-card/95 backdrop-blur-md border-b border-border"
        )}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-24 flex items-center justify-between h-20">
          <Link to="/">
            <img
              src={logoLunik}
              alt={content.global.brandName}
              className={cn(
                "h-10 transition-all duration-300",
                isTransparent && "brightness-0 invert"
              )}
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[13px] uppercase tracking-[0.12em] font-medium transition-colors",
                  isTransparent
                    ? location.pathname === link.href
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                    : location.pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/suivi-commande">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 rounded-full",
                      isTransparent
                        ? "text-white/70 hover:text-white hover:bg-white/10"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <PackageSearch className="w-5 h-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>Suivi de commande</TooltipContent>
            </Tooltip>
            <Link to="/configurateur">
              <Button
                className={cn(
                  "px-6 py-3 tracking-[0.12em] uppercase text-xs font-medium h-auto",
                  isTransparent && "bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20"
                )}
              >
                Configurer mon store
              </Button>
            </Link>
          </div>

          <button
            className={cn("lg:hidden p-2", isTransparent && "text-white")}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-card flex flex-col items-center justify-center gap-8 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "font-display text-3xl font-bold tracking-tight transition-colors",
                location.pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </a>
          ))}
          <Link to="/configurateur" onClick={() => setMobileOpen(false)}>
            <Button className="px-8 py-4 tracking-[0.12em] uppercase text-sm font-medium h-auto mt-4">
              Configurer mon store
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default Header;
