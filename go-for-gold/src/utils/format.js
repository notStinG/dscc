// 690 -> "11:30"
export function formatRunTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// "morning" | "afternoon" | "evening", based on the device clock.
export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

// Award thresholds used by the progress bar. Confirm these against the
// current IPPT rules before launch.
export const AWARDS = { pass: 61, silver: 75, gold: 85 };

export function getAward(score) {
  if (score >= AWARDS.gold) return 'Gold';
  if (score >= AWARDS.silver) return 'Silver';
  if (score >= AWARDS.pass) return 'Pass';
  return 'Fail';
}
