import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TP_BASE = "https://api.trustpilot.com/v1";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("TRUSTPILOT_API_KEY");
    const businessUnitId = Deno.env.get("TRUSTPILOT_BUSINESS_UNIT_ID");

    if (!apiKey || !businessUnitId) {
      // Return empty but valid response so frontend uses fallback gracefully
      return new Response(
        JSON.stringify({ notConfigured: true, reviews: [], trustScore: 0, numberOfReviews: { total: 0 }, stars: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { action, params } = await req.json();

    let url: string;

    switch (action) {
      case "summary":
        url = `${TP_BASE}/business-units/${businessUnitId}?apikey=${apiKey}`;
        break;

      case "reviews": {
        const searchParams = new URLSearchParams({
          apikey: apiKey,
          page: String(params?.page ?? 1),
          perPage: String(params?.perPage ?? 10),
          orderBy: params?.orderBy ?? "createdat.desc",
        });
        if (params?.stars) {
          searchParams.append("stars", String(params.stars));
        }
        url = `${TP_BASE}/business-units/${businessUnitId}/reviews?${searchParams}`;
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Unknown action" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    const tpResponse = await fetch(url);
    const data = await tpResponse.json();

    if (!tpResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Trustpilot API error", details: data }),
        { status: tpResponse.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
