import { Link } from 'react-router-dom';
import './Header.css';

// Top bar. Shows the user's name when logged in, otherwise a Log in link.
// title: optional page heading shown under the top row (e.g. "Statistics").
export default function Header({ username, showBigTitle = false, title }) {
  return (
    <header className="header">
      <div className="header__row">
        <span className="header__tag">IPPT COMPANION</span>
        {username ? (
          <Link to="/login" className="header__account">
            <span className="header__avatar" aria-hidden="true">
              {username[0].toUpperCase()}
            </span>
            <span>{username}</span>
          </Link>
        ) : (
          <Link to="/login" className="header__account">Log in / Sign up</Link>
        )}
      </div>
      {showBigTitle && <h1 className="header__title">GO FOR GOLD</h1>}
      {title && <h1 className="header__page-title">{title}</h1>}
    </header>
  );
}
