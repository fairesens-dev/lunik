

# Plan : Remplacer "Recevoir mon devis" par un bloc d'astuces de mesure à l'étape 1

## Modification

**Fichier** : `src/pages/ConfigurateurPage.tsx` — lignes 473-484

Conditionner le rendu du bloc `SaveConfigCTA` selon l'étape active :
- **Étape "01"** : Afficher un bloc d'astuces pour bien mesurer (débord de 40 cm de chaque côté, hauteur de pose ~2m, avancée recommandée, inclinaison 15°)
- **Étapes "02" et "03"** : Garder le `SaveConfigCTA` actuel

```tsx
{activeStep === "01" ? (
  <div className="mt-10 border-t border-border pt-8">
    <div className="border border-border bg-secondary/30 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Ruler className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Astuces pour bien mesurer</span>
      </div>
      <ul className="text-xs text-muted-foreground space-y-2">
        <li>→ Prévoyez un débord de ~40 cm de chaque côté</li>
        <li>→ L'avancée correspond à la profondeur d'ombre souhaitée</li>
        <li>→ Hauteur de pose recommandée : ~2 m minimum</li>
        <li>→ Inclinaison standard : environ 15°</li>
      </ul>
    </div>
  </div>
) : (
  <div className="mt-10 border-t border-border pt-8">
    <SaveConfigCTA ... />
  </div>
)}
```

Import `Ruler` depuis `lucide-react` (ligne 2).

