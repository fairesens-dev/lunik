import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const { photo, toileColorHex, toileColorLabel, toilePhotoUrl, armatureColorHex, armatureColorLabel, led } =
      await req.json();

    if (!photo) {
      return new Response(JSON.stringify({ error: "No photo provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build content array with the user's photo
    const content: any[] = [
      {
        type: "text",
        text: `You are an expert architectural visualization artist. The user has uploaded a photo of their terrace or outdoor space. Your task is to realistically place a retractable cassette awning (store banne) on this photo.

Awning specifications:
- Fabric color: ${toileColorLabel} (hex: ${toileColorHex})
- Frame/armature color: ${armatureColorLabel} (hex: ${armatureColorHex})
- LED lighting strip: ${led ? "Yes, integrated LED strip along the front bar" : "No"}

Instructions:
- Place the awning naturally attached to the wall/facade visible in the photo
- The awning should be extended/deployed, showing the fabric
- Match the perspective, lighting, and shadows of the original photo
- The fabric should be the exact color specified
- The frame/arms should match the armature color
- Keep the original photo composition and quality intact
- Make it look like a professional architectural rendering
- The awning should be proportional to the space shown`,
      },
      {
        type: "image_url",
        image_url: { url: photo },
      },
    ];

    // If there's a fabric pattern photo, include it
    if (toilePhotoUrl) {
      content.push({
        type: "text",
        text: "Here is the exact fabric pattern/texture to use for the awning fabric:",
      });
      content.push({
        type: "image_url",
        image_url: { url: toilePhotoUrl },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Trop de requêtes, réessayez dans un moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Crédits IA insuffisants." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("No image in response:", JSON.stringify(data).slice(0, 500));
      throw new Error("No image generated");
    }

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("project-store-on-photo error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
