export function formatToCurrency(numberToFormat: number) {
  return numberToFormat.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatToPercentage(numberToFormat: number) {
  return new Intl.NumberFormat('default', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(numberToFormat / 100);
}

export function formatDayVolume(dayVolume: number) {
  return Number((dayVolume / 1000000).toLocaleString('default', { maximumFractionDigits: 3 }).replace(',', '.'))
}