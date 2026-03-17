

# Plan : Système de cache d'images avec édition sur image de base

## Problème
Chaque sélection de couleur génère une image from scratch via l'IA, ce qui coûte cher en crédits. Aucune persistance entre sessions.

## Architecture proposée

```text
┌─ Frontend (DynamicProductVisual) ─┐
│  appelle generate-store-image      │
│  avec toileHex, armatureHex, led   │
└──────────┬─────────────────────────┘
           ▼
┌─ Edge Function ───────────────────┐
│ 1. Lookup dans generated_visuals  │
│    → trouvé ? retourne l'URL      │
│ 2. Sinon : envoie image de base   │
│    + prompt d'édition à Gemini    │
│ 3. Upload résultat dans Storage   │
│ 4. Insert dans generated_visuals  │
│ 5. Retourne l'URL publique        │
└───────────────────────────────────┘
```

## Étapes

### 1. Uploader l'image de base
L'utilisateur devra fournir le fichier "Store Coffre Rayy LUNIK (67).jpg". On le stockera dans le bucket `product-photos` sous `base/store-base.jpg`.

### 2. Créer la table `generated_visuals`
```sql
CREATE TABLE public.generated_visuals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  toile_color_hex text NOT NULL,
  armature_color_hex text NOT NULL,
  led boolean NOT NULL DEFAULT false,
  toile_photo_url text,
  storage_path text NOT NULL,
  public_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_visuals ENABLE ROW LEVEL SECURITY;

-- Lecture publique (le configurateur est public)
CREATE POLICY "Public can read generated_visuals"
  ON public.generated_visuals FOR SELECT TO public
  USING (true);

-- Insert/delete réservés aux edge functions (service role)
CREATE POLICY "Service role can insert generated_visuals"
  ON public.generated_visuals FOR INSERT TO service_role
  WITH CHECK (true);
```

Le `cache_key` sera : `{toileHex}-{armatureHex}-{led}-{toilePhotoUrl||""}`.

### 3. Modifier l'Edge Function `generate-store-image`

**Nouveau flux :**
1. Construire le `cache_key`
2. Query `generated_visuals` avec le service role client — si trouvé, retourner `public_url`
3. Sinon, récupérer l'URL publique de l'image de base depuis le bucket `product-photos/base/store-base.jpg`
4. Appeler Gemini en mode **édition d'image** (envoyer l'image de base + prompt d'édition) au lieu de générer from scratch
5. Décoder le base64, uploader dans `product-photos/generated/{cache_key}.png`
6. Insérer dans `generated_visuals`
7. Retourner l'URL publique

**Prompt d'édition** (au lieu de génération) :
```
Edit this photograph of a retractable awning:
- Change the fabric/canvas color to {toileColorLabel} ({toileColorHex})
- Change the aluminum frame color to {armatureColorLabel} ({armatureColorHex})
- {LED instruction}
Keep everything else identical. Do not add text or watermarks.
```

Si `toilePhotoUrl` est fourni (motif/rayure), l'image de la toile est aussi envoyée en référence.

### 4. Simplifier le Frontend `DynamicProductVisual.tsx`

- Supprimer le cache in-memory `imageCache` (le cache est maintenant côté serveur)
- Le composant appelle toujours l'edge function, mais celle-ci retourne instantanément si l'image est en cache
- Garder le debounce de 800ms

### 5. Nettoyage

- Le bucket `product-photos` a déjà un sous-dossier. On ajoute `generated/` pour les images générées et `base/` pour l'image source.

## Détails techniques

- **Modèle** : `google/gemini-2.5-flash-image` en mode édition (image + texte en entrée)
- **Stockage** : bucket `product-photos` (déjà public)
- **Table** : `generated_visuals` avec index unique sur `cache_key`
- **Service role** : l'edge function utilise `SUPABASE_SERVICE_ROLE_KEY` pour insérer dans la table (RLS bloque les inserts anonymes)
- **Coût** : une seule génération par combinaison couleur/armature/LED, puis gratuit à vie

