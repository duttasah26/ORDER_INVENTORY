import { CircleAlert } from 'lucide-react';
import './ErrorState.css';

/**
 * Shell used for fetch-failure states. Same layout family as EmptyState but
 * always renders a required "Retry" action.
 *
 * @param {object} props
 * @param {React.ComponentType} [props.icon] - defaults to CircleAlert
 * @param {string} [props.heading] - defaults to "Something went wrong"
 * @param {string} [props.body] - defaults to a generic fetch-failure message
 * @param {() => void} props.onRetry - required, called when Retry is clicked
 */
export function ErrorState({
  icon: Icon = CircleAlert,
  heading = 'Something went wrong',
  body = "We couldn't load this data. Check your connection and try again.",
  onRetry,
}) {
  return (
    <div className="error-state">
      <div className="error-state__icon-backdrop">
        <Icon className="error-state__icon" size={48} strokeWidth={1.75} aria-hidden="true" />
      </div>
      {heading ? <h3 className="error-state__heading">{heading}</h3> : null}
      {body ? <p className="error-state__body">{body}</p> : null}
      <button type="button" className="btn btn-outline-secondary error-state__action" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default ErrorState;
