'use client';

// ============================================================================
//  DoodleBackground - Floating thematic doodles for AERION
//  Features: Flash/Lightning, Water Droplets, K+/Cl- Ionic Nodes,
//  Cellulose Micro-fibers, Battery Cells, and Wind Energy Waves.
//  Optimized for high aesthetic appeal in both Light and Dark mode.
// ============================================================================

export default function DoodleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. TOP-LEFT: Lightning / Energy Flash Burst */}
      <svg
        className="absolute top-20 left-[4%] w-24 h-24 stroke-emerald-600/30 dark:stroke-emerald-400/15 fill-none animate-float-slow transition-colors"
        viewBox="0 0 100 100"
      >
        {/* Lightning bolt doodle */}
        <path
          d="M50 5 L30 45 L52 45 L40 95 L75 40 L52 40 Z"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
        />
        {/* Spark accents */}
        <path d="M20 25 L12 20 M25 15 L20 8 M80 30 L90 25 M75 18 L82 10" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* 2. TOP-RIGHT: Water Droplets & Moisture Condensation */}
      <svg
        className="absolute top-16 right-[7%] w-28 h-28 stroke-sky-600/30 dark:stroke-sky-400/15 fill-sky-500/5 animate-pulse-slow transition-colors"
        viewBox="0 0 100 100"
      >
        {/* Main water drop */}
        <path
          d="M50 15 C50 15 25 50 25 68 C25 82 36 92 50 92 C64 92 75 82 75 68 C75 50 50 15 50 15 Z"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Inner humidity highlight */}
        <path d="M40 60 A12 12 0 0 0 45 78" strokeWidth="2" strokeLinecap="round" />
        {/* Small floating droplet */}
        <circle cx="82" cy="35" r="5" strokeWidth="1.5" />
        <circle cx="20" cy="40" r="3.5" strokeWidth="1.5" />
      </svg>

      {/* 3. MID-LEFT: K+ / Cl- Ionic Molecular Lattice */}
      <svg
        className="absolute top-[42%] left-[2%] w-32 h-32 stroke-amber-600/30 dark:stroke-amber-400/15 text-amber-700 dark:text-amber-300 fill-none animate-float-delayed transition-colors"
        viewBox="0 0 120 120"
      >
        {/* Hexagonal ion ring */}
        <polygon points="60,20 95,40 95,80 60,100 25,80 25,40" strokeWidth="1.5" strokeDasharray="4 3" />
        {/* Center K+ ion node */}
        <circle cx="60" cy="60" r="14" strokeWidth="2" className="fill-amber-500/10" />
        <text x="60" y="65" textAnchor="middle" fill="currentColor" fontSize="11" fontFamily="monospace" fontWeight="bold">
          K⁺
        </text>
        {/* Outer Cl- ion satellite */}
        <circle cx="95" cy="40" r="10" strokeWidth="1.5" className="fill-sky-500/10" />
        <text x="95" y="44" textAnchor="middle" fill="currentColor" fontSize="9" fontFamily="monospace">
          Cl⁻
        </text>
        {/* Orbital ring */}
        <ellipse cx="60" cy="60" rx="42" ry="18" strokeWidth="1" strokeDasharray="2 4" transform="rotate(-25 60 60)" />
      </svg>

      {/* 4. MID-RIGHT: Bio-Cellulose Fiber Network & Eco Leaf Glyph */}
      <svg
        className="absolute top-[48%] right-[3%] w-32 h-32 stroke-emerald-600/30 dark:stroke-emerald-400/15 fill-none animate-float-slow transition-colors"
        viewBox="0 0 120 120"
      >
        {/* Leaf outline */}
        <path
          d="M20 100 C30 60 60 30 100 20 C90 60 60 90 20 100 Z"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Vein lines (Cellulose nanopores) */}
        <path d="M20 100 L100 20 M45 75 L65 70 M60 60 L80 50 M75 45 L90 35" strokeWidth="1.5" strokeLinecap="round" />
        {/* Moisture absorption arrow */}
        <path d="M35 30 Q50 35 60 25 M55 20 L60 25 L55 30" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* 5. BOTTOM-LEFT: Battery Storage & Capacitor Circuit Doodle */}
      <svg
        className="absolute bottom-20 left-[6%] w-28 h-28 stroke-sky-600/30 dark:stroke-sky-400/15 text-sky-700 dark:text-sky-300 fill-none animate-pulse-slow transition-colors"
        viewBox="0 0 100 100"
      >
        {/* Battery node */}
        <rect x="25" y="30" width="50" height="40" rx="8" strokeWidth="2" />
        <rect x="75" y="42" width="6" height="16" rx="2" strokeWidth="2" />
        {/* Charge bars inside */}
        <line x1="37" y1="42" x2="37" y2="58" strokeWidth="3" strokeLinecap="round" />
        <line x1="47" y1="42" x2="47" y2="58" strokeWidth="3" strokeLinecap="round" />
        <line x1="57" y1="42" x2="57" y2="58" strokeWidth="3" strokeLinecap="round" />
        {/* Voltage plus/minus glyphs */}
        <text x="35" y="24" fill="currentColor" fontSize="12" fontFamily="monospace" fontWeight="bold">+</text>
        <text x="65" y="24" fill="currentColor" fontSize="14" fontFamily="monospace" fontWeight="bold">-</text>
      </svg>

      {/* 6. BOTTOM-RIGHT: Atmospheric Wave & Energy Harvest Ripples */}
      <svg
        className="absolute bottom-24 right-[7%] w-36 h-28 stroke-emerald-600/30 dark:stroke-emerald-400/15 fill-none animate-float-delayed transition-colors"
        viewBox="0 0 140 100"
      >
        {/* Flowing moisture waves */}
        <path
          d="M10 30 Q35 10 70 30 T130 30"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 55 Q45 35 80 55 T135 55"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="6 3"
        />
        <path
          d="M10 80 Q40 60 75 80 T130 80"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Micro spark burst */}
        <polygon points="110,12 113,20 121,23 113,26 110,34 107,26 99,23 107,20" strokeWidth="1.5" />
      </svg>

      {/* 7. CENTER TOP AMBIENT: Cosmic Spark & Energy Star */}
      <svg
        className="absolute top-[8%] left-[48%] w-16 h-16 stroke-amber-600/30 dark:stroke-amber-400/15 fill-none animate-pulse-slow transition-colors"
        viewBox="0 0 60 60"
      >
        <path d="M30 5 L30 55 M5 30 L55 30 M12 12 L48 48 M12 48 L48 12" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="30" cy="30" r="4" strokeWidth="1.5" className="fill-amber-500/20" />
      </svg>
    </div>
  );
}
