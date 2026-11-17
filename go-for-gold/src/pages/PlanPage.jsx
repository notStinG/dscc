import { useCallback, useEffect, useState } from 'react';
import Header from '../components/Header.jsx';
import BottomNav from '../components/BottomNav.jsx';
import ChangePlanModal from '../components/ChangePlanModal.jsx';
import { getTrainingPlan, setDayDone, requestPlanChange } from '../api/mockApi.js';
import './PlanPage.css';

export default function PlanPage() {
  // 1. State
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updated, setUpdated] = useState(false); // show "Plan updated" banner

  // 2. Load the plan once
  useEffect(() => {
    getTrainingPlan()
      .then(setPlan)
      .catch(() => setError('Could not load your plan. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  // 3a. Tick / untick a day. Update the screen first, undo it if saving fails.
  function toggleDay(day) {
    const item = plan.week.find((d) => d.day === day);
    const newDone = !item.done;
    const withDone = (done) => ({
      ...plan,
      week: plan.week.map((d) => (d.day === day ? { ...d, done } : d)),
    });

    setPlan(withDone(newDone));
    setDayDone(day, newDone).catch(() => {
      setPlan(withDone(!newDone));
      setError('Could not save. Check your connection.');
    });
  }

  // 3b. Ask for a new plan
  async function handleChangePlan(answers) {
    setSubmitting(true);
    try {
      const newPlan = await requestPlanChange(answers);
      setPlan(newPlan);
      setModalOpen(false);
      setUpdated(true);
    } catch {
      setError('Could not change your plan. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  // useCallback keeps this function the same between renders, so the
  // modal's Escape-key listener isn't re-added every time.
  const closeModal = useCallback(() => setModalOpen(false), []);

  // 4. Loading and error states
  if (loading) {
    return <div className="app-shell"><p className="page-status">Loading your plan…</p></div>;
  }
  if (!plan) {
    return <div className="app-shell"><p className="page-status" role="alert">{error}</p></div>;
  }

  const doneCount = plan.week.filter((d) => d.done).length;

  // 5. The page
  return (
    <div className="app-shell">
      <Header username="Tan" title="Your very own personalised training plan" />

      <main className="page">
        {error && <p className="page-error" role="alert">{error}</p>}

        {updated && (
          <div className="plan__banner" role="status">
            <span>Plan updated. New sessions start tomorrow.</span>
            <button type="button" aria-label="Dismiss" onClick={() => setUpdated(false)}>×</button>
          </div>
        )}

        {/* Goal for today */}
        <section className="card plan__focus">
          <h2 className="section-label">Goal for today</h2>
          <div>
            <p className="plan__focus-station">{plan.focus.station}</p>
            <p className="plan__focus-reason">{plan.focus.reason}</p>
          </div>
          <div className="plan__focus-grid">
            <div className="plan__mini">
              <span className="plan__mini-label">Goal</span>
              <span className="plan__mini-value plan__mini-value--gold">{plan.focus.goal}</span>
            </div>
            <div className="plan__mini">
              <span className="plan__mini-label">Current</span>
              <span className="plan__mini-value">{plan.focus.current}</span>
            </div>
          </div>
        </section>

        {/* Plan for the week */}
        <section className="plan__week">
          <div className="plan__week-head">
            <h2 className="plan__week-title">Plan for the week</h2>
            <span className="plan__week-count">{doneCount} of {plan.week.length} done</span>
          </div>

          <ul className="plan__list">
            {plan.week.map((d) => (
              <li key={d.day}>
                <label className={`card plan__day ${d.done ? 'plan__day--done' : ''}`}>
                  <span className="plan__day-name">{d.day}</span>
                  <span className="plan__day-text">
                    <span className="plan__day-title">{d.title}</span>
                    <span className="plan__day-detail">{d.detail}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={d.done}
                    onChange={() => toggleDay(d.day)}
                    aria-label={`Mark ${d.title} done`}
                  />
                </label>
              </li>
            ))}
          </ul>

          <button type="button" className="btn btn--outline" onClick={() => setModalOpen(true)}>
            Change plan
          </button>
        </section>

        {/* Why this plan? */}
        <section className="plan__why">
          <div className="plan__why-head">
            <h2>Why this plan?</h2>
            <span className="plan__ai-tag">AI-generated</span>
          </div>
          <p>{plan.explanation}</p>
        </section>
      </main>

      <BottomNav />

      {modalOpen && (
        <ChangePlanModal
          onCancel={closeModal}
          onSubmit={handleChangePlan}
          submitting={submitting}
        />
      )}
    </div>
  );
}
