import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { formatCurrency } from '@/lib/utils';

type Props = {
  balance: number;
  income: number;
  expense: number;
  currency?: string;
};

export function BalanceCard({ balance, income, expense, currency }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{formatCurrency(balance, currency)}</Text>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View style={styles.col}>
          <View style={styles.indicator}>
            <View style={[styles.dot, { backgroundColor: Colors.income }]} />
            <Text style={styles.indicatorLabel}>Income</Text>
          </View>
          <Text style={[styles.colAmount, { color: Colors.income }]}>
            +{formatCurrency(income, currency)}
          </Text>
        </View>

        <View style={styles.colDivider} />

        <View style={styles.col}>
          <View style={styles.indicator}>
            <View style={[styles.dot, { backgroundColor: Colors.expense }]} />
            <Text style={styles.indicatorLabel}>Expense</Text>
          </View>
          <Text style={[styles.colAmount, { color: Colors.expense }]}>
            -{formatCurrency(expense, currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.brand,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.lg,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textInverse,
    letterSpacing: -1,
    marginTop: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginVertical: Spacing.base,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  col: {
    flex: 1,
    gap: 4,
  },
  colDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: Spacing.base,
  },
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  indicatorLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  colAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
});
