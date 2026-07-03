import { StatusBadge } from '@shared/components/common/StatusBadge';
import './CustomerStatus.css';

/**
 * Thin domain wrapper around the generic StatusBadge. `BANNED` / `ACTIVE`
 * are already mapped onto the CANCELLED (red) / DELIVERED (green) tone
 * colors by StatusBadge's SEMANTIC_TONE_MAP, so no explicit `tone` override
 * is needed here.
 *
 * @param {object} props
 * @param {boolean} props.isblocked
 */
export function CustomerStatus({ isblocked }) {
  return isblocked ? (
    <StatusBadge status="BANNED" label="Banned" />
  ) : (
    <StatusBadge status="ACTIVE" label="Active" />
  );
}

export default CustomerStatus;
