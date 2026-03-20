import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://lunik.lovable.app";
const LOGO_URL = "https://gejgtkgqyzdfbsbxujgl.supabase.co/storage/v1/object/public/Website/logo-lunik.png";
const FONT = "'DM Sans', Arial, Helvetica, sans-serif";

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

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );
    const { data: generalSettings } = await supabaseAdmin.from("admin_settings").select("data").eq("id", "general").single();
    const fromEmail = (generalSettings?.data as any)?.transactionalEmail || Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = Deno.env.get("FROM_NAME") || "LuniK";

    const cfg = cart.configuration || {};
    const pricing = cart.pricing || {};
    const options = cfg.options || {};

    const optionsList: string[] = [];
    if (options.motorisation) optionsList.push("Motorisation Somfy");
    if (options.led) optionsList.push("Éclairage LED");
    if (options.packConnect) optionsList.push("Pack Connect");

    const optionsHtml = optionsList.length > 0
      ? `<p style="margin:0 0 4px;font-size:14px;color:#555;font-family:${FONT};">Options : ${optionsList.join(" · ")}</p>`
      : `<p style="margin:0 0 4px;font-size:14px;color:#555;font-family:${FONT};">Options : Aucune</p>`;

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#eeeeec;font-family:${FONT};-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eeeeec;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="padding:32px 32px 24px;text-align:center;">
<img src="${LOGO_URL}" alt="LuniK" height="40" style="height:40px;width:auto;display:inline-block;" />
</td></tr>

<!-- CONTENT -->
<tr><td style="background-color:#ffffff;padding:40px 32px;border-radius:8px 8px 0 0;">
<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:#e8f5e9;margin:0 auto 16px;line-height:60px;font-size:30px;">📄</div>
<h1 style="margin:0;font-family:${FONT};font-size:24px;font-weight:bold;color:#2d2d2d;">Votre devis LuniK</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;font-family:${FONT};">Retrouvez votre devis ci-dessous. Cliquez sur le bouton pour reprendre votre configuration à tout moment.</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;margin:16px 0;">
<tr><td style="padding:20px;">
<p style="margin:0 0 12px;font-family:${FONT};font-size:18px;font-weight:bold;color:#2d2d2d;">Store Coffre Sur-Mesure</p>
<p style="margin:0 0 4px;font-size:14px;color:#555;font-family:${FONT};">${cfg.width || "—"} × ${cfg.projection || "—"} cm</p>
<p style="margin:0 0 4px;font-size:14px;color:#555;font-family:${FONT};">Toile : ${cfg.toileColor?.label || "—"} · Armature : ${cfg.armatureColor?.label || "—"}</p>
${optionsHtml}
<hr style="border:none;border-top:1px solid #e5e5e3;margin:16px 0;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#2d2d2d;font-family:${FONT};">Prix estimé : ${formatPrice(pricing.total || 0)} €</p>
</td></tr></table>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background-color:#4A5E3A;border-radius:6px;padding:14px 32px;">
<a href="${SITE_URL}/store-coffre?restore=true" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;font-family:${FONT};">Reprendre ma configuration →</a>
</td></tr></table>
</td></tr>

<!-- FOOTER -->
<tr><td style="background-color:#ffffff;border-top:1px solid #e5e5e3;padding:28px 32px 32px;border-radius:0 0 8px 8px;">

<!-- Reassurances -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
<tr><td style="text-align:center;font-family:${FONT};font-size:12px;color:#6b6b69;line-height:2;">
🇫🇷 Fabriqué en France &nbsp;·&nbsp; 🛡️ Garantie 5 ans &nbsp;·&nbsp; 💳 Paiement sécurisé &nbsp;·&nbsp; 📞 03 68 38 10 30
</td></tr></table>

<!-- Social links -->
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px;">
<tr>
<td style="padding:0 12px;"><a href="https://www.instagram.com/lunik.store/" style="color:#4A5E3A;text-decoration:none;font-size:12px;font-family:${FONT};">Instagram</a></td>
<td style="color:#e5e5e3;">|</td>
<td style="padding:0 12px;"><a href="https://www.facebook.com/lunik.store/" style="color:#4A5E3A;text-decoration:none;font-size:12px;font-family:${FONT};">Facebook</a></td>
<td style="color:#e5e5e3;">|</td>
<td style="padding:0 12px;"><a href="https://www.pinterest.fr/lunikstore/" style="color:#4A5E3A;text-decoration:none;font-size:12px;font-family:${FONT};">Pinterest</a></td>
</tr></table>

<p style="margin:0 0 8px;font-size:11px;color:#8a8a88;text-align:center;font-family:${FONT};">LuniK — 15 Chemin de la Loupe, 67420 Ranrupt, France</p>
<p style="margin:0 0 12px;font-size:11px;color:#8a8a88;text-align:center;font-family:${FONT};">
<a href="${SITE_URL}/cgv" style="color:#4A5E3A;text-decoration:underline;">CGV</a> &nbsp;·&nbsp; 
<a href="${SITE_URL}/mentions-legales" style="color:#4A5E3A;text-decoration:underline;">Mentions légales</a> &nbsp;·&nbsp;
<a href="${SITE_URL}/cookies" style="color:#4A5E3A;text-decoration:underline;">Politique de cookies</a>
</p>
<p style="margin:0 0 8px;font-size:10px;color:#b0b0ae;text-align:center;font-family:${FONT};">
<a href="#" style="color:#b0b0ae;text-decoration:underline;">Se désinscrire</a> de nos communications
</p>
<p style="margin:0;font-size:10px;color:#b0b0ae;text-align:center;font-family:${FONT};">© 2026 LuniK. Tous droits réservés.</p>
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
