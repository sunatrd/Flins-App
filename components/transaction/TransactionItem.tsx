import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { TransactionWithCategory } from '@/stores/transactionStore';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { formatCurrency } from '@/lib/utils';

type Props = {
  transaction: TransactionWithCategory;
  onPress?: () => void;
};

export function TransactionItem({ transaction, onPress }: Props) {
  const { type, amount, categories, note } = transaction;
  const isIncome = type === 'income';

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={[styles.iconBox, { backgroundColor: categories ? `${categories.color}18` : Colors.surface }]}>
        <Text style={styles.icon}>{categories?.icon ?? '💰'}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {categories?.name ?? 'Uncategorized'}
        </Text>
        {note ? <Text style={styles.note} numberOfLines={1}>{note}</Text> : null}
      </View>

      <Text style={[styles.amount, { color: isIncome ? Colors.income : Colors.expense }]}>
        {isIncome ? '+' : '-'}{formatCurrency(amount)}
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
  note: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '600' },
});
