import { getInitials } from '@shared/utils/helpers';
import { CustomerStatus } from './CustomerStatus';
import './CustomerCard.css';

/**
 * Card view of a single customer — a grid/mobile-friendly alternative to
 * CustomerTable's rows. Never renders `password`.
 *
 * @param {object} props
 * @param {{id: number, full_name: string, email_address: string, isblocked: boolean}} props.customer
 * @param {() => void} [props.onClick]
 */
export function CustomerCard({ customer, onClick }) {
  const { full_name: fullName, email_address: emailAddress, isblocked: isBlocked } = customer;

  return (
    <div
      className="customer-card"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <span className="customer-card__avatar">{getInitials(fullName)}</span>
      <div className="customer-card__info">
        <p className="customer-card__name">{fullName}</p>
        <p className="customer-card__email">{emailAddress}</p>
      </div>
      <CustomerStatus isblocked={isBlocked} />
    </div>
  );
}

export default CustomerCard;
