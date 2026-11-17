import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PlanPage from './pages/PlanPage.jsx';
import StatsPage from './pages/StatsPage.jsx';

// Placeholder pages until you build them.
function ComingSoon({ title }) {
  return (
    <main style={{ padding: 24 }}>
      <h1>{title}</h1>
      <p>Coming soon.</p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="/login" element={<ComingSoon title="Log in" />} />
    </Routes>
  );
}
