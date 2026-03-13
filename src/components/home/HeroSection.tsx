import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ value, suffix, decimals = 0 }: { value: number; suffix: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * value);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <span className="font-display text-3xl md:text-4xl font-bold tracking-tight">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString("fr-FR")}
        {suffix}
      </span>
    </div>
  );
}

const stats = [
  { value: 5000, suffix: "+", label: "Stores installés", decimals: 0 },
  { value: 4.9, suffix: "/5", label: "Trustpilot", decimals: 1 },
  { value: 173, suffix: "", label: "Coloris Dickson", decimals: 0 },
];

const HeroSection = () => {
  const { content } = useContent();
  const { homepage } = content;

  return (
    <section id="hero" className="relative min-h-[50vh] flex items-center justify-center -mt-20 overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/images/store-vue-ensemble.webp"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/hero-store.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-24 w-full pt-32 pb-20">
        <div className="flex flex-col items-center text-center">
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xs uppercase tracking-[0.4em] text-white/60 mb-8 font-sans font-medium"
          >
            {homepage.heroOverline}
          </motion.p>

          {/* Giant headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.92] tracking-tight mb-8 text-white max-w-5xl"
          >
            {homepage.heroTitle.split("\n").map((line, i, arr) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === arr.length - 1 ? (
                  <span className="text-white/50">{line}</span>
                ) : (
                  line
                )}
              </span>
            ))}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-xl"
          >
            {homepage.heroSubtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link to="/configurateur">
              <Button className="px-10 py-5 tracking-[0.15em] uppercase text-sm font-medium h-auto">
                {homepage.heroCTA1}
              </Button>
            </Link>
            <a href="#gallery">
              <Button
                variant="outline"
                className="border-white/30 text-white px-10 py-5 tracking-[0.15em] uppercase text-sm font-medium hover:bg-white/10 h-auto bg-transparent"
              >
                Voir nos réalisations
              </Button>
            </a>
          </motion.div>

          {/* Stats counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="grid grid-cols-3 gap-8 md:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                <p className="text-white/50 text-xs uppercase tracking-[0.15em] mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 bg-white/60 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
