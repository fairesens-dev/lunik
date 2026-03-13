import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const StickyCTABar = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      )}
    >
      <div className="bg-primary/95 backdrop-blur-md border-t border-primary-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-16 py-3 flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-primary-foreground text-sm font-medium">
              Store Coffre Sur-Mesure — <span className="text-primary-foreground/60">à partir de 1 490 €</span>
            </p>
          </div>
          <Link to="/configurateur">
            <Button
              size="sm"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-6 py-2.5 tracking-[0.12em] uppercase text-xs font-medium h-auto"
            >
              Configurer mon store
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StickyCTABar;
