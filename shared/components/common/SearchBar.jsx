import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@shared/hooks/useDebounce';
import './SearchBar.css';

/**
 * Controlled search input with a leading Search icon. Emits `onChange` with
 * the debounced value (300ms) so callers can wire it straight into a query
 * param / fetch trigger without debouncing themselves.
 *
 * @param {object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange - receives the debounced value
 * @param {string} [props.placeholder]
 */
export function SearchBar({ value, onChange, placeholder = 'Search…' }) {
  const [inputValue, setInputValue] = useState(value ?? '');
  const debouncedValue = useDebounce(inputValue, 300);

  // Keep local state in sync if the caller resets `value` externally.
  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="search-bar">
      <Search className="search-bar__icon" size={16} strokeWidth={2} aria-hidden="true" />
      <input
        type="text"
        className="search-bar__input"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}

export default SearchBar;
