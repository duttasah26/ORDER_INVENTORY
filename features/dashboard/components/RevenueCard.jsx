import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { TrendingUp } from 'lucide-react';
import { useOrders } from '@features/orders/hooks/useOrders';
import api from '@shared/api/axios';
import endpoints from '@shared/api/endpoints';
import formatCurrency from '@shared/utils/formatCurrency';
import { Skeleton } from '@shared/components/common/Skeleton';
import { ErrorState } from '@shared/components/common/ErrorState';
import './RevenueCard.css';

const RECENT_ORDER_COUNT = 10;

/**
 * There is no dedicated revenue endpoint in this API, so this card computes
 * an ESTIMATE: it takes the 10 most recently placed orders, fetches each
 * order's line items in parallel, and sums `lineTotal` across all of them.
 * This is explicitly surfaced as an estimate (not a true total) via the
 * caption, since it only reflects a slice of orders, not the whole history.
 */
export function RevenueCard() {
  const { data: orders = [], isLoading: ordersLoading, isError: ordersIsError, refetch: refetchOrders } = useOrders();

  const recentOrderIds = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.order_tms) - new Date(a.order_tms))
      .slice(0, RECENT_ORDER_COUNT)
      .map((order) => order.order_id ?? order.id)
      .filter((id) => id !== undefined && id !== null);
  }, [orders]);

  const detailQueries = useQueries({
    queries: recentOrderIds.map((orderId) => ({
      queryKey: ['dashboard', 'revenue-order-details', orderId],
      queryFn: async () => {
        const response = await api.get(endpoints.inventory.orderDetails(orderId));
        return response.data;
      },
      enabled: !ordersLoading,
    })),
  });

  const detailsLoading = recentOrderIds.length > 0 && detailQueries.some((query) => query.isLoading);
  const detailsError = detailQueries.some((query) => query.isError);

  const isLoading = ordersLoading || detailsLoading;
  const isError = ordersIsError || detailsError;

  const total = useMemo(() => {
    return detailQueries.reduce((sum, query) => {
      const lineItems = Array.isArray(query.data) ? query.data : [];
      const orderSum = lineItems.reduce((lineSum, item) => lineSum + (Number(item.lineTotal) || 0), 0);
      return sum + orderSum;
    }, 0);
  }, [detailQueries]);

  function handleRetry() {
    refetchOrders();
    detailQueries.forEach((query) => query.refetch?.());
  }

  return (
    <div className="revenue-card">
      <div className="revenue-card__header">
        <TrendingUp className="revenue-card__icon" size={18} strokeWidth={1.75} aria-hidden="true" />
        <h3 className="revenue-card__title">Revenue</h3>
      </div>

      {isLoading ? (
        <div className="revenue-card__skeleton">
          <Skeleton variant="rect" height={40} width="60%" />
          <Skeleton variant="text" height={14} width="80%" />
        </div>
      ) : isError ? (
        <ErrorState
          heading="Couldn't load revenue"
          body="We couldn't estimate revenue from recent orders."
          onRetry={handleRetry}
        />
      ) : (
        <>
          <p className="revenue-card__value tabular-nums">{formatCurrency(total)}</p>
          <p className="revenue-card__caption">Estimated revenue (last {RECENT_ORDER_COUNT} orders)</p>
        </>
      )}
    </div>
  );
}

export default RevenueCard;
