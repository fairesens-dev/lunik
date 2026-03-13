

## Plan: Nouvelle charte graphique LuniK

### Couleurs extraites des logos

| Nom | Hex | Usage |
|---|---|---|
| **Sage Green** | `#7B8E7B` | Fond foncé, sidebar admin, footer |
| **Terracotta** | `#B8826B` | Accent principal, CTA, boutons |
| **Beige clair** | `#EDEDEB` | Fond de page (background) |
| **Beige chaud** | `#E8E4DF` | Fond secondaire (cards, muted) |
| **Noir doux** | `#2A2A2A` | Texte principal (foreground) |
| **Blanc cassé** | `#F5F4F2` | Texte sur fond foncé |

### Logos a copier (6 variants utiles)

| Fichier uploadé | Destination | Usage |
|---|---|---|
| `Beige-3` (wordmark noir, pas de tagline) | `src/assets/logo-lunik.png` | Header scrolled, pages internes |
| `Green-2` (wordmark blanc, pas de tagline) | `src/assets/logo-lunik-white.png` | Header transparent (hero), footer |
| `Beige-2` (full logo noir + "SIMPLEMENT UNIQUE") | `src/assets/logo-lunik-full.png` | Admin login, favicon area |
| `Green-1` (full logo blanc + "SIMPLEMENT UNIQUE") | `src/assets/logo-lunik-full-white.png` | Footer, admin sidebar |
| `Green-3` (wordmark blanc + "STORE") | `src/assets/logo-lunik-store-white.png` | Admin sidebar |
| `Beige-4` (wordmark noir + "STORE") | `src/assets/logo-lunik-store.png` | Configurateur page |

### Fichiers modifies

| Fichier | Changement |
|---|---|
| `src/index.css` | Remplacer toutes les CSS variables `:root` et `.dark` avec la nouvelle palette (sage green, terracotta, beige) |
| `src/components/Header.tsx` | Importer les nouveaux logos |
| `src/components/Footer.tsx` | Logo full blanc avec tagline |
| `src/components/admin/AdminLayout.tsx` | Sidebar en sage green au lieu de gray-900, logo store blanc |
| `src/pages/admin/AdminLoginPage.tsx` | Logo full avec tagline |
| `src/components/ContactWidget.tsx` | Header du widget en sage green (#7B8E7B) au lieu de #1a4a42 |
| `tailwind.config.ts` | Ajouter couleur `terra` pour accents terracotta |

### Nouvelle palette CSS (index.css)

```text
:root (light mode — beige theme)
  --background:     40 5% 93%       (#EDEDEB)
  --foreground:     0 0% 16%        (#2A2A2A)
  --card:           30 6% 96%       (#F5F4F2)
  --primary:        100 10% 52%     (#7B8E7B sage green)
  --primary-fg:     40 10% 95%      (beige clair)
  --accent:         18 33% 57%      (#B8826B terracotta)
  --accent-fg:      0 0% 100%       (blanc)
  --secondary:      30 8% 88%
  --muted:          30 6% 88%
  --muted-fg:       0 0% 45%
  --border:         30 6% 85%
  --sidebar-bg:     100 10% 52%     (sage green)
  --sidebar-fg:     40 10% 95%
```

### Impact visuel

- **Site public** : fond beige chaud, boutons terracotta, accents sage green
- **Admin** : sidebar sage green (au lieu de gris fonce), boutons terracotta
- **Widget chatbot** : header sage green
- **Hero** : conserve le fond video, texte blanc, boutons terracotta
- **Footer** : fond sage green, logo blanc avec tagline "SIMPLEMENT UNIQUE"

