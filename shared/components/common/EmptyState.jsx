import './EmptyState.css';

/**
 * Generic "nothing to show" placeholder used by tables/grids/lists.
 *
 * @param {object} props
 * @param {React.ComponentType} props.icon - a lucide-react icon component reference
 * @param {string} props.heading
 * @param {string} props.body
 * @param {{label: string, onClick: () => void}} [props.action]
 */
export function EmptyState({ icon: Icon, heading, body, action }) {
  return (
    <div className="empty-state">
      {Icon ? (
        <div className="empty-state__icon-backdrop">
          <Icon className="empty-state__icon" size={48} strokeWidth={1.75} aria-hidden="true" />
        </div>
      ) : null}
      {heading ? <h3 className="empty-state__heading">{heading}</h3> : null}
      {body ? <p className="empty-state__body">{body}</p> : null}
      {action ? (
        <button type="button" className="btn btn-primary empty-state__action" onClick={action.onClick}>
          {action.label}
        </button>
      ) : null}
    </div>
  );
}

export default EmptyState;
