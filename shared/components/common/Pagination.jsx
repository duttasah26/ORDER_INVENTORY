import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

/**
 * Builds a windowed list of page numbers/ellipsis markers: first, last,
 * and current page ± 1, with '…' placeholders for gaps.
 */
function buildPageWindow(page, totalPages) {
  const pages = [];
  const visible = new Set([1, totalPages, page - 1, page, page + 1]);

  for (let candidate = 1; candidate <= totalPages; candidate += 1) {
    if (visible.has(candidate)) {
      pages.push(candidate);
    }
  }

  const result = [];
  let previous = null;
  for (const current of pages) {
    if (previous !== null && current - previous > 1) {
      result.push({ type: 'ellipsis', key: `ellipsis-${previous}` });
    }
    result.push({ type: 'page', value: current, key: `page-${current}` });
    previous = current;
  }

  return result;
}

/**
 * @param {object} props
 * @param {number} props.page - current page, 1-indexed
 * @param {number} props.totalPages
 * @param {(page: number) => void} props.onPageChange
 * @param {number} [props.pageSize]
 * @param {(size: number) => void} [props.onPageSizeChange]
 */
export function Pagination({ page, totalPages, onPageChange, pageSize, onPageSizeChange }) {
  const safeTotalPages = Math.max(totalPages, 1);
  const items = buildPageWindow(page, safeTotalPages);

  return (
    <div className="pagination">
      <div className="pagination__controls">
        <button
          type="button"
          className="pagination__button pagination__button--nav"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>

        {items.map((item) =>
          item.type === 'ellipsis' ? (
            <span key={item.key} className="pagination__ellipsis" aria-hidden="true">
              &hellip;
            </span>
          ) : (
            <button
              key={item.key}
              type="button"
              className={`pagination__button ${item.value === page ? 'pagination__button--active' : ''}`}
              onClick={() => onPageChange(item.value)}
              aria-current={item.value === page ? 'page' : undefined}
              aria-label={`Page ${item.value}`}
            >
              {item.value}
            </button>
          )
        )}

        <button
          type="button"
          className="pagination__button pagination__button--nav"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= safeTotalPages}
          aria-label="Next page"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {pageSize && onPageSizeChange ? (
        <div className="pagination__page-size">
          <label htmlFor="pagination-page-size" className="pagination__page-size-label">
            Rows per page
          </label>
          <select
            id="pagination-page-size"
            className="pagination__page-size-select"
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ) : null}
    </div>
  );
}

export default Pagination;
