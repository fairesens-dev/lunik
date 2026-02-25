import { useContent } from "@/contexts/ContentContext";

const TrustpilotWidget = () => {
  const { content } = useContent();
  const url = content.global.trustpilotUrl || "https://fr.trustpilot.com/";

  // Don't render the TrustBox widget without a businessUnitId — it throws.
  // Show a simple link instead.
  return (
    <div className="text-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-muted-foreground hover:underline"
      >
        Voir nos avis sur Trustpilot
      </a>
    </div>
  );
};

export default TrustpilotWidget;
