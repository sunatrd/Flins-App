import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import type { TransactionWithCategory } from '@/stores/transactionStore';
import { useProfileStore } from '@/stores/profileStore';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { formatCurrency } from '@/lib/utils';

type Props = {
  transactions: TransactionWithCategory[];
};

type Slice = {
  label: string;
  value: number;
  color: string;
  percent: number;
};

export function SpendingChart({ transactions: txs }: Props) {
  const { profile } = useProfileStore();
  const currency = profile?.currency ?? 'USD';
  const [selected, setSelected] = useState<Slice | null>(null);

  // Aggregate expenses by category
  const map = new Map<string, { label: string; value: number; color: string }>();
  for (const tx of txs) {
    if (tx.type !== 'expense') continue;
    const key = tx.category_id ?? 'other';
    const existing = map.get(key);
    const label = tx.categories?.name ?? 'Other';
    const color = tx.categories?.color ?? Colors.textTertiary;
    if (existing) {
      existing.value += tx.amount;
    } else {
      map.set(key, { label, value: tx.amount, color });
    }
  }

  const raw = Array.from(map.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);
  const total = raw.reduce((s, d) => s + d.value, 0);

  if (raw.length === 0 || total === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No spending data yet</Text>
      </View>
    );
  }

  const slices: Slice[] = raw.map((d) => ({
    label: d.label,
    value: Math.round(d.value * 100) / 100,
    color: d.color,
    percent: Math.round((d.value / total) * 100),
  }));

  const displayed = selected ?? slices[0];

  const pieData = slices.map((s) => ({
    value: s.value,
    color: s.color,
    onPress: () => setSelected(s),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Donut chart */}
        <PieChart
          donut
          data={pieData}
          radius={88}
          innerRadius={58}
          focusOnPress
          centerLabelComponent={() => (
            <View style={styles.center}>
              <Text style={styles.centerPercent}>{displayed.percent}%</Text>
              <Text style={styles.centerAmount} numberOfLines={1}>
                {formatCurrency(displayed.value, currency)}
              </Text>
              <Text style={styles.centerName} numberOfLines={1}>
                {displayed.label}
              </Text>
            </View>
          )}
        />

        {/* Legend */}
        <View style={styles.legend}>
          {slices.map((s) => {
            const isActive = displayed.label === s.label;
            return (
              <View
                key={s.label}
                style={[styles.legendItem, isActive && { opacity: 1 }]}
              >
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <Text
                  style={[styles.legendLabel, isActive && styles.legendLabelActive]}
                  numberOfLines={1}
                >
                  {s.label}
                </Text>
                <Text style={[styles.legendPct, { color: s.color }]}>
                  {s.percent}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: Spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
  },
  empty: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: Colors.textTertiary, fontSize: 14 },

  // Donut center
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 116,
  },
  centerPercent: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  centerAmount: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 1,
  },
  centerName: {
    fontSize: 10,
    color: Colors.textTertiary,
    marginTop: 1,
  },

  // Legend
  legend: {
    flex: 1,
    gap: 6,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    opacity: 0.75,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  legendLabel: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  legendLabelActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  legendPct: {
    fontSize: 12,
    fontWeight: '600',
  },
});
