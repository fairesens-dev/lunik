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

// ─── HELPERS ───────────────────────────────────────────────────────

function formatPrice(n: number) {
  return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(d: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function firstName(fullName: string) {
  return (fullName || "").replace(/^(M\.|Mme)\s*/, "").split(" ")[0] || "Client";
}

// ─── CONTACT BLOCK ────────────────────────────────────────────────

function contactBlock(extra?: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0;">
<tr><td style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;padding:20px;text-align:center;">
<p style="margin:0 0 8px;font-family:${FONT};font-size:14px;color:#2d2d2d;font-weight:bold;">Besoin d'aide ?</p>
<p style="margin:0;font-family:${FONT};font-size:13px;color:#555555;line-height:1.8;">
📞 <a href="tel:+33368381030" style="color:#4A5E3A;text-decoration:none;font-weight:bold;">03 68 38 10 30</a><br>
📧 <a href="mailto:contact@lunik-store.fr" style="color:#4A5E3A;text-decoration:none;">contact@lunik-store.fr</a><br>
<span style="color:#8a8a88;font-size:12px;">Lundi – Vendredi : 9h – 18h</span>
</p>
${extra ? `<p style="margin:12px 0 0;font-size:12px;color:#c17c3e;font-weight:bold;font-family:${FONT};">${extra}</p>` : ""}
</td></tr></table>`;
}

// ─── EMAIL WRAPPER ─────────────────────────────────────────────────

function emailWrapper(content: string, ref?: string) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>LuniK</title></head>
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
${content}
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
${ref ? `<p style="margin:0 0 8px;font-size:10px;color:#b0b0ae;text-align:center;font-family:${FONT};">Réf. commande : ${ref}</p>` : ""}
<p style="margin:0 0 8px;font-size:10px;color:#b0b0ae;text-align:center;font-family:${FONT};">
<a href="#" style="color:#b0b0ae;text-decoration:underline;">Se désinscrire</a> de nos communications
</p>
<p style="margin:0;font-size:10px;color:#b0b0ae;text-align:center;font-family:${FONT};">© 2026 LuniK. Tous droits réservés.</p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── CTA BUTTONS ──────────────────────────────────────────────────

function ctaButton(text: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background-color:#4A5E3A;border-radius:6px;padding:14px 32px;">
<a href="${url}" style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;display:inline-block;font-family:${FONT};">${text}</a>
</td></tr></table>`;
}

function ctaButtonOutline(text: string, url: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px auto;">
<tr><td style="border:2px solid #4A5E3A;border-radius:6px;padding:12px 28px;background-color:transparent;">
<a href="${url}" style="color:#4A5E3A;text-decoration:none;font-size:13px;font-weight:bold;display:inline-block;font-family:${FONT};">${text}</a>
</td></tr></table>`;
}

// ─── CONFIG SUMMARY ────────────────────────────────────────────────

function configSummary(order: any) {
  const options = order.options || [];
  const optionsText = options.length > 0 ? options.map((o: string) => `+ ${o}`).join("<br>") : "";
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;margin:20px 0;">
<tr><td style="padding:24px;">
<p style="margin:0 0 4px;font-size:11px;color:#8a8a88;text-transform:uppercase;letter-spacing:1px;font-family:${FONT};">VOTRE COMMANDE — Réf. ${order.ref}</p>
<p style="margin:0 0 12px;font-family:${FONT};font-size:18px;font-weight:bold;color:#2d2d2d;">Store Coffre Sur-Mesure</p>
<p style="margin:0 0 4px;font-size:14px;color:#555555;font-family:${FONT};">${order.width} × ${order.projection} cm · Toile ${order.toile_color || "—"} · ${order.armature_color || "—"}</p>
${optionsText ? `<p style="margin:8px 0 0;font-size:13px;color:#4A5E3A;font-family:${FONT};">${optionsText}</p>` : ""}
<hr style="border:none;border-top:1px solid #e5e5e3;margin:16px 0;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#2d2d2d;font-family:${FONT};">Total payé : ${formatPrice(order.amount)} €</p>
<p style="margin:4px 0 0;font-size:12px;color:#8a8a88;font-family:${FONT};">Date : ${formatDate(order.created_at)}</p>
</td></tr></table>`;
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────

function progressBar(activeIndex: number) {
  const steps = ["Commandé", "Fabrication", "Expédié", "Livré"];
  const dots = steps.map((s, i) => {
    const isActive = i <= Math.floor(activeIndex);
    const isInProgress = !isActive && i === Math.ceil(activeIndex) && activeIndex % 1 !== 0;
    let dotStyle: string;
    if (isActive) {
      dotStyle = "width:16px;height:16px;border-radius:50%;background:#4A5E3A;margin:0 auto 6px;";
    } else if (isInProgress) {
      dotStyle = "width:16px;height:16px;border-radius:50%;background:#ffffff;border:3px solid #4A5E3A;margin:0 auto 6px;box-sizing:border-box;";
    } else {
      dotStyle = "width:16px;height:16px;border-radius:50%;background:#ddd;margin:0 auto 6px;";
    }
    const labelColor = isActive ? "#4A5E3A" : isInProgress ? "#4A5E3A" : "#999";
    const labelWeight = isActive || isInProgress ? "bold" : "normal";
    return `<td style="text-align:center;padding:0 8px;width:25%;">
<div style="${dotStyle}"></div>
<span style="font-size:10px;color:${labelColor};font-weight:${labelWeight};font-family:${FONT};">${s}</span>
</td>`;
  }).join("");

  return `<table role="presentation" cellpadding="0" cellspacing="0" width="80%" style="margin:20px auto;">
<tr>${dots}</tr></table>`;
}

// ─── ICON HEADER ──────────────────────────────────────────────────

function iconHeader(emoji: string, bgColor: string, title: string) {
  return `<div style="text-align:center;margin-bottom:24px;">
<div style="width:60px;height:60px;border-radius:50%;background-color:${bgColor};margin:0 auto 16px;line-height:60px;font-size:30px;">${emoji}</div>
<h1 style="margin:0;font-family:${FONT};font-size:24px;font-weight:bold;color:#2d2d2d;line-height:1.3;">${title}</h1>
</div>`;
}

// ─── TEMPLATES ─────────────────────────────────────────────────────

function orderReceivedTemplate(order: any) {
  const prenom = firstName(order.client_name);
  return emailWrapper(`
${iconHeader("✅", "#e8f5e9", `Merci pour votre commande, ${prenom} !`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Nous avons bien reçu votre commande et votre paiement. Votre store sur-mesure va bientôt être transmis à notre atelier de fabrication en France.</p>

<!-- Alert block: 48h modification -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#fff8e1;border-left:4px solid #c17c3e;border-radius:4px;padding:20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="width:32px;vertical-align:top;font-size:20px;">⏰</td>
<td>
<p style="margin:0 0 6px;font-family:${FONT};font-size:15px;color:#2d2d2d;font-weight:bold;">Vous avez 48h pour modifier votre commande</p>
<p style="margin:0;font-size:13px;color:#555555;line-height:1.6;font-family:${FONT};">Une fois ce délai passé, votre commande sera transmise à l'usine et ne pourra plus être modifiée. Pour tout changement (dimensions, coloris, options), contactez-nous rapidement.</p>
</td>
</tr></table>
${ctaButtonOutline("Modifier ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}
</td></tr></table>

${configSummary(order)}

<h2 style="font-family:${FONT};font-size:18px;font-weight:bold;color:#2d2d2d;margin:28px 0 16px;">Et maintenant ?</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:10px 0;font-size:14px;color:#555555;border-bottom:1px solid #f0f0ee;font-family:${FONT};">
<strong style="color:#4A5E3A;font-size:16px;margin-right:8px;">1.</strong> Transmission à l'usine sous 48h</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#555555;border-bottom:1px solid #f0f0ee;font-family:${FONT};">
<strong style="color:#4A5E3A;font-size:16px;margin-right:8px;">2.</strong> Fabrication sur-mesure en France (4-5 semaines)</td></tr>
<tr><td style="padding:10px 0;font-size:14px;color:#555555;font-family:${FONT};">
<strong style="color:#4A5E3A;font-size:16px;margin-right:8px;">3.</strong> Livraison à domicile par transporteur</td></tr>
</table>

${ctaButton("Suivre ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}
${contactBlock()}
`, order.ref);
}

function inProductionTemplate(order: any) {
  const prenom = firstName(order.client_name);
  const estimatedDate = new Date(Date.now() + 35 * 86400000).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return emailWrapper(`
${iconHeader("🏭", "#fff3e0", `Votre store est entre de bonnes mains, ${prenom} !`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Bonne nouvelle ! Votre commande a été transmise à notre atelier partenaire en France. Nos artisans commencent la fabrication de votre store sur-mesure.</p>

${progressBar(1)}

<!-- Estimated delivery -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;padding:20px;text-align:center;">
<p style="margin:0 0 8px;font-size:13px;color:#8a8a88;text-transform:uppercase;letter-spacing:0.5px;font-family:${FONT};">Date de livraison estimée</p>
<p style="margin:0;font-family:${FONT};font-size:20px;font-weight:bold;color:#2d2d2d;">Avant le ${estimatedDate}</p>
</td></tr></table>

${configSummary(order)}

<h2 style="font-family:${FONT};font-size:16px;font-weight:bold;color:#2d2d2d;margin:28px 0 12px;">💡 Le saviez-vous ?</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f6;border-radius:8px;margin:0 0 20px;">
<tr><td style="padding:20px;">
<p style="margin:0;font-size:13px;color:#555555;line-height:1.8;font-family:${FONT};">
Chaque store LuniK est fabriqué individuellement selon vos dimensions exactes, avec une <strong style="color:#2d2d2d;">toile Dickson certifiée OEKO-TEX</strong> et une <strong style="color:#2d2d2d;">motorisation Somfy</strong>. Notre atelier partenaire français est spécialisé dans les stores sur-mesure depuis plus de 30 ans.
</p>
</td></tr></table>

${ctaButton("Suivre ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}
${contactBlock()}
`, order.ref);
}

function readyToShipTemplate(order: any) {
  const prenom = firstName(order.client_name);
  return emailWrapper(`
${iconHeader("📦", "#e3f2fd", `Votre store est terminé, ${prenom} !`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">La fabrication de votre store sur-mesure est terminée ! Il est désormais prêt et en attente de prise en charge par notre transporteur.</p>

${progressBar(1.5)}

<!-- Transporter info block -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#f0f4ff;border-left:4px solid #4A5E3A;border-radius:4px;padding:20px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="width:32px;vertical-align:top;font-size:20px;">📧</td>
<td>
<p style="margin:0 0 6px;font-family:${FONT};font-size:15px;color:#2d2d2d;font-weight:bold;">Prochaine étape : la livraison</p>
<p style="margin:0;font-size:13px;color:#555555;line-height:1.6;font-family:${FONT};">Vous allez recevoir prochainement un e-mail de notre transporteur avec un lien pour choisir votre créneau de livraison. Pensez à vérifier vos spams !</p>
</td>
</tr></table>
</td></tr></table>

${configSummary(order)}

<h2 style="font-family:${FONT};font-size:16px;font-weight:bold;color:#2d2d2d;margin:28px 0 12px;">Préparez l'arrivée de votre store</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">✅ Vérifiez l'espace disponible sur votre terrasse ou façade</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">🔧 Préparez l'outillage nécessaire (perceuse, niveau à bulle)</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">📖 <a href="${SITE_URL}/faq" style="color:#4A5E3A;text-decoration:underline;">Consultez notre guide d'installation</a></td></tr>
</table>

${ctaButton("Suivre ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}
${contactBlock()}
`, order.ref);
}

function inDeliveryTemplate(order: any, tracking?: { carrier?: string; tracking_number?: string; tracking_url?: string }) {
  const prenom = firstName(order.client_name);
  const carrier = tracking?.carrier || "notre transporteur";
  const trackingNumber = tracking?.tracking_number || "";
  const trackingUrl = tracking?.tracking_url || "#";
  return emailWrapper(`
${iconHeader("🚚", "#e3f2fd", `Votre store arrive bientôt, ${prenom} !`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Votre store a été pris en charge par le transporteur et est en route vers chez vous !</p>

${progressBar(2)}

${trackingNumber ? `
<!-- Tracking block -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#f0f4ff;border:2px solid #4A5E3A;border-radius:8px;padding:24px;text-align:center;">
<p style="margin:0 0 4px;font-size:12px;color:#8a8a88;text-transform:uppercase;letter-spacing:0.5px;font-family:${FONT};">Transporteur : ${carrier}</p>
<p style="margin:0 0 16px;font-family:'Courier New',monospace;font-size:20px;font-weight:bold;color:#2d2d2d;letter-spacing:1px;">${trackingNumber}</p>
${ctaButton("Suivre mon colis →", trackingUrl)}
</td></tr></table>` : ""}

${order.client_address ? `
<!-- Delivery address -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;padding:20px;">
<p style="margin:0 0 8px;font-size:11px;color:#8a8a88;text-transform:uppercase;letter-spacing:0.5px;font-family:${FONT};">Adresse de livraison</p>
<p style="margin:0;font-size:14px;color:#2d2d2d;line-height:1.6;font-family:${FONT};">${order.client_name}<br>${order.client_address}${order.client_address2 ? "<br>" + order.client_address2 : ""}<br>${order.client_postal_code} ${order.client_city}<br>${order.client_country || "France"}</p>
</td></tr></table>` : ""}

<h2 style="font-family:${FONT};font-size:16px;font-weight:bold;color:#2d2d2d;margin:28px 0 12px;">Jour J — Ce qu'il faut prévoir</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">📏 Un espace dégagé pour réceptionner le colis (le store mesure environ ${order.width} cm)</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">👥 Prévoyez une deuxième personne pour manipuler le colis</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">📸 Vérifiez l'état du colis à la réception et photographiez tout dommage éventuel</td></tr>
</table>

${ctaButton("Suivre ma commande", `${SITE_URL}/suivi?ref=${order.ref}`)}
${contactBlock("Un problème à la réception ? Contactez notre SAV immédiatement.")}
`, order.ref);
}

function deliveredTemplate(order: any) {
  const prenom = firstName(order.client_name);
  const purchaseDate = formatDate(order.created_at);
  const warrantyDate = new Date(new Date(order.created_at).getTime() + 5 * 365.25 * 86400000);
  const warrantyExpiry = warrantyDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  return emailWrapper(`
${iconHeader("☀️", "#fff8e1", `Bienvenue au soleil, ${prenom} !`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Votre store LuniK a été livré avec succès. Nous espérons qu'il transformera vos moments en extérieur !</p>

${progressBar(3)}

<h2 style="font-family:${FONT};font-size:16px;font-weight:bold;color:#2d2d2d;margin:28px 0 12px;">Ressources utiles</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">📖 <a href="${SITE_URL}/faq" style="color:#4A5E3A;text-decoration:underline;">Guide d'installation</a></td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">🎬 <a href="${SITE_URL}/faq" style="color:#4A5E3A;text-decoration:underline;">Vidéo tutoriel de montage</a></td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">📋 <a href="${SITE_URL}/faq" style="color:#4A5E3A;text-decoration:underline;">Guide d'entretien de votre store</a></td></tr>
</table>

<!-- Warranty card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;padding:24px;">
<p style="margin:0 0 4px;font-size:11px;color:#8a8a88;text-transform:uppercase;letter-spacing:1px;font-family:${FONT};">Votre carte de garantie</p>
<p style="margin:0 0 8px;font-family:${FONT};font-size:16px;font-weight:bold;color:#2d2d2d;">Store Coffre Sur-Mesure — Réf. ${order.ref}</p>
<p style="margin:0 0 4px;font-size:13px;color:#555555;font-family:${FONT};">Date d'achat : ${purchaseDate}</p>
<p style="margin:0 0 12px;font-size:13px;color:#555555;font-family:${FONT};">Garantie valable jusqu'au : <strong style="color:#2d2d2d;">${warrantyExpiry}</strong></p>
<p style="margin:0;font-size:16px;font-weight:bold;color:#4A5E3A;font-family:${FONT};">✅ Garantie 5 ans</p>
</td></tr></table>

<!-- Review block -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
<tr><td style="text-align:center;padding:24px;background-color:#f7f7f6;border-radius:8px;">
<p style="margin:0 0 12px;font-family:${FONT};font-size:16px;font-weight:bold;color:#2d2d2d;">Êtes-vous satisfait(e) de votre store ?</p>
<p style="margin:0 0 12px;font-size:32px;letter-spacing:4px;">⭐⭐⭐⭐⭐</p>
<p style="margin:0 0 16px;font-size:12px;color:#8a8a88;font-family:${FONT};">Votre avis aide d'autres clients à choisir en confiance.</p>
${ctaButton("Laisser un avis", "https://www.trustpilot.com")}
</td></tr></table>

${contactBlock()}
`, order.ref);
}

function samplesConfirmationTemplate(order: any) {
  const prenom = firstName(order.client_name);
  const sampleItems = (order.sample_items || []) as Array<{ name: string; hex: string; refCode?: string }>;
  const samplesList = sampleItems.map(item =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #e5e5e3;font-size:14px;color:#2d2d2d;font-family:${FONT};">
      <span style="display:inline-block;width:16px;height:16px;background:${item.hex || '#ccc'};border-radius:3px;vertical-align:middle;margin-right:8px;border:1px solid #e5e5e3;"></span>
      ${item.name}${item.refCode ? ` <span style="color:#8a8a88;font-size:12px;">(${item.refCode})</span>` : ''}
    </td></tr>`
  ).join('');

  return emailWrapper(`
${iconHeader("🎨", "#e8f5e9", `Vos échantillons arrivent bientôt, ${prenom} !`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Merci pour votre commande d'échantillons ! Vous recevrez prochainement vos coloris de toile Dickson pour les découvrir en conditions réelles.</p>

<!-- Sample items -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f6;border:1px solid #e5e5e3;border-radius:8px;margin:20px 0;">
<tr><td style="padding:16px 12px 8px;">
<p style="margin:0 0 8px;font-size:11px;color:#8a8a88;text-transform:uppercase;letter-spacing:1px;font-family:${FONT};">VOS ÉCHANTILLONS — Réf. ${order.ref}</p>
</td></tr>
${samplesList}
<tr><td style="padding:12px;border-top:1px solid #e5e5e3;">
<p style="margin:0;font-size:16px;font-weight:bold;color:#2d2d2d;font-family:${FONT};">Total : ${formatPrice(order.amount)} €</p>
<p style="margin:4px 0 0;font-size:12px;color:#8a8a88;font-family:${FONT};">${sampleItems.length} échantillon${sampleItems.length > 1 ? 's' : ''}</p>
</td></tr>
</table>

<h2 style="font-family:${FONT};font-size:18px;font-weight:bold;color:#2d2d2d;margin:28px 0 12px;">Et après ?</h2>
<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Une fois vos échantillons reçus, rendez-vous sur notre configurateur pour créer votre store sur-mesure !</p>

${ctaButton("Configurer mon store →", `${SITE_URL}/configurateur`)}
${contactBlock()}
`, order.ref);
}

function savRequestedTemplate(order: any, extra?: { ticketRef?: string; issue?: string }) {
  const prenom = firstName(order.client_name);
  const ticketRef = extra?.ticketRef || "En cours d'attribution";
  const issue = extra?.issue || "—";
  const today = formatDate(new Date().toISOString());
  return emailWrapper(`
${iconHeader("🔧", "#f5f5f5", `Nous avons bien reçu votre demande, ${prenom}`)}

<p style="font-size:14px;color:#555555;line-height:1.7;font-family:${FONT};">Nous avons bien pris en compte votre signalement concernant votre commande. Notre équipe SAV va analyser votre demande et vous recontacter dans les plus brefs délais.</p>

<!-- SAV summary -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#fef3f2;border:1px solid #fecaca;border-radius:8px;padding:24px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;font-family:${FONT};">
<tr><td style="padding:6px 0;color:#8a8a88;width:45%;">Numéro de ticket SAV</td><td style="padding:6px 0;font-weight:bold;color:#2d2d2d;">${ticketRef}</td></tr>
<tr><td style="padding:6px 0;color:#8a8a88;">Commande concernée</td><td style="padding:6px 0;color:#2d2d2d;">Réf. ${order.ref}</td></tr>
<tr><td style="padding:6px 0;color:#8a8a88;">Date de la demande</td><td style="padding:6px 0;color:#2d2d2d;">${today}</td></tr>
<tr><td style="padding:6px 0;color:#8a8a88;">Problème signalé</td><td style="padding:6px 0;color:#2d2d2d;">${issue}</td></tr>
</table>
</td></tr></table>

<!-- What happens next -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
<tr><td style="background-color:#f7f7f6;border-radius:8px;padding:24px;">
<p style="margin:0 0 12px;font-family:${FONT};font-size:16px;color:#2d2d2d;font-weight:bold;">Ce qui va se passer</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">
<tr><td style="padding:8px 0;font-size:14px;color:#555555;border-bottom:1px solid #e5e5e3;font-family:${FONT};">
<strong style="color:#4A5E3A;">1.</strong> Notre équipe analyse votre demande (sous 24-48h ouvrées)</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;border-bottom:1px solid #e5e5e3;font-family:${FONT};">
<strong style="color:#4A5E3A;">2.</strong> Un technicien vous contacte pour diagnostic</td></tr>
<tr><td style="padding:8px 0;font-size:14px;color:#555555;font-family:${FONT};">
<strong style="color:#4A5E3A;">3.</strong> Nous vous proposons une solution (réparation, remplacement, etc.)</td></tr>
</table>
</td></tr></table>

<p style="font-size:13px;color:#555555;line-height:1.7;margin:16px 0;font-family:${FONT};">Pour rappel, votre store bénéficie d'une <strong style="color:#2d2d2d;">garantie de 5 ans</strong>. Si votre problème est couvert, la prise en charge sera intégralement à notre charge.</p>

${configSummary(order)}

${ctaButton("Suivre ma demande SAV", `${SITE_URL}/suivi?ref=${order.ref}`)}
${contactBlock("Besoin urgent ? Appelez-nous directement au 03 68 38 10 30")}
`, order.ref);
}

// ─── TEMPLATE MAP ──────────────────────────────────────────────────

type EmailType = "order_received" | "in_production" | "ready_to_ship" | "in_delivery" | "delivered" | "sav_requested" | "samples_confirmation";

function getEmailConfig(type: EmailType, order: any, extra?: any): { subject: string; html: string; to: string } | null {
  const configs: Record<EmailType, { subject: string; html: string; to: string }> = {
    order_received: {
      subject: `✅ Commande confirmée — Réf. ${order.ref} | LuniK`,
      html: orderReceivedTemplate(order),
      to: order.client_email,
    },
    in_production: {
      subject: `🏭 Votre store est en fabrication — Réf. ${order.ref} | LuniK`,
      html: inProductionTemplate(order),
      to: order.client_email,
    },
    ready_to_ship: {
      subject: `📦 Votre store est prêt ! — Réf. ${order.ref} | LuniK`,
      html: readyToShipTemplate(order),
      to: order.client_email,
    },
    in_delivery: {
      subject: `🚚 Votre store est en route ! — Réf. ${order.ref} | LuniK`,
      html: inDeliveryTemplate(order, extra?.tracking),
      to: order.client_email,
    },
    delivered: {
      subject: `☀️ Votre store est livré — profitez-en ! — Réf. ${order.ref} | LuniK`,
      html: deliveredTemplate(order),
      to: order.client_email,
    },
    sav_requested: {
      subject: `🔧 Votre demande SAV a bien été reçue — Réf. ${order.ref} | LuniK`,
      html: savRequestedTemplate(order, extra),
      to: order.client_email,
    },
    samples_confirmation: {
      subject: `🎨 Vos échantillons de toile sont en chemin ! — Réf. ${order.ref} | LuniK`,
      html: samplesConfirmationTemplate(order),
      to: order.client_email,
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

    // Read template overrides from DB
    const { data: templateOverride } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("id", type)
      .single();

    // Check if template is disabled
    if (templateOverride && templateOverride.is_active === false) {
      console.log(`Template ${type} is disabled, skipping send`);
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "template_disabled" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Apply subject override if exists
    if (templateOverride?.subject_override) {
      emailConfig.subject = templateOverride.subject_override.replace("{ref}", order.ref);
    }

    // Read transactional email from DB, fallback to env
    const { data: generalSettings } = await supabaseAdmin.from("admin_settings").select("data").eq("id", "general").single();
    const fromEmail = (generalSettings?.data as any)?.transactionalEmail || Deno.env.get("FROM_EMAIL") || "onboarding@resend.dev";
    const fromName = (generalSettings?.data as any)?.senderName || "LuniK";
    const replyToEmail = (generalSettings?.data as any)?.replyTo || undefined;

    // Override recipient for test emails
    const recipient = extra?.testRecipient || emailConfig.to;

    // Send email via Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [recipient],
      ...(replyToEmail ? { reply_to: replyToEmail } : {}),
      subject: emailConfig.subject,
      html: emailConfig.html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      throw new Error(`Failed to send email: ${emailError.message}`);
    }

    console.log(`Email sent: type=${type}, to=${emailConfig.to}, id=${emailData?.id}`);

    // Update emails_sent on the order (append)
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
