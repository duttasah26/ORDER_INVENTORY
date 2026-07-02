import { useCallback, useMemo, useState } from 'react';

export function usePagination({ totalItems, pageSize = 10 }) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil((totalItems || 0) / pageSize));
  }, [totalItems, pageSize]);

  const safeSetPage = useCallback(
    (nextPage) => {
      setPage(Math.min(Math.max(1, nextPage), totalPages));
    },
    [totalPages]
  );

  const pageItems = useCallback(
    (allItems = []) => {
      const start = (page - 1) * pageSize;
      return allItems.slice(start, start + pageSize);
    },
    [page, pageSize]
  );

  return { page, setPage: safeSetPage, totalPages, pageItems };
}

export default usePagination;
