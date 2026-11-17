import { AWARDS, getAward } from '../utils/format.js';
import './ScoreCard.css';

// Shows the current IPPT score, the change since last test, and
// how far the user is from Silver and Gold.
export default function ScoreCard({ current, previous }) {
  const change = current - previous;
  const award = getAward(current);
  const progress = Math.min(100, (current / AWARDS.gold) * 100);
  const toSilver = Math.max(0, AWARDS.silver - current);
  const toGold = Math.max(0, AWARDS.gold - current);

  return (
    <section className="card score-card">
      <div className="score-card__top">
        <h2 className="section-label">Current IPPT score</h2>
        <span className="score-card__badge">{award}</span>
      </div>

      <div className="score-card__main">
        <span className="score-card__number">{current}</span>
        <span className="score-card__unit">points</span>
        {/* Per the sketch: only show the change when the score went up */}
        {change > 0 && (
          <span className="score-card__change">↑ {change} from last test</span>
        )}
      </div>

      <div
        className="score-card__bar"
        role="progressbar"
        aria-label="Progress to Gold"
        aria-valuemin={0}
        aria-valuemax={AWARDS.gold}
        aria-valuenow={current}
      >
        <div className="score-card__fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="score-card__targets">
        <span>{toSilver > 0 ? `${toSilver} pts to Silver (${AWARDS.silver})` : 'Silver reached'}</span>
        <span>{toGold > 0 ? `${toGold} pts to Gold (${AWARDS.gold})` : 'Gold reached!'}</span>
      </div>
    </section>
  );
}
