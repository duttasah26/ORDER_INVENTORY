const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(str) {
  return typeof str === 'string' && EMAIL_REGEX.test(str.trim());
}

export function isPositiveNumber(n) {
  return typeof n === 'number' && Number.isFinite(n) && n > 0;
}
