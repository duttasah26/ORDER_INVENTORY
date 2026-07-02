import StatusBadge from '@shared/components/common/StatusBadge';
import './ShipmentStatus.css';

// CREATED has no direct color-key match on StatusBadge, so it borrows the
// PENDING (amber) tone. SHIPPED/DELIVERED map onto their own tones directly.
const TONE_MAP = {
  CREATED: 'PENDING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
};

function toTitleCase(value) {
  return value
    .toString()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Thin wrapper around the shared StatusBadge for the shipment domain.
 *
 * @param {object} props
 * @param {'CREATED'|'SHIPPED'|'DELIVERED'} props.status
 */
export function ShipmentStatus({ status }) {
  const tone = TONE_MAP[status] ?? 'PENDING';
  const label = toTitleCase(status ?? '');

  return (
    <span className="shipment-status">
      <StatusBadge status={status} tone={tone} label={label} />
    </span>
  );
}

export default ShipmentStatus;
