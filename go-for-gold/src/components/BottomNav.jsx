import { NavLink } from 'react-router-dom';
import './BottomNav.css';

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" />
  </svg>
);
const PlanIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 9h6M9 13h6M9 17h3" />
  </svg>
);
const StatsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 20h18" /><path d="M7 16v-4M12 16V7M17 16v-7" />
  </svg>
);

const LINKS = [
  { to: '/', label: 'Home', Icon: HomeIcon },
  { to: '/plan', label: 'Training plan', Icon: PlanIcon },
  { to: '/stats', label: 'Statistics', Icon: StatsIcon },
];

// NavLink adds the "active" class (and aria-current) to the current page's link.
export default function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main">
      {LINKS.map(({ to, label, Icon }) => (
        <NavLink key={to} to={to} end className="bottom-nav__link">
          <Icon />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
