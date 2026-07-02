import { useEffect, useRef, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useOrderStatusCounts } from '@features/orders/hooks/useOrders';
import { useShipmentStatusCounts } from '@features/customers/hooks/useCustomers';
import { ORDER_STATUS_DISPLAY_MAP, STATUS_COLORS } from '@shared/utils/constants';
import { Skeleton } from '@shared/components/common/Skeleton';
import { ErrorState } from '@shared/components/common/ErrorState';
import { EmptyState } from '@shared/components/common/EmptyState';
import './DashboardChart.css';

// Shipment statuses (CREATED/SHIPPED/DELIVERED) aren't in STATUS_COLORS
// directly (that map is keyed by order status + LOWSTOCK), so CREATED
// borrows the PENDING color — same "not yet moving" semantic.
const SHIPMENT_STATUS_COLORS = {
  CREATED: STATUS_COLORS.PENDING,
  SHIPPED: STATUS_COLORS.SHIPPED,
  DELIVERED: STATUS_COLORS.DELIVERED,
};

const TOOLTIP_STYLE = {
  background: 'var(--color-surface-card)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 'var(--font-size-caption)',
  color: 'var(--color-text-primary)',
};

const LEGEND_STYLE = {
  fontSize: 'var(--font-size-caption)',
  color: 'var(--color-text-secondary)',
};

// Animates the initial sweep-in once, then disables animation on subsequent
// re-renders (refetches/polling) so the chart doesn't keep re-sweeping.
function useAnimateOnce() {
  const [hasAnimated, setHasAnimated] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onAnimationStart = () => {
    if (!hasAnimated && !timerRef.current) {
      timerRef.current = setTimeout(() => setHasAnimated(true), 550);
    }
  };

  return { isAnimationActive: !hasAnimated, onAnimationStart };
}

export function DashboardChart() {
  const orderStatusQuery = useOrderStatusCounts();
  const shipmentStatusQuery = useShipmentStatusCounts();
  const { isAnimationActive, onAnimationStart } = useAnimateOnce();

  const orderData = (orderStatusQuery.data ?? []).map((row) => {
    const display = ORDER_STATUS_DISPLAY_MAP[row.status] || { key: row.status, label: row.status };
    return {
      key: display.key,
      name: display.label,
      value: row.count,
      color: STATUS_COLORS[display.key] || 'var(--color-text-muted)',
    };
  });

  const shipmentData = (shipmentStatusQuery.data ?? []).map((row) => ({
    name: row.status,
    value: row.count,
    color: SHIPMENT_STATUS_COLORS[row.status] || 'var(--color-text-muted)',
  }));

  return (
    <div className="dashboard-chart">
      <div className="dashboard-chart__panel">
        <h3 className="dashboard-chart__title">Order Status Mix</h3>

        {orderStatusQuery.isLoading ? (
          <Skeleton variant="rect" height={220} />
        ) : orderStatusQuery.isError ? (
          <ErrorState heading="Couldn't load order status" onRetry={orderStatusQuery.refetch} />
        ) : orderData.length === 0 ? (
          <EmptyState heading="No order data" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                isAnimationActive={isAnimationActive}
                animationDuration={500}
                onAnimationStart={onAnimationStart}
              >
                {orderData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} stroke="var(--color-surface-card)" strokeWidth={2} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={LEGEND_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="dashboard-chart__panel">
        <h3 className="dashboard-chart__title">Shipment Status Mix</h3>

        {shipmentStatusQuery.isLoading ? (
          <Skeleton variant="rect" height={220} />
        ) : shipmentStatusQuery.isError ? (
          <ErrorState heading="Couldn't load shipment status" onRetry={shipmentStatusQuery.refetch} />
        ) : shipmentData.length === 0 ? (
          <EmptyState heading="No shipment data" />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={shipmentData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--color-border-default)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                axisLine={{ stroke: 'var(--color-border-default)' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }}
                axisLine={false}
                tickLine={false}
              />
              <RechartsTooltip cursor={{ fill: 'var(--color-surface-base)' }} contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={isAnimationActive} animationDuration={500}>
                {shipmentData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default DashboardChart;
