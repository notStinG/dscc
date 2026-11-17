import { useEffect, useRef, useState } from 'react';
import './ChangePlanModal.css';

const REASONS = [
  'Too difficult',
  'Too easy',
  "I don't enjoy this workout",
  "I don't have enough time",
  'I want to focus on another component',
];

/*
 * Bottom sheet asking why the user wants a new plan.
 *
 * Props:
 *   onCancel()                     close without changes
 *   onSubmit({ reasons, other })   send the answers
 *   submitting                     true while waiting for the new plan
 */
export default function ChangePlanModal({ onCancel, onSubmit, submitting }) {
  const [picked, setPicked] = useState([]); // list of chosen reasons
  const [other, setOther] = useState('');
  const firstInputRef = useRef(null);

  // Put keyboard focus inside the sheet when it opens; Escape closes it.
  useEffect(() => {
    firstInputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onCancel();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);

  function toggle(reason) {
    setPicked((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  }

  const canSubmit = (picked.length > 0 || other.trim() !== '') && !submitting;

  function handleSubmit(e) {
    e.preventDefault();
    if (canSubmit) onSubmit({ reasons: picked, other: other.trim() });
  }

  return (
    // Clicking the dark backdrop closes the sheet
    <div className="modal-backdrop" onClick={onCancel}>
      <form
        className="change-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-title"
        onClick={(e) => e.stopPropagation()} // clicks inside don't close it
        onSubmit={handleSubmit}
      >
        <h2 id="change-title" className="change-sheet__title">Why would you like to change?</h2>
        <p className="change-sheet__hint">Pick all that apply. We'll build a new plan around your answers.</p>

        <fieldset className="change-sheet__options">
          <legend className="visually-hidden">Reasons</legend>
          {REASONS.map((reason, i) => (
            <label key={reason} className="change-sheet__option">
              <input
                ref={i === 0 ? firstInputRef : null}
                type="checkbox"
                checked={picked.includes(reason)}
                onChange={() => toggle(reason)}
              />
              {reason}
            </label>
          ))}
        </fieldset>

        <label htmlFor="other-reason" className="change-sheet__other-label">Other</label>
        <input
          id="other-reason"
          type="text"
          className="change-sheet__other"
          placeholder="Tell us more (optional)"
          value={other}
          onChange={(e) => setOther(e.target.value)}
        />

        <div className="change-sheet__actions">
          <button type="button" className="btn btn--outline" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn btn--dark" disabled={!canSubmit}>
            {submitting ? 'Generating…' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}
