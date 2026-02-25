import { Link } from "react-router-dom";
import { useContent } from "@/contexts/ContentContext";

const PromoBanner = () => {
  const { content } = useContent();
  const { promoBanner } = content;

  if (!promoBanner.active) return null;

  return (
    <div
      className="w-full py-2.5 px-4 text-center text-sm font-medium flex items-center justify-center gap-3 flex-wrap"
      style={{ backgroundColor: promoBanner.bgColor, color: promoBanner.textColor }}
    >
      <span>{promoBanner.text}</span>
      {promoBanner.ctaText && (
        <Link
          to={promoBanner.ctaUrl}
          className="underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity"
          style={{ color: promoBanner.textColor }}
        >
          {promoBanner.ctaText} →
        </Link>
      )}
    </div>
  );
};

export default PromoBanner;
