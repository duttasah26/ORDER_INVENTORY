export function formatDate(isoOrSqlString) {
  if (!isoOrSqlString) return '';
  const date = new Date(isoOrSqlString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function getInitials(fullName) {
  if (!fullName || typeof fullName !== 'string') return '';
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

export function dedupById(records) {
  const seen = new Set();
  const result = [];
  for (const record of records) {
    if (!seen.has(record.id)) {
      seen.add(record.id);
      result.push(record);
    }
  }
  return result;
}

export function isValidCssColor(str) {
  if (typeof str !== 'string' || str.trim() === '') return false;

  try {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      return CSS.supports('color', str);
    }
  } catch {
    // fall through to DOM-based fallback below
  }

  try {
    const option = new Option();
    option.style.color = '';
    option.style.color = str;
    return option.style.color !== '';
  } catch {
    return false;
  }
}
