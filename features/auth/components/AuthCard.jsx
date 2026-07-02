import './AuthCard.css';

/**
 * Shared visual wrapper for the three public auth pages (Login, Register,
 * AdminLogin). Renders inside PublicLayout's centered content area, so it
 * owns only its own card surface, not page-level layout.
 *
 * @param {object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {React.ReactNode} props.children
 */
export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="auth-card">
      <div className="auth-card__header">
        <h1 className="auth-card__title">{title}</h1>
        {subtitle ? <p className="auth-card__subtitle">{subtitle}</p> : null}
      </div>

      <div className="auth-card__body">{children}</div>
    </div>
  );
}

export default AuthCard;
