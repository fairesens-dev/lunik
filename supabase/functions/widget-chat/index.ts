import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Tu es l'assistant virtuel de LuniK, spécialiste français du store banne coffre sur-mesure haut de gamme.
Tu réponds en français, de façon concise, chaleureuse et professionnelle.
Tu aides les visiteurs avec leurs questions sur les produits, livraisons, retours, paiements et informations générales.
Si tu ne sais pas répondre, dis-le honnêtement et propose à l'utilisateur de demander à être rappelé par notre équipe.

Base de connaissances LuniK :
- Produit : Store banne coffre sur-mesure, motorisation Somfy, toile Dickson (qualité professionnelle), 173 coloris disponibles
- Dimensions : largeur de 3m à 6m, projection de 2m à 3.5m
- Options : éclairage LED intégré, capteur vent, télécommande multi-canaux, lambrequin déroulable
- Garantie : 5 ans sur l'ensemble, 7 ans sur la motorisation Somfy
- Fabrication : sur-mesure en France, délai de fabrication 4 à 5 semaines
- Livraison : gratuite en France métropolitaine, livraison à domicile par transporteur spécialisé
- Retours : 30 jours après réception, produit non installé et dans son emballage d'origine
- Paiement : CB (Visa, Mastercard), virement bancaire, paiement en 3x sans frais
- Prix : à partir de 1 890€ TTC selon dimensions et options
- Installation : possible en auto-installation (guide fourni) ou par un installateur partenaire (en supplément)
- SAV : équipe dédiée joignable par téléphone ou via le widget de contact
- Site web : lunik.lovable.app | Configurateur en ligne pour personnaliser son store

Règles :
- Reste toujours dans le cadre des stores bannes LuniK, ne réponds pas à des questions hors sujet
- Ne donne jamais de prix exact sans connaître les dimensions, redirige vers le configurateur
- Si la question concerne un problème de commande existante, suggère d'utiliser le service SAV du widget
- Sois enthousiaste mais jamais excessif, reste professionnel`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de requêtes, veuillez réessayer dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporairement indisponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Erreur du service IA" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("widget-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erreur inconnue" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
