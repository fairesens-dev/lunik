import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://lunik.lovable.app";

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Mon Store</title></head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
<tr><td style="background-color:#f5f0e8;padding:24px 32px;text-align:center;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#4A5E3A;letter-spacing:2px;">MON STORE</h1>
<p style="margin:4px 0 0;font-size:12px;color:#8a7e6b;letter-spacing:1px;">Protection solaire sur-mesure</p>
</td></tr>
<tr><td style="background-color:#ffffff;padding:32px;">
${content}
</td></tr>
<tr><td style="padding:24px 32px;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:#8a7e6b;">Mon Store — 12 rue de l'Atelier, 67000 Strasbourg</p>
<p style="margin:0;font-size:11px;color:#8a7e6b;">
<a href="${SITE_URL}/conditions-generales-de-vente" style="color:#4A5E3A;text-decoration:underline;">CGV</a> · 
<a href="${SITE_URL}/mentions-legales" style="color:#4A5E3A;text-decoration:underline;">Mentions légales</a>
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(text: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background-color:#4A5E3A;border-radius:6px;padding:14px 32px;">
<a href="${url}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;display:inline-block;">${text}</a>
</td></tr></table>`;
}

function configBlock(cart: any) {
  const cfg = cart.configuration || cart;
  const pricing = cart.pricing || {};
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;margin:16px 0;">
<tr><td style="padding:20px;">
<p style="margin:0 0 12px;font-family:Georgia,serif;font-size:18px;color:#333;">Store Coffre Sur-Mesure</p>
<p style="margin:0 0 4px;font-size:14px;color:#555;">${cfg.width || "—"} × ${cfg.projection || "—"} cm · Toile ${cfg.toileColor?.label || "—"} · ${cfg.armatureColor?.label || "—"}</p>
<hr style="border:none;border-top:1px solid #e8e2d8;margin:16px 0;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#333;">Total : ${formatPrice(pricing.total || 0)} €</p>
</td></tr></table>`;
}

// ── Email templates ────────────────────────────────

function email1(cart: any) {
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Votre store sur-mesure vous attend 🌞</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Vous avez configuré un store il y a peu. Il vous attend !</p>
${configBlock(cart)}
<div style="background-color:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:16px;margin:16px 0;">
<p style="margin:0;font-size:13px;color:#795548;">⚠️ Les prix peuvent évoluer. Finalisez votre commande pour bénéficier de ce tarif.</p>
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
<tr><td style="padding:8px 0;font-size:13px;color:#555;">❓ <strong>Une question ?</strong> — 📞 03 88 XX XX XX</td></tr>
<tr><td style="padding:8px 0;font-size:13px;color:#555;">💳 <strong>Le budget ?</strong> — Payez en 4× sans frais</td></tr>
</table>
${ctaButton("Reprendre ma configuration →", `${SITE_URL}/store-coffre?restore=true`)}
`);
}

function email2(cart: any) {
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">💡 Des questions sur votre store ?</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Nous comprenons qu'un store sur-mesure est un investissement important. Voici quelques réponses à vos questions :</p>
${configBlock(cart)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
<tr><td style="padding:10px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">🎨 Besoin d'échantillons ?</strong><br>
Commandez gratuitement des échantillons de toile pour voir la couleur en vrai.
</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">🛡️ Garantie 5 ans</strong><br>
Tous nos stores sont garantis 5 ans, fabriqués en France.
</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">💳 Paiement en 4× sans frais</strong><br>
Étalez votre paiement sur 4 mois, sans intérêts.
</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">📞 Parlez à un expert</strong><br>
03 88 XX XX XX — Lun-Ven 9h-18h
</td></tr>
</table>
${ctaButton("Reprendre ma configuration →", `${SITE_URL}/store-coffre?restore=true`)}
`);
}

function email3(cart: any, promoCode?: string) {
  const promoBlock = promoCode
    ? `<div style="background-color:#e8f5e9;border:2px solid #4A5E3A;border-radius:8px;padding:20px;margin:16px 0;text-align:center;">
<p style="margin:0 0 4px;font-size:14px;font-weight:bold;color:#2e7d32;">🎁 Code promo exclusif</p>
<p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:24px;font-weight:bold;color:#333;letter-spacing:2px;">${promoCode}</p>
<p style="margin:0;font-size:12px;color:#8a7e6b;">Utilisez-le dans votre panier avant qu'il n'expire !</p>
</div>`
    : "";

  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">⏰ Dernière chance — votre configuration expire</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Votre configuration sur-mesure va bientôt être supprimée. Finalisez votre commande avant qu'il ne soit trop tard.</p>
${configBlock(cart)}
${promoBlock}
<div style="background-color:#fef3f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:16px 0;">
<p style="margin:0;font-size:13px;color:#991b1b;">⚠️ Après ce rappel, votre configuration sera définitivement supprimée.</p>
</div>
${ctaButton("Finaliser ma commande →", `${SITE_URL}/store-coffre?restore=true`)}
`);
}

// ── Handler ────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY not configured");

    const resend = new Resend(resendApiKey);
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Read transactional email from DB, fallback to env
    const { data: generalSettings } = await supabaseAdmin.from("admin_settings").select("data").eq("id", "general").single();
    const fromEmail = (generalSettings?.data as any)?.transactionalEmail || Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = Deno.env.get("FROM_NAME") || "Mon Store";

    // Fetch eligible carts
    const { data: carts, error: fetchError } = await supabaseAdmin
      .from("abandoned_carts")
      .select("*")
      .eq("converted", false)
      .lt("touch_count", 3)
      .not("email", "is", null);

    if (fetchError) throw new Error(`Fetch error: ${fetchError.message}`);
    if (!carts || carts.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const now = new Date();
    let processed = 0;

    // Check for a default recovery promo code
    const { data: promoCodes } = await supabaseAdmin
      .from("promo_codes")
      .select("code")
      .eq("active", true)
      .lte("valid_from", now.toISOString())
      .gte("valid_until", now.toISOString())
      .limit(1);

    const recoveryPromoCode = promoCodes?.[0]?.code;

    for (const cart of carts) {
      const updatedAt = new Date(cart.updated_at);
      const lastEmail = cart.last_email_sent_at ? new Date(cart.last_email_sent_at) : null;
      const hoursSinceUpdate = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60);
      const hoursSinceLastEmail = lastEmail
        ? (now.getTime() - lastEmail.getTime()) / (1000 * 60 * 60)
        : Infinity;

      let shouldSend = false;
      let subject = "";
      let html = "";

      if (cart.touch_count === 0 && hoursSinceUpdate >= 1) {
        shouldSend = true;
        subject = "Votre store sur-mesure vous attend 🌞";
        html = email1(cart.cart_data);
      } else if (cart.touch_count === 1 && hoursSinceLastEmail >= 24) {
        shouldSend = true;
        subject = "💡 Des questions sur votre store ?";
        html = email2(cart.cart_data);
      } else if (cart.touch_count === 2 && hoursSinceLastEmail >= 72) {
        shouldSend = true;
        subject = "⏰ Dernière chance — votre configuration expire";
        html = email3(cart.cart_data, recoveryPromoCode);
      }

      if (!shouldSend) continue;

      try {
        await resend.emails.send({
          from: `${fromName} <${fromEmail}>`,
          to: [cart.email!],
          subject,
          html,
        });

        await supabaseAdmin
          .from("abandoned_carts")
          .update({
            touch_count: cart.touch_count + 1,
            last_email_sent_at: now.toISOString(),
            promo_code_used: cart.touch_count === 2 ? recoveryPromoCode || null : cart.promo_code_used,
          })
          .eq("id", cart.id);

        processed++;
        console.log(`Sent email ${cart.touch_count + 1}/3 to ${cart.email}`);
      } catch (emailErr) {
        console.error(`Failed to send to ${cart.email}:`, emailErr);
      }
    }

    return new Response(JSON.stringify({ processed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("process-abandoned-carts error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
