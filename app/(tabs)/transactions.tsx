import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  SectionList,
  Pressable,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { TransactionItem } from '@/components/transaction/TransactionItem';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { groupTransactionsByDate } from '@/lib/utils';

type Filter = 'all' | 'income' | 'expense';

export default function TransactionsScreen() {
  const { transactions, loading, fetch, removeTransaction } = useTransactionStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<Filter>('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter((t) => t.type === filter);
  }, [transactions, filter]);

  const sections = useMemo(() => groupTransactionsByDate(filtered), [filtered]);

  async function onRefresh() {
    if (!user) return;
    setRefreshing(true);
    await fetch(user.id);
    setRefreshing(false);
  }

  function handleDelete(id: string) {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeTransaction(id),
      },
    ]);
  }

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'income', label: 'Income' },
    { key: 'expense', label: 'Expense' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push('/modal/add-transaction')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>

      {/* Filter bar */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            style={[styles.filterBtn, filter === f.key && styles.filterBtnActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {sections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>💸</Text>
          <Text style={styles.emptyTitle}>No transactions yet</Text>
          <Text style={styles.emptySubtitle}>Tap + Add to record your first one</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.itemWrap}>
              <TransactionItem
                transaction={item}
                onPress={() => {
                  Alert.alert(
                    'Transaction',
                    `${item.categories?.name ?? 'Uncategorized'} — ${item.note ?? 'No note'}`,
                    [
                      { text: 'Delete', style: 'destructive', onPress: () => handleDelete(item.id) },
                      { text: 'Close', style: 'cancel' },
                    ]
                  );
                }}
              />
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* FAB */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/modal/add-transaction')}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  title: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },
  addBtn: {
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  addBtnText: { color: Colors.textInverse, fontSize: 14, fontWeight: '600' },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  filterBtn: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
  },
  filterBtnActive: { backgroundColor: Colors.brand },
  filterText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  filterTextActive: { color: Colors.textInverse, fontWeight: '600' },
  list: { paddingHorizontal: Spacing.xl, paddingBottom: 100 },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  itemWrap: { backgroundColor: Colors.background },
  separator: { height: 1, backgroundColor: Colors.divider },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.brand,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { fontSize: 28, color: Colors.textInverse, lineHeight: 30, marginTop: -2 },
});
