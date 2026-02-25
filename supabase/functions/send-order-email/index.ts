import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SITE_URL = "https://lunik.lovable.app";

// ─── HELPERS ───────────────────────────────────────────────────────

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function firstName(fullName: string) {
  return (fullName || "").replace(/^(M\.|Mme)\s*/, "").split(" ")[0] || "Client";
}

// ─── EMAIL WRAPPER ─────────────────────────────────────────────────

function emailWrapper(content: string, ref?: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Mon Store</title></head>
<body style="margin:0;padding:0;background-color:#f5f0e8;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f0e8;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr><td style="background-color:#f5f0e8;padding:24px 32px;text-align:center;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:28px;color:#4A5E3A;letter-spacing:2px;">MON STORE</h1>
<p style="margin:4px 0 0;font-size:12px;color:#8a7e6b;letter-spacing:1px;">Protection solaire sur-mesure</p>
</td></tr>

<!-- CONTENT -->
<tr><td style="background-color:#ffffff;padding:32px;">
${content}
</td></tr>

<!-- FOOTER -->
<tr><td style="padding:24px 32px;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:#8a7e6b;">Mon Store — 12 rue de l'Atelier, 67000 Strasbourg</p>
<p style="margin:0 0 8px;font-size:11px;color:#8a7e6b;">
<a href="${SITE_URL}/cgv" style="color:#4A5E3A;text-decoration:underline;">CGV</a> · 
<a href="${SITE_URL}/mentions-legales" style="color:#4A5E3A;text-decoration:underline;">Mentions légales</a>
</p>
${ref ? `<p style="margin:0;font-size:11px;color:#b0a898;">Réf : ${ref}</p>` : ""}
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── CTA BUTTON ────────────────────────────────────────────────────

function ctaButton(text: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background-color:#4A5E3A;border-radius:6px;padding:14px 32px;">
<a href="${url}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;display:inline-block;">${text}</a>
</td></tr></table>`;
}

// ─── CONFIG SUMMARY ────────────────────────────────────────────────

function configSummary(order: any) {
  const options = order.options || [];
  const optionsText = options.length > 0 ? options.map((o: string) => `+ ${o}`).join("<br>") : "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;margin:16px 0;">
<tr><td style="padding:20px;">
<p style="margin:0 0 4px;font-size:11px;color:#8a7e6b;text-transform:uppercase;letter-spacing:1px;">VOTRE COMMANDE — Réf. ${order.ref}</p>
<p style="margin:0 0 12px;font-family:Georgia,serif;font-size:18px;color:#333;">Store Coffre Sur-Mesure</p>
<p style="margin:0 0 4px;font-size:14px;color:#555;">${order.width} × ${order.projection} cm · Toile ${order.toile_color || "—"} · ${order.armature_color || "—"}</p>
${optionsText ? `<p style="margin:8px 0 0;font-size:13px;color:#4A5E3A;">${optionsText}</p>` : ""}
<hr style="border:none;border-top:1px solid #e8e2d8;margin:16px 0;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#333;">Total payé : ${formatPrice(order.amount)} €</p>
<p style="margin:4px 0 0;font-size:12px;color:#8a7e6b;">Date : ${formatDate(order.created_at)}</p>
</td></tr></table>`;
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────

function progressBar(activeIndex: number) {
  const steps = ["Commandé", "Fabrication", "Expédié", "Livré"];
  const dots = steps.map((s, i) => {
    const active = i <= activeIndex;
    const color = active ? "#4A5E3A" : "#ccc";
    return `<td style="text-align:center;padding:0 4px;">
<div style="width:14px;height:14px;border-radius:50%;background:${color};margin:0 auto 4px;"></div>
<span style="font-size:10px;color:${active ? "#4A5E3A" : "#999"};">${s}</span>
</td>`;
  }).join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px auto;"><tr>${dots}</tr></table>`;
}

// ─── TEMPLATES ─────────────────────────────────────────────────────

function confirmationTemplate(order: any) {
  const prenom = firstName(order.client_name);
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:56px;height:56px;border-radius:50%;background-color:#e8f5e9;margin:0 auto 12px;line-height:56px;font-size:28px;">✅</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Merci pour votre commande, ${prenom} !</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Nous avons bien reçu votre commande et votre paiement. Notre équipe va prendre contact avec vous dans les 24h pour confirmer les détails de fabrication.</p>

${configSummary(order)}

<h2 style="font-family:Georgia,serif;font-size:18px;color:#333;margin:24px 0 12px;">Et maintenant ?</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">1.</strong> Appel de notre équipe sous 24h</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">2.</strong> Fabrication sur-mesure en France (3-4 semaines)</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555;">
<strong style="color:#4A5E3A;">3.</strong> Livraison et installation</td></tr>
</table>

${ctaButton("Suivre ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}

<p style="font-size:12px;color:#8a7e6b;text-align:center;margin-top:16px;">
📞 03 88 XX XX XX · 📧 contact@monstore.fr<br>Lun–Ven 9h–18h
</p>
`, order.ref);
}

function fabricationTemplate(order: any) {
  const prenom = firstName(order.client_name);
  const estimatedDate = new Date(Date.now() + 28 * 86400000).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:56px;height:56px;border-radius:50%;background-color:#fff3e0;margin:0 auto 12px;line-height:56px;font-size:28px;">🏭</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Bonne nouvelle, ${prenom} !</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Votre store est maintenant en cours de fabrication dans notre atelier en France.</p>

<div style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;padding:16px;margin:16px 0;text-align:center;">
<p style="margin:0 0 8px;font-size:13px;color:#8a7e6b;">Date de livraison estimée</p>
<p style="margin:0;font-size:18px;font-weight:bold;color:#333;">Avant le ${estimatedDate}</p>
</div>

${progressBar(1)}
${configSummary(order)}

<h2 style="font-family:Georgia,serif;font-size:16px;color:#333;margin:24px 0 8px;">En attendant</h2>
<p style="font-size:13px;color:#555;line-height:1.6;">
📖 <a href="${SITE_URL}/faq" style="color:#4A5E3A;">Consultez notre FAQ</a><br>
🔧 <a href="${SITE_URL}/sav" style="color:#4A5E3A;">Service après-vente</a><br>
📞 03 88 XX XX XX
</p>

${ctaButton("Suivre ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}
`, order.ref);
}

function shippedTemplate(order: any, trackingInfo?: { carrier?: string; tracking_number?: string; tracking_url?: string }) {
  const prenom = firstName(order.client_name);
  const carrier = trackingInfo?.carrier || "notre transporteur";
  const trackingNumber = trackingInfo?.tracking_number || "";
  const trackingUrl = trackingInfo?.tracking_url || "#";
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:56px;height:56px;border-radius:50%;background-color:#e3f2fd;margin:0 auto 12px;line-height:56px;font-size:28px;">🚚</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Votre store est en route, ${prenom} !</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Votre colis a été pris en charge par ${carrier} et sera livré à votre adresse sous 2 à 5 jours ouvrés.</p>

${progressBar(2)}

${trackingNumber ? `
<div style="background-color:#f0f4ff;border:2px solid #4A5E3A;border-radius:8px;padding:20px;margin:16px 0;text-align:center;">
<p style="margin:0 0 4px;font-size:12px;color:#8a7e6b;text-transform:uppercase;">Transporteur : ${carrier}</p>
<p style="margin:0 0 12px;font-family:'Courier New',monospace;font-size:20px;font-weight:bold;color:#333;letter-spacing:1px;">${trackingNumber}</p>
${ctaButton("Suivre mon colis →", trackingUrl)}
</div>` : ""}

${order.client_address ? `
<div style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;padding:16px;margin:16px 0;">
<p style="margin:0 0 8px;font-size:11px;color:#8a7e6b;text-transform:uppercase;">Adresse de livraison</p>
<p style="margin:0;font-size:14px;color:#333;">${order.client_name}<br>${order.client_address}${order.client_address2 ? "<br>" + order.client_address2 : ""}<br>${order.client_postal_code} ${order.client_city}<br>${order.client_country || "France"}</p>
</div>` : ""}

<h2 style="font-family:Georgia,serif;font-size:16px;color:#333;margin:24px 0 8px;">Pour préparer votre installation</h2>
<p style="font-size:13px;color:#555;line-height:1.8;">
✅ Vérifier l'espace disponible sur votre terrasse<br>
🔧 Préparer l'outillage nécessaire (perceuse, niveau)<br>
📖 <a href="${SITE_URL}/faq" style="color:#4A5E3A;">Télécharger le guide d'installation</a>
</p>

<p style="font-size:12px;color:#8a7e6b;text-align:center;margin-top:20px;">
Besoin d'aide ? 📞 03 88 XX XX XX · 📧 sav@monstore.fr
</p>
`, order.ref);
}

function deliveredTemplate(order: any) {
  const prenom = firstName(order.client_name);
  const purchaseDate = formatDate(order.created_at);
  const warrantyExpiry = new Date(new Date(order.created_at).getTime() + 5 * 365.25 * 86400000).toLocaleDateString("fr-FR");
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<div style="width:56px;height:56px;border-radius:50%;background-color:#fff8e1;margin:0 auto 12px;line-height:56px;font-size:28px;">☀️</div>
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Profitez bien du soleil, ${prenom} !</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">Votre store coffre a été livré. Nous espérons qu'il répond pleinement à vos attentes.</p>

${progressBar(3)}

<h2 style="font-family:Georgia,serif;font-size:16px;color:#333;margin:24px 0 8px;">Ressources d'installation</h2>
<p style="font-size:13px;color:#555;line-height:1.8;">
📖 Guide d'installation PDF<br>
🎬 Vidéo tutoriel<br>
📞 SAV : 03 88 XX XX XX
</p>

<div style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;padding:20px;margin:20px 0;">
<p style="margin:0 0 4px;font-size:11px;color:#8a7e6b;text-transform:uppercase;letter-spacing:1px;">Carte de garantie</p>
<p style="margin:0 0 4px;font-size:14px;color:#333;">Store Coffre Sur-Mesure — Réf. ${order.ref}</p>
<p style="margin:0 0 4px;font-size:13px;color:#555;">Date d'achat : ${purchaseDate}</p>
<p style="margin:0;font-size:13px;color:#555;">Valable jusqu'au : <strong>${warrantyExpiry}</strong></p>
<p style="margin:8px 0 0;font-size:16px;font-weight:bold;color:#4A5E3A;">✅ Garantie 5 ans</p>
</div>

<div style="text-align:center;margin:24px 0;">
<p style="margin:0 0 8px;font-size:14px;color:#333;">Êtes-vous satisfait(e) de votre store ?</p>
<p style="margin:0 0 12px;font-size:32px;letter-spacing:4px;">⭐⭐⭐⭐⭐</p>
<p style="margin:0;font-size:12px;color:#8a7e6b;">Votre avis aide d'autres clients à choisir en confiance.</p>
</div>
${ctaButton("Laisser un avis", "https://www.trustpilot.com")}
`, order.ref);
}

function reviewRequestTemplate(order: any) {
  const prenom = firstName(order.client_name);
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Êtes-vous satisfait(e) de votre store ?</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">${prenom}, cela fait une semaine que votre store est installé. Nous espérons qu'il transforme vos moments en extérieur !</p>

<div style="text-align:center;margin:32px 0;">
<p style="margin:0 0 16px;font-size:36px;letter-spacing:6px;">⭐⭐⭐⭐⭐</p>
<p style="margin:0;font-size:13px;color:#8a7e6b;">Ça prend moins de 2 minutes</p>
</div>
${ctaButton("Laisser un avis Trustpilot", "https://www.trustpilot.com")}

<div style="background-color:#fef3f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:24px 0;">
<p style="margin:0 0 4px;font-size:13px;font-weight:bold;color:#991b1b;">Un problème ?</p>
<p style="margin:0;font-size:13px;color:#555;">Notre service après-vente est là pour vous aider.<br>
📞 03 88 XX XX XX · <a href="${SITE_URL}/sav" style="color:#4A5E3A;">Contacter le SAV</a></p>
</div>
`, order.ref);
}

function cancellationTemplate(order: any) {
  const prenom = firstName(order.client_name);
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Votre commande a été annulée</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">${prenom}, nous confirmons l'annulation de votre commande <strong>${order.ref}</strong>.</p>

<div style="background-color:#f9f7f4;border:1px solid #e8e2d8;border-radius:8px;padding:16px;margin:16px 0;">
<p style="margin:0 0 8px;font-size:14px;color:#333;font-weight:bold;">Informations de remboursement</p>
<p style="margin:0;font-size:14px;color:#555;">Le remboursement de <strong>${formatPrice(order.amount)} €</strong> sera crédité sur votre carte bancaire sous 5 à 10 jours ouvrés.</p>
</div>

<p style="font-size:14px;color:#555;line-height:1.6;">Nous sommes désolés de vous voir partir. Si vous changez d'avis, notre configurateur est toujours disponible :</p>
${ctaButton("Configurer un store", `${SITE_URL}/store-coffre`)}

<p style="font-size:12px;color:#8a7e6b;text-align:center;margin-top:16px;">
📞 03 88 XX XX XX · 📧 contact@monstore.fr
</p>
`, order.ref);
}

function abandonedCartTemplate(order: any) {
  const prenom = firstName(order.client_name || "");
  return emailWrapper(`
<div style="text-align:center;margin-bottom:24px;">
<h1 style="margin:0;font-family:Georgia,serif;font-size:24px;color:#333;">Vous avez laissé quelque chose...</h1>
</div>
<p style="font-size:14px;color:#555;line-height:1.6;">${prenom ? prenom + ", vous" : "Vous"} avez configuré un store sur-mesure il y a peu. Il vous attend !</p>

${configSummary(order)}

<div style="background-color:#fff8e1;border:1px solid #ffe082;border-radius:8px;padding:16px;margin:16px 0;">
<p style="margin:0;font-size:13px;color:#795548;">⚠️ Les prix peuvent évoluer. Finalisez votre commande pour bénéficier de ce tarif.</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
<tr><td style="padding:8px 0;font-size:13px;color:#555;">❓ <strong>Une question ?</strong> — 📞 03 88 XX XX XX</td></tr>
<tr><td style="padding:8px 0;font-size:13px;color:#555;">📦 <strong>Des échantillons ?</strong> — <a href="${SITE_URL}/contact" style="color:#4A5E3A;">Demander des échantillons gratuits</a></td></tr>
<tr><td style="padding:8px 0;font-size:13px;color:#555;">💳 <strong>Le budget ?</strong> — Payez en 4x sans frais dès ${formatPrice((order.amount || 0) / 4)} €/mois</td></tr>
</table>

${ctaButton("Reprendre ma configuration →", `${SITE_URL}/store-coffre`)}
`, order.ref);
}

function adminNewOrderTemplate(order: any, adminUrl: string) {
  return emailWrapper(`
<div style="background-color:#e8f5e9;border-radius:8px;padding:12px 16px;margin-bottom:16px;text-align:center;">
<p style="margin:0;font-size:14px;font-weight:bold;color:#2e7d32;">🛒 NOUVELLE COMMANDE</p>
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
<tr><td style="padding:6px 0;color:#8a7e6b;">Client</td><td style="padding:6px 0;font-weight:bold;color:#333;">${order.client_name}</td></tr>
<tr><td style="padding:6px 0;color:#8a7e6b;">Email</td><td style="padding:6px 0;color:#333;">${order.client_email}</td></tr>
<tr><td style="padding:6px 0;color:#8a7e6b;">Téléphone</td><td style="padding:6px 0;color:#333;">${order.client_phone || "—"}</td></tr>
<tr><td style="padding:6px 0;color:#8a7e6b;">Config</td><td style="padding:6px 0;color:#333;">${order.width}×${order.projection}cm · ${order.toile_color || "—"} · ${order.armature_color || "—"}</td></tr>
<tr><td style="padding:6px 0;color:#8a7e6b;">Options</td><td style="padding:6px 0;color:#333;">${(order.options || []).join(", ") || "—"}</td></tr>
<tr><td style="padding:6px 0;color:#8a7e6b;">Total</td><td style="padding:6px 0;font-size:18px;font-weight:bold;color:#4A5E3A;">${formatPrice(order.amount)} €</td></tr>
<tr><td style="padding:6px 0;color:#8a7e6b;">Paiement</td><td style="padding:6px 0;color:#333;">${order.payment_method === "card" ? "CB ✅" : order.payment_method || "—"}</td></tr>
</table>

${ctaButton("Voir la commande dans l'admin →", adminUrl)}
`, order.ref);
}

// ─── TEMPLATE MAP ──────────────────────────────────────────────────

type EmailType = "confirmation" | "fabrication" | "shipped" | "delivered" | "review_request" | "cancellation" | "abandoned_cart" | "admin_new_order";

function getEmailConfig(type: EmailType, order: any, extra?: any): { subject: string; html: string; to: string } | null {
  const fromName = Deno.env.get("FROM_NAME") || "Mon Store";
  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "";
  const adminUrl = `${SITE_URL}/admin/commandes/${order.id}`;

  const configs: Record<EmailType, { subject: string; html: string; to: string }> = {
    confirmation: {
      subject: `✅ Votre commande Mon Store est confirmée — Réf. ${order.ref}`,
      html: confirmationTemplate(order),
      to: order.client_email,
    },
    fabrication: {
      subject: `🏭 Votre store est en cours de fabrication — Réf. ${order.ref}`,
      html: fabricationTemplate(order),
      to: order.client_email,
    },
    shipped: {
      subject: `🚚 Votre store Mon Store est en route ! — Réf. ${order.ref}`,
      html: shippedTemplate(order, extra?.tracking),
      to: order.client_email,
    },
    delivered: {
      subject: `☀️ Votre store est livré ! — Réf. ${order.ref}`,
      html: deliveredTemplate(order),
      to: order.client_email,
    },
    review_request: {
      subject: `⭐ ${firstName(order.client_name)}, votre avis nous aide beaucoup`,
      html: reviewRequestTemplate(order),
      to: order.client_email,
    },
    cancellation: {
      subject: `Votre commande Mon Store a été annulée — Réf. ${order.ref}`,
      html: cancellationTemplate(order),
      to: order.client_email,
    },
    abandoned_cart: {
      subject: `Votre store sur-mesure vous attend 🌞`,
      html: abandonedCartTemplate(order),
      to: order.client_email,
    },
    admin_new_order: {
      subject: `🛒 Nouvelle commande ${order.ref} — ${formatPrice(order.amount)} €`,
      html: adminNewOrderTemplate(order, adminUrl),
      to: adminEmail,
    },
  };

  return configs[type] || null;
}

// ─── HANDLER ───────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, orderId, extra } = await req.json();

    if (!type || !orderId) {
      throw new Error("Missing required fields: type, orderId");
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY not configured");
    }

    const resend = new Resend(resendApiKey);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch order
    const { data: order, error: fetchError } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    const emailConfig = getEmailConfig(type as EmailType, order, extra);
    if (!emailConfig) {
      throw new Error(`Unknown email type: ${type}`);
    }

    if (!emailConfig.to) {
      throw new Error(`No recipient for email type: ${type}`);
    }

    const fromEmail = Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = Deno.env.get("FROM_NAME") || "Mon Store";

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [emailConfig.to],
      subject: emailConfig.subject,
      html: emailConfig.html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log(`Email sent: type=${type}, to=${emailConfig.to}, id=${emailData?.id}`);

    // Update emails_sent on the order (append)
    if (type !== "admin_new_order") {
      const currentEmails = (order.emails_sent as any[]) || [];
      const updatedEmails = [...currentEmails, {
        type,
        sent_at: new Date().toISOString(),
        resend_id: emailData?.id || null,
      }];

      await supabaseAdmin
        .from("orders")
        .update({ emails_sent: updatedEmails })
        .eq("id", orderId);
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailData?.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("send-order-email error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
