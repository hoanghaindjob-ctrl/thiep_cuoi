/**
 * The invitation's ornament vocabulary, drawn rather than photographed.
 *
 * Everything here is built from one primitive — a ring of petals — so the
 * peony spray, the divider rosette and the seal's flourish are visibly the
 * same plant at three sizes. Geometry is computed once at module scope so the
 * server and the client emit identical path data.
 */
const TAU = Math.PI * 2;

type Ring = {
  inner: number;
  outer: number;
  count: number;
  offset: number;
  wobble?: number;
  seed?: number;
};

function petals(ring: Ring) {
  const { inner, outer, count, offset, wobble = 0.09, seed = 0 } = ring;
  const step = TAU / count;
  const at = (angle: number, radius: number) =>
    `${(Math.cos(angle) * radius).toFixed(2)} ${(Math.sin(angle) * radius).toFixed(2)}`;
  return Array.from({ length: count }, (_, i) => {
    const a = offset + i * step;
    // Petals overlap slightly and vary in reach, so the bloom reads as drawn
    // by hand rather than stamped out by a compass.
    const a0 = a - step * 0.52;
    const a1 = a + step * 0.52;
    const reach = outer * (1 + wobble * Math.sin(i * 2.399 + seed));
    return `M${at(a0, inner)}C${at(a0, reach * 1.06)} ${at(a1, reach * 1.06)} ${at(a1, inner)}`;
  }).join("");
}

/** A peony seen from above: four rings of petals tightening toward the eye. */
const BLOOM: Ring[] = [
  { inner: 31, outer: 48, count: 13, offset: 0.06, wobble: 0.11, seed: 1.1 },
  { inner: 21, outer: 36, count: 10, offset: 0.31, wobble: 0.1, seed: 2.7 },
  { inner: 12, outer: 25, count: 8, offset: 0.12, wobble: 0.09, seed: 4.2 },
  { inner: 4, outer: 14, count: 6, offset: 0.45, wobble: 0.08, seed: 5.9 },
];
const BLOOM_PATHS = BLOOM.map(petals);
const STAMENS = Array.from({ length: 11 }, (_, i) => {
  const a = (i / 11) * TAU + 0.3;
  const r = 4.4 + 1.6 * Math.sin(i * 2.1);
  return { x: Math.cos(a) * r, y: Math.sin(a) * r };
});

function Bloom({ scale = 1, opacity = 1 }: { scale?: number; opacity?: number }) {
  return (
    <g transform={`scale(${scale})`} opacity={opacity}>
      {BLOOM_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {STAMENS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.1" fill="currentColor" stroke="none" />
      ))}
    </g>
  );
}

/** A bud: the two outermost rings only, squeezed into a teardrop. */
function Bud({ scale = 1 }: { scale?: number }) {
  return (
    <g transform={`scale(${scale})`}>
      <path d={petals({ inner: 6, outer: 17, count: 5, offset: -1.57, wobble: 0.12, seed: 0.7 })} />
      <path d={petals({ inner: 2, outer: 9, count: 3, offset: -1.2, wobble: 0.1, seed: 3 })} />
    </g>
  );
}

const LEAF =
  "M0 0C11 -8 27 -7 36 4C26 14 10 14 0 0ZM3 1.5C13 3 25 4 33 4.2";

/**
 * The corner spray: two blooms, a bud and three leaves off one arcing stem.
 * Drawn in outline so it reads as engraving on the envelope rather than a
 * photograph pasted onto it.
 */
export function PeonySpray({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      <path
        d="M98 300C97 244 89 204 68 174C50 150 35 126 31 98"
        strokeWidth="1.9"
      />
      <path d="M97 258C107 228 126 206 150 192" strokeWidth="1.3" />
      <path d="M86 212C72 194 54 184 34 180" strokeWidth="1.3" />
      <g transform="translate(66 90)">
        <Bloom scale={1} />
      </g>
      <g transform="translate(148 176)">
        <Bloom scale={0.6} opacity={0.95} />
      </g>
      <g transform="translate(30 174) rotate(-28)">
        <Bud scale={1} />
      </g>
      <g transform="translate(104 250) rotate(26)">
        <path d={LEAF} strokeWidth="1.3" />
      </g>
      <g transform="translate(92 224) rotate(198)">
        <path d={LEAF} strokeWidth="1.3" />
      </g>
      <g transform="translate(100 198) rotate(-46)">
        <path d={LEAF} strokeWidth="1.3" />
      </g>
      <g transform="translate(112 282) rotate(210)">
        <path d={LEAF} strokeWidth="1.3" />
      </g>
    </svg>
  );
}

/** The same bloom shrunk to a full stop, used between sections. */
export function Rosette({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-28 -28 56 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={petals({ inner: 7, outer: 23, count: 6, offset: -1.57, wobble: 0 })} />
      <circle cx="0" cy="0" r="3.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * 囍 — the doubled 喜 that means a wedding rather than plain happiness.
 *
 * Set in a 1.1 KB subset of Noto Serif TC (SIL Open Font License) holding this
 * one codepoint. Drawing it from rectangles lost the tapered serif strokes, and
 * no Vietnamese system font is guaranteed to carry it — a tofu box on the seal
 * would be the first thing a guest sees. `font-display: block` in globals.css
 * keeps the seal empty until the glyph is ready instead of flashing a fallback.
 */
export function DoubleHappiness({ size }: { size?: number }) {
  return (
    <span
      className="hy-glyph"
      style={size ? { fontSize: size } : undefined}
      role="img"
      aria-label="Chữ Song Hỷ"
    >
      囍
    </span>
  );
}
