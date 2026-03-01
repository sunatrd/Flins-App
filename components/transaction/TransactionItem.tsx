import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { TransactionWithCategory } from '@/stores/transactionStore';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { formatCurrency, formatShortDate } from '@/lib/utils';

type Props = {
  transaction: TransactionWithCategory;
  onPress?: () => void;
  onLongPress?: () => void;
  showDate?: boolean;
  currency?: string;
};

export function TransactionItem({ transaction, onPress, onLongPress, showDate, currency }: Props) {
  const { type, amount, categories, note, date } = transaction;
  const isIncome = type === 'income';

  const subtitle = [
    showDate ? formatShortDate(date) : null,
    note ?? null,
  ].filter(Boolean).join(' · ');

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={[styles.iconBox, { backgroundColor: categories ? `${categories.color}18` : Colors.surface }]}>
        <Text style={styles.icon}>{categories?.icon ?? '💰'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {categories?.name ?? 'Uncategorized'}
        </Text>
        {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
      </View>

      <Text style={[styles.amount, { color: isIncome ? Colors.income : Colors.expense }]}>
        {isIncome ? '+' : '-'}{formatCurrency(amount, currency)}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  pressed: { opacity: 0.6 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', color: Colors.textPrimary },
  subtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '600' },
});
