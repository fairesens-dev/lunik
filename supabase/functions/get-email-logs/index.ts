import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "RESEND_API_KEY not configured", connected: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "list";

    // Health check / connection test
    if (action === "status") {
      const res = await fetch("https://api.resend.com/domains", {
        headers: { Authorization: `Bearer ${resendApiKey}` },
      });
      return new Response(
        JSON.stringify({ success: true, connected: res.ok, statusCode: res.status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Get single email details
    if (action === "get") {
      const emailId = url.searchParams.get("id");
      if (!emailId) throw new Error("Missing email id");
      const res = await fetch(`https://api.resend.com/emails/${emailId}`, {
        headers: { Authorization: `Bearer ${resendApiKey}` },
      });
      const data = await res.json();
      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // List emails (Resend API)
    const res = await fetch("https://api.resend.com/emails", {
      headers: { Authorization: `Bearer ${resendApiKey}` },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend API error ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return new Response(
      JSON.stringify({ success: true, connected: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("get-email-logs error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
