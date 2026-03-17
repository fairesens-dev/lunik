const MeasurementDiagram = () => (
  <svg viewBox="0 0 320 210" className="w-full h-auto" aria-label="Schéma des cotes d'un store banne">
    <defs>
      <marker id="ah" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
        <path d="M0,0 L6,2 L0,4" fill="hsl(var(--primary))" />
      </marker>
      <marker id="ah-rev" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto-start-reverse">
        <path d="M0,0 L6,2 L0,4" fill="hsl(var(--primary))" />
      </marker>
      <marker id="ah-muted" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto">
        <path d="M0,0 L6,2 L0,4" fill="hsl(var(--muted-foreground))" />
      </marker>
      <marker id="ah-muted-rev" markerWidth="6" markerHeight="4" refX="3" refY="2" orient="auto-start-reverse">
        <path d="M0,0 L6,2 L0,4" fill="hsl(var(--muted-foreground))" />
      </marker>
    </defs>

    {/* Mur */}
    <rect x="30" y="10" width="16" height="180" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--border))" strokeWidth="0.8" />
    <text x="38" y="8" textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontWeight="500">Mur</text>

    {/* Sol */}
    <line x1="20" y1="190" x2="310" y2="190" stroke="hsl(var(--border))" strokeWidth="1.2" />
    {/* Hachures sol */}
    {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
      <line key={i} x1={30 + i * 22} y1="190" x2={22 + i * 22} y2="198" stroke="hsl(var(--border))" strokeWidth="0.6" />
    ))}

    {/* Coffre store */}
    <rect x="46" y="42" width="30" height="14" rx="5" fill="hsl(var(--foreground))" opacity="0.75" />

    {/* Toile déployée (inclinée ~15°) */}
    <polygon
      points="76,44 260,80 260,86 76,56"
      fill="hsl(var(--primary))"
      opacity="0.18"
      stroke="hsl(var(--primary))"
      strokeWidth="0.8"
    />
    {/* Ligne supérieure toile */}
    <line x1="76" y1="44" x2="260" y2="80" stroke="hsl(var(--primary))" strokeWidth="1.2" />

    {/* Bras articulé */}
    <line x1="80" y1="56" x2="160" y2="110" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.5" />
    <line x1="160" y1="110" x2="258" y2="86" stroke="hsl(var(--foreground))" strokeWidth="1.5" opacity="0.5" />
    {/* Articulations */}
    <circle cx="80" cy="56" r="2.5" fill="hsl(var(--foreground))" opacity="0.6" />
    <circle cx="160" cy="110" r="2.5" fill="hsl(var(--foreground))" opacity="0.4" />
    <circle cx="258" cy="86" r="2.5" fill="hsl(var(--foreground))" opacity="0.6" />

    {/* Volant (barre de charge) */}
    <line x1="258" y1="78" x2="258" y2="92" stroke="hsl(var(--foreground))" strokeWidth="2" opacity="0.6" />

    {/* ── COTE 1 : Avancée (horizontal) ── */}
    <line x1="50" y1="140" x2="258" y2="140" stroke="hsl(var(--primary))" strokeWidth="0.8" markerStart="url(#ah-rev)" markerEnd="url(#ah)" />
    {/* Lignes de rappel */}
    <line x1="50" y1="56" x2="50" y2="145" stroke="hsl(var(--primary))" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
    <line x1="258" y1="92" x2="258" y2="145" stroke="hsl(var(--primary))" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
    <rect x="112" y="131" width="70" height="14" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.9" />
    <text x="147" y="141" textAnchor="middle" fontSize="8" fill="hsl(var(--primary))" fontWeight="600">Avancée</text>

    {/* ── COTE 2 : Hauteur sous linteau ── */}
    <line x1="18" y1="49" x2="18" y2="190" stroke="hsl(var(--muted-foreground))" strokeWidth="0.8" markerStart="url(#ah-muted-rev)" markerEnd="url(#ah-muted)" />
    <text x="14" y="125" textAnchor="middle" fontSize="7" fill="hsl(var(--muted-foreground))" fontWeight="600" transform="rotate(-90, 14, 125)">≥ 2 m</text>

    {/* ── COTE 3 : Inclinaison ── */}
    {/* Ligne horizontale de référence */}
    <line x1="76" y1="44" x2="140" y2="44" stroke="hsl(var(--primary))" strokeWidth="0.5" strokeDasharray="3,2" opacity="0.5" />
    {/* Arc d'angle */}
    <path d="M120,44 A40,40 0 0,1 117,55" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.8" />
    <text x="132" y="54" fontSize="7" fill="hsl(var(--primary))" fontWeight="600">≥ 15°</text>

    {/* ── COTE 4 : Largeur (en haut, vue de face) ── */}
    <line x1="76" y1="28" x2="260" y2="28" stroke="hsl(var(--primary))" strokeWidth="0.8" markerStart="url(#ah-rev)" markerEnd="url(#ah)" />
    <line x1="76" y1="24" x2="76" y2="42" stroke="hsl(var(--primary))" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
    <line x1="260" y1="24" x2="260" y2="42" stroke="hsl(var(--primary))" strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5" />
    <rect x="120" y="20" width="92" height="13" rx="3" fill="hsl(var(--background))" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.9" />
    <text x="166" y="29.5" textAnchor="middle" fontSize="7" fill="hsl(var(--primary))" fontWeight="600">Largeur + 40 cm/côté</text>
  </svg>
);

export default MeasurementDiagram;
