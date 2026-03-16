

## Plan : Renommer le bouton et ajouter le texte RGPD + vérifier l'edge function

### Changements frontend

**1. `src/components/product/SaveConfigCTA.tsx`**
- Bouton : "Recevoir ma config →" → "Télécharger mon devis →"
- Titre : "M'envoyer la configuration et le devis par e-mail" → "Recevoir mon devis par e-mail"
- Ajouter sous le champ email un texte RGPD en `text-[10px] text-muted-foreground` :
  > En soumettant ce formulaire, vous acceptez que vos coordonnées soient utilisées par LuniK et son usine partenaire dans le cadre d'une commande de store sur mesure ou à des fins promotionnelles. Vous pouvez vous désinscrire à tout moment.
- Message de succès : "Configuration envoyée !" → "Devis envoyé !"

**2. `src/components/ExitIntentPopup.tsx`**
- Bouton : "Recevoir ma config →" → "Télécharger mon devis →"

### Vérification edge function `send-config-email`

L'edge function est déjà fonctionnelle avec Resend. Quelques corrections à apporter dans le même déploiement :

**3. `supabase/functions/send-config-email/index.ts`**
- Remplacer le header "MON STORE" par "LuniK" (branding correct)
- Remplacer "Configuration sauvegardée !" par "Votre devis LuniK"
- Remplacer le subject "✅ Votre configuration de store sauvegardée" → "📄 Votre devis LuniK sur mesure"
- Remplacer le footer "Mon Store — Protection solaire sur-mesure" → "LuniK — Store banne sur mesure, fabriqué en France"
- Le `FROM_NAME` par défaut passe de "Mon Store" à "LuniK"
- Ajouter les options sélectionnées dans le récapitulatif email (motorisation, LED, pack)
- Ajouter une mention RGPD en bas de l'email

La structure fonctionne : le composant envoie `{ email, cart }`, la fonction lit `cart.configuration` et `cart.pricing` correctement. Les secrets `RESEND_API_KEY` et `FROM_EMAIL` sont déjà configurés. Le JWT est vérifié (pas de `verify_jwt = false`), ce qui est correct car l'appel passe par le client Supabase avec la clé anon.

Après les modifications, redéployer l'edge function.

