import { useEffect, useRef } from "react";
import { useContent } from "@/contexts/ContentContext";

const TrustpilotWidget = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { content } = useContent();

  useEffect(() => {
    // Trigger TrustBox widget if script is loaded
    if ((window as any).Trustpilot && ref.current) {
      (window as any).Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="fr-FR"
      data-template-id="53aa8807dec7e10d38f59f32"
      data-businessunit-id=""
      data-style-height="150px"
      data-style-width="100%"
      data-theme="light"
    >
      <a
        href={content.global.trustpilotUrl || "https://fr.trustpilot.com/"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
