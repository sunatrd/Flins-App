import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import type { TransactionWithCategory } from '@/stores/transactionStore';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

type Props = {
  transactions: TransactionWithCategory[];
};

export function SpendingChart({ transactions: txs }: Props) {
  // Aggregate expense by category
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

  const data = Array.from(map.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)
    .map((d) => ({
      value: Math.round(d.value * 100) / 100,
      label: d.label.length > 8 ? d.label.slice(0, 7) + '…' : d.label,
      frontColor: d.color,
      topLabelComponent: () => null,
    }));

  if (data.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No spending data yet</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        barWidth={32}
        spacing={16}
        roundedTop
        hideRules
        xAxisThickness={0}
        yAxisThickness={0}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTextStyle={styles.xLabel}
        noOfSections={3}
        maxValue={Math.max(...data.map((d) => d.value)) * 1.2}
        isAnimated
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: Spacing.sm },
  empty: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { color: Colors.textTertiary, fontSize: 14 },
  axisText: { color: Colors.textTertiary, fontSize: 10 },
  xLabel: { color: Colors.textSecondary, fontSize: 10, textAlign: 'center' },
});
