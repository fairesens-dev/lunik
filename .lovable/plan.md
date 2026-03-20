
# Plan : Refonte visuelle des emails transactionnels

## Changements globaux (3 fichiers edge functions)

### Design cible
- **Fond page** : `#eeeeec` (au lieu de `#f5f0e8`)
- **Fond contenu** : `#ffffff` (déjà en place)
- **Pas de 3ème couleur** — supprimer le beige `#f9f7f4` des blocs internes, utiliser `#f7f7f6` (gris très léger) à la place pour rester cohérent
- **Typo** : `'DM Sans', Arial, Helvetica, sans-serif` partout — supprimer tous les `font-family:Georgia,serif` (titres h1, h2, etc.)
- **Logo** : Remplacer le texte "LUNIK" / "MON STORE" par une balise `<img>` pointant vers le logo hébergé sur le bucket Supabase public : `https://gejgtkgqyzdfbsbxujgl.supabase.co/storage/v1/object/public/Website/logo-lunik.png`. Hauteur 40px, centré. Il faudra d'abord uploader `logo-lunik.png` dans le bucket Website si pas déjà fait.
- **Footer professionnel** : Refonte complète avec réassurances

### Nouveau footer (dans `emailWrapper`)

Remplacer le footer actuel par :
- Logo LuniK (petit, 28px de haut)
- Réassurances en ligne : `🇫🇷 Fabriqué en France` · `🛡️ Garantie 5 ans` · `💳 Paiement sécurisé` · `📞 03 68 38 10 30`
- Liens sociaux (Instagram, Facebook, Pinterest)
- Adresse complète : LuniK — 15 Chemin de la Loupe, 67420 Ranrupt, France
- Liens légaux : CGV · Mentions légales · Cookies
- Réf. commande si applicable
- Lien de désinscription
- Copyright © 2026 LuniK. Tous droits réservés.

### Fichiers modifiés

| Fichier | Modifications |
|---|---|
| `supabase/functions/send-order-email/index.ts` | `emailWrapper` (header logo + fond + footer), `contactBlock`, `iconHeader`, `configSummary`, `progressBar`, toutes les fonctions template — supprimer Georgia partout, fond `#eeeeec` |
| `supabase/functions/send-config-email/index.ts` | Même refonte : logo, fond `#eeeeec`, typo sans-serif, footer professionnel |
| `supabase/functions/process-abandoned-carts/index.ts` | Même refonte : `emailWrapper`, `ctaButton`, `configBlock` — logo, fond, typo, footer |

### Étape préalable
- Uploader `src/assets/logo-lunik.png` dans le bucket Supabase `Website` pour avoir une URL publique accessible dans les emails

### Redéploiement
Les 3 edge functions devront être redéployées après modification.
