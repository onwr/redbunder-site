/**
 * Kırmızı ışıklı Ankara silüeti (Atakule + Kocatepe Camii + şehir blokları).
 * Saf SVG; renk ve parlama CSS ile verilir.
 */
export default function AnkaraSkyline({ className }: { className?: string }) {
  // [x, genişlik, yükseklik] – taban y=200
  const blocks: [number, number, number][] = [
    [0, 28, 46], [26, 22, 70], [46, 30, 58], [74, 18, 92], [90, 26, 64],
    [230, 24, 78], [252, 30, 104], [280, 20, 66], [298, 26, 120], [322, 16, 88],
    [392, 22, 96], [412, 30, 132], [440, 18, 84], [456, 28, 110], [482, 22, 72],
    [502, 34, 140], [534, 20, 90], [552, 26, 118], [576, 18, 76], [592, 30, 100],
    [620, 22, 62], [640, 28, 86], [666, 20, 54], [684, 36, 74], [718, 22, 44],
  ];

  // Pencere ışıkları için deterministik "rastgele" noktalar
  const windows = blocks.flatMap(([x, w, h], i) =>
    Array.from({ length: Math.floor(h / 22) }, (_, j) => ({
      x: x + 5 + ((i * 7 + j * 5) % Math.max(1, w - 10)),
      y: 200 - h + 10 + j * 20,
      on: (i + j) % 3 !== 0,
    })),
  );

  return (
    <svg viewBox="0 0 740 200" preserveAspectRatio="xMidYMax meet" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sky-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff1f2a" stopOpacity="0.95" />
          <stop offset="55%" stopColor="#b20710" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#3a0205" stopOpacity="0.2" />
        </linearGradient>
        <filter id="sky-glow" x="-10%" y="-30%" width="120%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g fill="url(#sky-fill)" filter="url(#sky-glow)">
        {blocks.map(([x, w, h]) => (
          <rect key={x} x={x} y={200 - h} width={w} height={h} />
        ))}

        {/* Kocatepe Camii: kubbe + 4 minare */}
        <path d="M122 200v-44a38 38 0 0 1 76 0v44z" />
        <rect x="150" y="104" width="20" height="16" rx="10" />
        {[112, 124, 196, 208].map((x) => (
          <path key={x} d={`M${x} 200V92l3-14 3 14v108z`} />
        ))}

        {/* Atakule: gövde + küre + anten */}
        <rect x="352" y="70" width="14" height="130" />
        <path d="M344 70h30l-4 8h-22z" />
        <ellipse cx="359" cy="50" rx="24" ry="18" />
        <rect x="357" y="12" width="4" height="22" />
        <circle cx="359" cy="10" r="3" />
      </g>

      {/* Pencere ışıkları */}
      <g fill="#ffd166">
        {windows
          .filter((w) => w.on)
          .map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width="3" height="4" opacity="0.55" />
          ))}
      </g>

      {/* Atakule halka ışıkları */}
      <ellipse cx="359" cy="50" rx="24" ry="4" fill="#ffd166" opacity="0.45" />
    </svg>
  );
}
