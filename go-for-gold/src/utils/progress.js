/*
 * Works out whether a station is improving, from the formula in the sketch:
 *   % change = (new - old) / old × 100
 *
 * For the run, a LOWER time is better, so the sign is flipped.
 */

export const IMPROVING_THRESHOLD = 5; // percent. From the sketch: still deciding, so change it here.

export function getPercentChange(previous, current, lowerIsBetter = false) {
  if (!previous) return 0;
  const change = ((current - previous) / previous) * 100;
  return lowerIsBetter ? -change : change;
}

// Returns { key, label, arrow } for the status pill.
export function getProgressStatus(percent) {
  if (percent > IMPROVING_THRESHOLD) return { key: 'improving', label: 'Improving', arrow: '↑' };
  if (percent >= 0) return { key: 'stable', label: 'Stable', arrow: '–' };
  return { key: 'needs-work', label: 'Needs improvement', arrow: '↓' };
}
