import { useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import ScoreCard from '../components/ScoreCard.jsx';
import StationStepper from '../components/StationStepper.jsx';
import { getHomeData, updateStations } from '../api/mockApi.js';
import { formatRunTime, getGreeting } from '../utils/format.js';
import './HomePage.css';

export default function HomePage() {
  // 1. State: what the page needs to remember
  const [data, setData] = useState(null);     // everything from the API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Load data once, when the page first appears
  useEffect(() => {
    getHomeData()
      .then(setData)
      .catch(() => setError('Could not load your data. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // 3. When a stepper changes: update the screen at once, then save
  function handleStationChange(key, newValue) {
    const nextStations = { ...data.stations, [key]: newValue };
    setData({ ...data, stations: nextStations });
    updateStations(nextStations).catch(() => setError('Could not save. Check your connection.'));
  }

  // 4. Loading and error states
  if (loading) {
    return <div className="app-shell"><p className="home__status">Loading…</p></div>;
  }
  if (!data) {
    return <div className="app-shell"><p className="home__status" role="alert">{error}</p></div>;
  }

  const { user, score, stations } = data;

  // 5. The page itself
  return (
    <div className="app-shell">
      <Header username={user.username} showBigTitle />

      <main className="home">
        {error && <p className="home__error" role="alert">{error}</p>}

        <section className="home__greeting">
          <h2>Good {getGreeting()}, {user.username}!</h2>
          <p>
            Your personalised IPPT training companion. Train smarter, track your
            progress and improve your weakest station with guidance made for you.
          </p>
        </section>

        <ScoreCard current={score.current} previous={score.previous} />

        <section className="home__stations">
          <h3 className="section-label">Update your stations</h3>
          <div className="home__station-grid">
            <StationStepper
              label="Push-ups" unit="reps"
              value={stations.pushUps}
              onChange={(v) => handleStationChange('pushUps', v)}
            />
            <StationStepper
              label="Sit-ups" unit="reps"
              value={stations.sitUps}
              onChange={(v) => handleStationChange('sitUps', v)}
            />
            <StationStepper
              label="2.4 km" unit="min:sec"
              value={stations.runSeconds}
              display={formatRunTime(stations.runSeconds)}
              step={5} min={480} max={1200}
              decLabel="Run time 5 seconds faster"
              incLabel="Run time 5 seconds slower"
              onChange={(v) => handleStationChange('runSeconds', v)}
            />
          </div>
        </section>

        <a className="home__book" href="https://www.ns.sg" target="_blank" rel="noreferrer">
          Book your IPPT now ↗
        </a>
      </main>

      <BottomNav />
    </div>
  );
}
