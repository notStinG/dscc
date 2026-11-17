import './PerformanceChart.css';

/*
 * Simple line chart drawn with SVG (no chart library needed).
 *
 * Props:
 *   points      [{ label: 'Jan', score: 58 | null }]   null = no test yet
 *   labelEvery  label the first point, then every Nth (1 = all, 5 = 1, 5, 10…)
 *   goldLine    draws a dashed target line (default 85)
 */

// Drawing area inside the SVG (in SVG units, it scales to fit the screen)
const W = 320;
const H = 200;
const PAD = { left: 30, right: 10, top: 10, bottom: 26 };
const MIN = 50;
const MAX = 90;
const Y_TICKS = [50, 60, 70, 80, 90];

export default function PerformanceChart({ points, labelEvery = 1, goldLine = 85 }) {
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const x = (i) => PAD.left + (points.length === 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (score) => {
    const clamped = Math.min(MAX, Math.max(MIN, score));
    return PAD.top + plotH - ((clamped - MIN) / (MAX - MIN)) * plotH;
  };

  // Only the points that have a score get drawn
  const scored = points
    .map((p, i) => ({ ...p, cx: x(i), cy: p.score == null ? null : y(p.score) }))
    .filter((p) => p.cy != null);

  const linePath = scored.map((p) => `${p.cx.toFixed(1)},${p.cy.toFixed(1)}`).join(' ');

  const summary = scored.length
    ? `Scores from ${scored[0].label} to ${scored[scored.length - 1].label}: ` +
      scored.map((p) => `${p.label} ${p.score}`).join(', ')
    : 'No scores yet';

  return (
    <svg className="perf-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={summary}>
      {/* Horizontal grid lines and y-axis labels */}
      {Y_TICKS.map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className="perf-chart__grid" />
          <text x={PAD.left - 6} y={y(t) + 4} className="perf-chart__ylabel">{t}</text>
        </g>
      ))}

      {/* Gold target line */}
      <line x1={PAD.left} x2={W - PAD.right} y1={y(goldLine)} y2={y(goldLine)} className="perf-chart__gold" />
      <text x={W - PAD.right} y={y(goldLine) - 5} className="perf-chart__gold-label">GOLD {goldLine}</text>

      {/* The line itself */}
      <polyline points={linePath} className="perf-chart__line" />

      {/* Dots, with a hover tooltip */}
      {scored.map((p) => (
        <circle key={p.label} cx={p.cx} cy={p.cy} r="4.5" className="perf-chart__dot">
          <title>{`${p.label}: ${p.score} points`}</title>
        </circle>
      ))}

      {/* X-axis labels */}
      {points.map((p, i) =>
        i === 0 || (i + 1) % labelEvery === 0 ? (
          <text key={p.label} x={x(i)} y={H - 8} className="perf-chart__xlabel">{p.label}</text>
        ) : null
      )}
    </svg>
  );
}
