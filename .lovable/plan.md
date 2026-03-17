

# Plan : Inverser Armature (02) et Toile (03)

Dans `src/components/product/ConfiguratorSection.tsx`, échanger les deux blocs :

1. **Lignes 161-167** (actuellement Toile en 02) → devient **03 — Armature** (déplacer le bloc armature lignes 169-197 ici, avec numéro 02)
2. **Lignes 169-197** (actuellement Armature en 03) → devient **02 — Toile** (déplacer le bloc toile ici, avec numéro 03)

Concrètement : le bloc Armature (lignes 169-197) passe en position 02, et le bloc Toile (lignes 161-167) passe en position 03. Les labels `stepLabels[1]`/`stepLabels[2]` suivent le même swap.

| Fichier | Modification |
|---------|-------------|
| `ConfiguratorSection.tsx` | Swap des blocs étapes 02 et 03 |

