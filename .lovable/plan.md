

## Plan : Refonte complète des emails transactionnels LuniK

### Fichier modifié

**`supabase/functions/send-order-email/index.ts`** — Réécriture complète (~700 lignes)

### Ce qui est conservé (structure)
- Imports (Resend, Supabase client, serve)
- CORS headers, SITE_URL constant
- Handler `serve()` structure (parse JSON, fetch order, fetch admin_settings for fromEmail, send via Resend, log in emails_sent)

### Ce qui change

**1. Helpers** — Conservés avec mises à jour mineures :
- `formatPrice()`, `formatDate()`, `firstName()` : inchangés
- Nouveau : `contactBlock()` — bloc réutilisable (📞 03 68 38 10 30 · 📧 contact@lunik-store.fr · Lun–Ven 9h–18h)
- Nouveau : `ctaButtonOutline(text, url)` — bouton secondaire (bordure #4A5E3A, texte #4A5E3A, fond transparent)

**2. `emailWrapper(content, ref?)`** — Refonte :
- Header : "LUNIK" (pas "MON STORE") en Georgia 28px #4A5E3A + tagline
- Content card : padding `40px 32px` (au lieu de 32px)
- Footer enrichi : adresse LE STORE RAYY (15 Chemin de la Loupe, 67420 Ranrupt), liens CGV/Mentions légales, réseaux sociaux (Instagram, Facebook, Pinterest), référence commande, lien désinscription factice

**3. `progressBar(activeIndex)`** — Amélioré pour supporter un état intermédiaire (index 1.5 pour `ready_to_ship`). Dots 0-1 actifs (#4A5E3A), dot à l'index ceil(1.5) avec bordure "en cours" (ring style), dots suivants inactifs.

**4. `configSummary(order)`** — Inchangé (déjà bon)

**5. Les 6 templates** remplacent les 8 anciens :

| Ancien type | Nouveau type | 
|---|---|
| `confirmation` | `order_received` |
| `fabrication` | `in_production` |
| *(nouveau)* | `ready_to_ship` |
| `shipped` | `in_delivery` |
| `delivered` | `delivered` |
| *(nouveau)* | `sav_requested` |

Templates supprimés : `review_request`, `cancellation`, `abandoned_cart`, `admin_new_order`

Chaque template suit la spec du brief (icône dans cercle coloré, titre Georgia, contenu spécifique, configSummary, CTA, contactBlock).

**6. Type et map** :
```typescript
type EmailType = "order_received" | "in_production" | "ready_to_ship" | "in_delivery" | "delivered" | "sav_requested";
```

**7. `getEmailConfig()`** — Mise à jour des subjects au format `{emoji} {texte} — Réf. ${order.ref} | LuniK`

**8. Handler** :
- `fromName` passe de "Mon Store" à "LuniK"
- `sav_requested` accepte `extra` avec `{ ticketRef, issue }`
- Suppression du cas spécial `admin_new_order` dans le log emails_sent (plus nécessaire)

### Déploiement
La fonction sera redéployée automatiquement après modification.

### Impact sur le code appelant
Les anciens types (`confirmation`, `fabrication`, `shipped`) ne seront plus reconnus. Les appels depuis l'admin devront utiliser les nouveaux types. Cela sera traité séparément si nécessaire.

