

# Visuel produit dynamique pour le configurateur

Remplacement du placeholder statique "Apercu produit" par un visuel SVG qui reagit en temps reel aux choix de l'utilisateur (couleurs, dimensions, options).

---

## Fichiers a creer

### 1. `src/components/product/DynamicProductVisual.tsx`

Composant React pur (pas de dependance externe) qui affiche un store banne en SVG composite avec plusieurs couches superposees dans un conteneur `position: relative` :

**Props :**
```text
toileColor: { hex: string; label: string }
armatureColor: { hex: string; label: string }
options: { motorisation: boolean; led: boolean; packConnect: boolean }
width: number (cm)
projection: number (cm)
className?: string
```

**Couches (z-order croissant) :**
- Couche 0 : Fond de scene — gradient ciel vers terrasse (CSS gradients)
- Couche 1 : Structure SVG armature (coffre, bras, barre frontale, supports muraux) — couleur appliquee via `fill={armatureColor.hex}` directement (pas de CSS filter, plus fiable)
- Couche 2 : Toile (fabric) — rectangle positionne entre le coffre et la barre frontale, colore avec `toileColor.hex`, texture via `repeating-linear-gradient` subtil, leger `perspective/rotateX` pour l'effet 3D
- Couche 3 : Lueur LED — bande lumineuse jaune pale sous la barre frontale, visible uniquement si `options.led || options.packConnect`, avec `box-shadow` glow
- Couche 4 : Badge "Motorise" — pastille en haut a droite, visible si `options.motorisation || options.packConnect`
- Couche 5 : Overlay dimensions (`width x projection cm`, fond noir semi-transparent, en bas a gauche) + pastilles couleur (en bas a droite)

**Proportions dynamiques :** Le ratio `projection/width` (clampe entre 0.3 et 0.8) influence la hauteur des bras et de la toile dans le SVG, donnant un apercu proportionnel.

**Transition :** Le conteneur a `transition: all 300ms ease` pour un effet fluide quand les valeurs changent.

### 2. Vignettes preconfigurees

3 miniatures sous le visuel principal, chacune est un `DynamicProductVisual` en petit format :

1. **Config actuelle** (bordure accent, label "Votre config")
2. **Style epure** : Toile Blanc Ecru + Armature Blanc, aucune option
3. **Style audacieux** : Toile Noir + Armature Noir, toutes options

Clic sur une vignette = previsualisation temporaire dans le visuel principal.
Bouton "Appliquer cette config" pour valider et mettre a jour les vrais states du configurateur.

---

## Fichiers a modifier

### `src/components/product/ConfiguratorSection.tsx`

**Colonne gauche (lignes 60-84) :**
- Remplacer le `div` placeholder gris (`aspect-[4/3] bg-stone-200`) par le composant `DynamicProductVisual`
- Passer les props depuis les valeurs du configurateur
- Ajouter les 3 vignettes dessous
- Ajouter un state `previewConfig` pour gerer la previsualisation temporaire d'une vignette
- Conserver les badges textuels existants (dimensions, couleur toile, armature, options) sous les vignettes

### `src/contexts/ConfiguratorSettingsContext.tsx`

**Type `ColorEntry` (ligne 24-29) :**
- Ajouter un champ optionnel `photoUrl?: string` au type `ColorEntry`

### `src/pages/admin/AdminConfiguratorPage.tsx`

**Composant `ColorsTab` (lignes 219-298) :**
- Ajouter dans chaque ligne de couleur un champ d'upload image (uniquement pour le tab "toile")
- Input `type="file"` accept `image/*`
- Upload vers Supabase Storage bucket `product-photos`
- Miniature 60x60px si photo existante + bouton supprimer
- Helper text : "Photo optionnelle. Si fournie, remplace le rendu CSS."

### `DynamicProductVisual.tsx` — logique photo

Si `toileColor` a un `photoUrl` non vide :
- Afficher la photo reelle en fond a la place des couches SVG 0-2
- Appliquer un filtre CSS leger pour adapter la teinte armature
- Conserver les couches 3-5 (LED, badge, overlays)

---

## Migration SQL

Creation d'un bucket Storage public `product-photos` pour heberger les photos de store par coloris :

```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('product-photos', 'product-photos', true);

CREATE POLICY "Anyone can view product photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-photos');

CREATE POLICY "Authenticated users can upload product photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete product photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-photos' AND auth.role() = 'authenticated');
```

---

## Resume des modifications

| Fichier | Action |
|---------|--------|
| `src/components/product/DynamicProductVisual.tsx` | Creer — composant visuel SVG multicouche |
| `src/components/product/ConfiguratorSection.tsx` | Modifier — integrer le visuel + vignettes |
| `src/contexts/ConfiguratorSettingsContext.tsx` | Modifier — ajouter `photoUrl` a `ColorEntry` |
| `src/pages/admin/AdminConfiguratorPage.tsx` | Modifier — ajouter upload photo par coloris |
| Migration SQL | Creer bucket `product-photos` |

