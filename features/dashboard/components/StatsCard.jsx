import './StatsCard.css';

/**
 * Generic KPI card shell reused across the dashboard's top stat row
 * (Total Orders, Total Customers, Units in Stock, Low-Stock Items).
 *
 * @param {object} props
 * @param {React.ComponentType} props.icon - lucide-react icon component
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.trend] - e.g. "+12%"
 * @param {'neutral'|'warning'|'danger'} [props.tone] - controls the value's color;
 *   pass 'warning'/'danger' so the number itself communicates severity (e.g. low
 *   stock count > 0) instead of relying on extra decoration.
 * @param {string} [props.className]
 * @param {object} [props.style]
 */
export function StatsCard({ icon: Icon, label, value, trend, tone = 'neutral', className = '', style }) {
  return (
    <div className={`stats-card ${className}`.trim()} style={style}>
      <div className="stats-card__icon-wrap">
        {Icon ? <Icon className="stats-card__icon" size={20} strokeWidth={1.75} aria-hidden="true" /> : null}
      </div>
      <div className="stats-card__body">
        <p className="stats-card__label">{label}</p>
        <p className={`stats-card__value stats-card__value--${tone} tabular-nums`}>{value}</p>
        {trend ? <span className="stats-card__trend">{trend}</span> : null}
      </div>
    </div>
  );
}

export default StatsCard;
