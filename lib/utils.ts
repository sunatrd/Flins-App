import { format, isToday, isYesterday, parseISO, startOfWeek, startOfMonth, startOfYear, endOfMonth } from 'date-fns';

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = parseISO(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function getDateRangeForPeriod(period: 'week' | 'month' | 'year'): {
  from: string;
  to: string;
} {
  const now = new Date();
  let from: Date;

  if (period === 'week') from = startOfWeek(now, { weekStartsOn: 1 });
  else if (period === 'month') from = startOfMonth(now);
  else from = startOfYear(now);

  return {
    from: format(from, 'yyyy-MM-dd'),
    to: format(now, 'yyyy-MM-dd'),
  };
}

export function groupTransactionsByDate<T extends { date: string }>(
  items: T[]
): { title: string; data: T[] }[] {
  const map = new Map<string, T[]>();

  for (const item of items) {
    const key = item.date;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, data]) => ({ title: formatDate(date), data }));
}
