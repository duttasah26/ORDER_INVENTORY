const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function formatCurrency(value) {
  const numeric = Number(value);
  return currencyFormatter.format(Number.isFinite(numeric) ? numeric : 0);
}
