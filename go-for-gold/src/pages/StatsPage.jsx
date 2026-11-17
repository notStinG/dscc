import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import PerformanceChart from '../components/PerformanceChart.jsx';
import { getStats } from '../api/mockApi.js';
import { formatRunTime } from '../utils/format.js';
import { getPercentChange, getProgressStatus, IMPROVING_THRESHOLD } from '../utils/progress.js';
import './StatsPage.css';

// How each station is shown in "Your progress"
const STATIONS = [
  { key: 'runSeconds', name: '2.4 km run', lowerIsBetter: true, format: formatRunTime },
  { key: 'pushUps', name: 'Push-ups', lowerIsBetter: false, format: (v) => `${v} reps` },
  { key: 'sitUps', name: 'Sit-ups', lowerIsBetter: false, format: (v) => `${v} reps` },
];

export default function StatsPage() {
  // 1. State
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [range, setRange] = useState('month'); // 'month' | 'day'

  // 2. Load once
  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError('Could not load your statistics. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // 4. Loading and error states
  if (loading) {
    return <div className="app-shell"><p className="page-status">Loading statistics…</p></div>;
  }
  if (!stats) {
    return <div className="app-shell"><p className="page-status" role="alert">{error}</p></div>;
  }

  const isMonth = range === 'month';
  const chartPoints = isMonth ? stats.monthly : stats.daily;

  // 5. The page
  return (
    <div className="app-shell">
      <Header username="Tan" title="Statistics" />

      <main className="page">
        {/* Highest / lowest */}
        <div className="stats__tiles">
          <div className="card stats__tile">
            <span className="stats__tile-label">Highest IPPT score</span>
            <span className="stats__tile-value stats__tile-value--gold">{stats.highest.score}</span>
            <span className="stats__tile-when">{stats.highest.when}</span>
          </div>
          <div className="card stats__tile">
            <span className="stats__tile-label">Lowest IPPT score</span>
            <span className="stats__tile-value">{stats.lowest.score}</span>
            <span className="stats__tile-when">{stats.lowest.when}</span>
          </div>
        </div>

        {/* Overall performance chart */}
        <section className="card stats__chart-card">
          <div className="stats__chart-head">
            <div>
              <h2 className="stats__h2">Overall performance</h2>
              <span className="stats__caption">{isMonth ? 'Average score per month' : 'Score per day, this month'}</span>
            </div>
            <div className="toggle" role="group" aria-label="Chart range">
              <button type="button" aria-pressed={isMonth} onClick={() => setRange('month')}>Month</button>
              <button type="button" aria-pressed={!isMonth} onClick={() => setRange('day')}>Day</button>
            </div>
          </div>
          <PerformanceChart points={chartPoints} labelEvery={isMonth ? 1 : 5} />
        </section>

        {/* Your progress */}
        <section className="card stats__progress">
          <h2 className="stats__h2">Your progress</h2>
          <ul className="stats__rows">
            {STATIONS.map((s) => {
              const { previous, current } = stats.stations[s.key];
              const pct = getPercentChange(previous, current, s.lowerIsBetter);
              const status = getProgressStatus(pct);
              const pctText = `${pct >= 0 ? '+' : '−'}${Math.abs(pct).toFixed(1)}%`;
              return (
                <li key={s.key} className="stats__row">
                  <div className="stats__row-text">
                    <span className="stats__row-name">{s.name}</span>
                    <span className="stats__row-change">
                      {s.format(previous)} → {s.format(current)} · {pctText}
                    </span>
                  </div>
                  <span className={`pill pill--${status.key}`}>
                    <span aria-hidden="true">{status.arrow}</span> {status.label}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="stats__legend">
            Improving: over {IMPROVING_THRESHOLD}% better · Stable: 0–{IMPROVING_THRESHOLD}% · Needs improvement: below 0%
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
