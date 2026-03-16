import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://lunik.lovable.app";

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, cart } = await req.json();
    if (!email || !cart) throw new Error("Missing email or cart");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const resend = new Resend(resendApiKey);
    const fromEmail = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = Deno.env.get("FROM_NAME") || "LuniK";

    const cfg = cart.configuration || {};
    const pricing = cart.pricing || {};
    const options = cfg.options || {};

    const optionsList: string[] = [];
    if (options.motorisation) optionsList.push("Motorisation Somfy");
    if (options.led) optionsList.push("Éclairage LED");
    if (options.packConnect) optionsList.push("Pack Connect");

    const optionsHtml = optionsList.length > 0
      ? `<p style="margin:0 0 4px;font-size:14px;color:#555;">Options : ${optionsList.join(" · ")}</p>`
      : `<p style="margin:0 0 4px;font-size:14px;color:#555;">Options : Aucune</p>`;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="padding:24px 32px;text-align:center;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#4A5E3A;letter-spacing:2px;">LuniK</h1>
</td></tr>
<tr><td style="background-color:#ffffff;padding:32px;">
<div style="text-align:center;margin-bottom:24px;">
<div style="width:56px;height:56px;border-radius:50%;background-color:#e8f5e9;margin:0 auto 12px;line-height:56px;font-size:28px;">📄</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Votre devis LuniK</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Retrouvez votre devis ci-dessous. Cliquez sur le bouton pour reprendre votre configuration à tout moment.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;margin:16px 0;">
<tr><td style="padding:20px;">
<p style="margin:0 0 12px;font-family:Georgia,serif;font-size:18px;color:#333;">Store Coffre Sur-Mesure</p>
<p style="margin:0 0 4px;font-size:14px;color:#555;">${cfg.width || "—"} × ${cfg.projection || "—"} cm</p>
<p style="margin:0 0 4px;font-size:14px;color:#555;">Toile : ${cfg.toileColor?.label || "—"} · Armature : ${cfg.armatureColor?.label || "—"}</p>
${optionsHtml}
<hr style="border:none;border-top:1px solid #e8e2d8;margin:16px 0;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#333;">Prix estimé : ${formatPrice(pricing.total || 0)} €</p>
</td></tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background-color:#4A5E3A;border-radius:6px;padding:14px 32px;">
<a href="${SITE_URL}/store-coffre?restore=true" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;">Reprendre ma configuration →</a>
</td></tr></table>
</td></tr>
<tr><td style="padding:24px 32px;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:#8a7e6b;">LuniK — Store banne sur mesure, fabriqué en France</p>
<p style="margin:0;font-size:10px;color:#aaa;line-height:1.4;">Vos coordonnées sont utilisées par LuniK et son usine partenaire dans le cadre d'une commande de store sur mesure ou à des fins promotionnelles. Vous pouvez vous désinscrire à tout moment en nous contactant.</p>
</td></tr>
</table>
</td></tr></table>
</body></html>`;

    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [email],
      subject: "📄 Votre devis LuniK sur mesure",
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-config-email error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
