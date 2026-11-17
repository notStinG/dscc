import './StationStepper.css';

/*
 * One reusable +/- card. The Home page uses it three times.
 *
 * Props:
 *   label    "Push-ups"
 *   value    the number stored in state (reps, or seconds for the run)
 *   display  what to show (defaults to value; the run passes "11:30")
 *   unit     small text under the value
 *   step     how much +/- changes the value
 *   min/max  limits
 *   onChange called with the new value
 *   decLabel / incLabel  screen-reader labels for the buttons
 */
export default function StationStepper({
  label, value, display, unit, step = 1, min = 0, max = 60,
  onChange, decLabel, incLabel,
}) {
  const change = (delta) => {
    const next = Math.min(max, Math.max(min, value + delta));
    onChange(next);
  };

  return (
    <div className="stepper card">
      <span className="stepper__label">{label}</span>
      <span className="stepper__value">{display ?? value}</span>
      <span className="stepper__unit">{unit}</span>
      <div className="stepper__buttons">
        <button type="button" className="stepper__btn" onClick={() => change(-step)}
          aria-label={decLabel ?? `Decrease ${label}`} disabled={value <= min}>
          −
        </button>
        <button type="button" className="stepper__btn stepper__btn--plus" onClick={() => change(step)}
          aria-label={incLabel ?? `Increase ${label}`} disabled={value >= max}>
          +
        </button>
      </div>
    </div>
  );
}
