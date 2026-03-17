import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const BUCKET = "product-photos";
const BASE_IMAGE_PATH = "base/store-base.jpg";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { toileColorHex, toileColorLabel, armatureColorHex, armatureColorLabel, led, toilePhotoUrl } = await req.json();

    // Build cache key
    const cacheKey = `${toileColorHex}-${armatureColorHex}-${!!led}-${toilePhotoUrl || ""}`;

    // Init Supabase with service role for DB + storage writes
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Check cache
    const { data: cached } = await supabase
      .from("generated_visuals")
      .select("public_url")
      .eq("cache_key", cacheKey)
      .maybeSingle();

    if (cached?.public_url) {
      console.log("Cache hit for", cacheKey);
      return new Response(JSON.stringify({ imageUrl: cached.public_url, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Download base image and convert to base64 (Gemini can't always fetch URLs)
    const { data: baseFileData, error: baseFileError } = await supabase.storage
      .from(BUCKET)
      .download(BASE_IMAGE_PATH);

    if (baseFileError || !baseFileData) {
      console.error("Base image not found in storage:", baseFileError);
      return new Response(JSON.stringify({ error: "Base image not found. Please upload store-base.jpg to product-photos/base/" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const baseImageBuffer = new Uint8Array(await baseFileData.arrayBuffer());
    const baseImageB64 = btoa(String.fromCharCode(...baseImageBuffer));
    const baseImageUrl = `data:image/jpeg;base64,${baseImageB64}`;

    // 3. Call Gemini to edit the base image
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const ledInstruction = led
      ? "Add a warm white LED strip light running along the underside of the front bar, casting a soft ambient glow. Evening/dusk atmosphere."
      : "Keep the daytime bright natural sunlight. No LED lighting.";

    const fabricReference = toilePhotoUrl
      ? `\nIMPORTANT: A reference image of the exact fabric pattern/texture is also attached. The awning fabric MUST reproduce this exact pattern, colors, and texture faithfully.`
      : "";

    const editPrompt = `Edit this photograph of a retractable cassette awning (store banne):
- Change the fabric/canvas color to ${toileColorLabel} (${toileColorHex}). The entire fabric surface must show this exact color uniformly.
- Change the aluminum frame/armature/cassette color to ${armatureColorLabel} (${armatureColorHex}).
- ${ledInstruction}
- Keep the background, terrace, furniture, composition, and camera angle exactly identical.
- Do NOT add any text, watermark, or logo.
- Photorealistic result, same quality as the original.${fabricReference}`;

    // Build multimodal content
    const contentParts: any[] = [
      { type: "text", text: editPrompt },
      { type: "image_url", image_url: { url: baseImageUrl } },
    ];

    if (toilePhotoUrl) {
      contentParts.push({ type: "image_url", image_url: { url: toilePhotoUrl } });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: contentParts }],
        modalities: ["image", "text"],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Image generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const imageDataUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageDataUrl) {
      console.error("No image in AI response:", JSON.stringify(aiData).slice(0, 500));
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Decode base64 and upload to storage
    const base64Match = imageDataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!base64Match) {
      console.error("Unexpected image format");
      // Return the data URL directly as fallback (no caching)
      return new Response(JSON.stringify({ imageUrl: imageDataUrl, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const ext = base64Match[1] === "jpeg" ? "jpg" : base64Match[1];
    const base64Data = base64Match[2];
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // Sanitize cache key for file path
    const safeFileName = cacheKey.replace(/[^a-zA-Z0-9\-]/g, "_");
    const storagePath = `generated/${safeFileName}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(storagePath, binaryData, {
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Return data URL as fallback
      return new Response(JSON.stringify({ imageUrl: imageDataUrl, cached: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5. Get public URL
    const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const publicUrl = publicUrlData.publicUrl;

    // 6. Insert into cache table
    await supabase.from("generated_visuals").insert({
      cache_key: cacheKey,
      toile_color_hex: toileColorHex,
      armature_color_hex: armatureColorHex,
      led: !!led,
      toile_photo_url: toilePhotoUrl || null,
      storage_path: storagePath,
      public_url: publicUrl,
    });

    console.log("Generated and cached:", cacheKey);

    return new Response(JSON.stringify({ imageUrl: publicUrl, cached: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-store-image error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
