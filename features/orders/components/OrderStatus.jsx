import { Check } from 'lucide-react';
import { StatusBadge } from '@shared/components/common/StatusBadge';
import { ORDER_STATUS_DISPLAY_MAP } from '@shared/utils/constants';
import './OrderStatus.css';

function resolveDisplay(status) {
  return ORDER_STATUS_DISPLAY_MAP[status] || { key: status, label: status };
}

/**
 * Small colored pill for a raw order status. Maps the raw backend value
 * (e.g. `COMPLETE`) through `ORDER_STATUS_DISPLAY_MAP` to a canonical
 * `{key, label}` before handing off to the shared `StatusBadge`.
 *
 * @param {object} props
 * @param {string} props.status - raw `order_status` value
 */
export function OrderStatus({ status }) {
  const display = resolveDisplay(status);
  return <StatusBadge status={display.key} label={display.label} />;
}

// Forward lifecycle only - CANCELLED is handled as a special banner case
// below, never shown as a step in the progression.
const STEPPER_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

/**
 * Pending -> Processing -> Shipped -> Delivered progress stepper. Filled
 * circles + the line leading up to them use `--color-brand-accent`; future
 * steps render as outline circles. If the mapped status is CANCELLED, a
 * single full-width red banner replaces the stepper entirely rather than
 * showing a broken/partial progression.
 *
 * @param {object} props
 * @param {string} props.status - raw `order_status` value
 */
export function OrderStatusStepper({ status }) {
  const display = resolveDisplay(status);

  if (display.key === 'CANCELLED') {
    return (
      <div className="order-status-stepper order-status-stepper--cancelled" role="status">
        Cancelled
      </div>
    );
  }

  const currentIndex = STEPPER_STEPS.indexOf(display.key);

  return (
    <div className="order-status-stepper" role="list">
      {STEPPER_STEPS.map((step, index) => {
        const isFilled = currentIndex >= 0 && index <= currentIndex;
        const isLineFilled = currentIndex >= 0 && index < currentIndex;
        const isLastStep = index === STEPPER_STEPS.length - 1;
        const stepLabel = resolveDisplay(step).label;

        return (
          <div className="order-status-stepper__step" role="listitem" key={step}>
            <div className="order-status-stepper__track">
              <span
                className={`order-status-stepper__circle ${
                  isFilled
                    ? 'order-status-stepper__circle--filled'
                    : 'order-status-stepper__circle--outline'
                }`}
              >
                {isFilled ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : null}
              </span>
              {!isLastStep ? (
                <span
                  className={`order-status-stepper__line ${
                    isLineFilled ? 'order-status-stepper__line--filled' : ''
                  }`}
                  aria-hidden="true"
                />
              ) : null}
            </div>
            <span
              className={`order-status-stepper__label ${
                isFilled ? 'order-status-stepper__label--active' : ''
              }`}
            >
              {stepLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default OrderStatus;
