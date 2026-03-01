import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTransactionStore } from '@/stores/transactionStore';
import { useAuthStore } from '@/stores/authStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { PeriodSelector } from '@/components/dashboard/PeriodSelector';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { TransactionItem } from '@/components/transaction/TransactionItem';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { getDateRangeForPeriod } from '@/lib/utils';
import { parseISO, isWithinInterval } from 'date-fns';

type Period = 'week' | 'month' | 'year';

export default function DashboardScreen() {
  const { transactions, loading, fetch } = useTransactionStore();
  const { user } = useAuthStore();
  const [period, setPeriod] = useState<Period>('month');
  const [refreshing, setRefreshing] = useState(false);

  const periodTxs = useMemo(() => {
    const { from, to } = getDateRangeForPeriod(period);
    const fromDate = parseISO(from);
    const toDate = parseISO(to);
    return transactions.filter((t) => {
      const d = parseISO(t.date);
      return isWithinInterval(d, { start: fromDate, end: toDate });
    });
  }, [transactions, period]);

  const income = useMemo(
    () => periodTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [periodTxs]
  );
  const expense = useMemo(
    () => periodTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [periodTxs]
  );
  const balance = useMemo(
    () => transactions.reduce((s, t) => (t.type === 'income' ? s + t.amount : s - t.amount), 0),
    [transactions]
  );

  const recent = useMemo(() => transactions.slice(0, 5), [transactions]);

  async function onRefresh() {
    if (!user) return;
    setRefreshing(true);
    await fetch(user.id);
    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.user_metadata?.full_name ?? user?.email ?? 'there'}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.settingsBtn, pressed && styles.pressed]}
            onPress={() => router.push('/modal/settings')}
          >
            <Ionicons name="settings-outline" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>

        {/* Balance card */}
        <View style={styles.section}>
          <BalanceCard balance={balance} income={income} expense={expense} />
        </View>

        {/* Period selector */}
        <View style={styles.section}>
          <PeriodSelector value={period} onChange={setPeriod} />
        </View>

        {/* Spending chart */}
        {periodTxs.length > 0 && (
          <View style={[styles.section, styles.card]}>
            <Text style={styles.cardTitle}>Spending by Category</Text>
            <SpendingChart transactions={periodTxs} />
          </View>
        )}

        {/* Recent transactions */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <Pressable onPress={() => router.push('/(tabs)/transactions')}>
              <Text style={styles.seeAll}>See all</Text>
            </Pressable>
          </View>

          {recent.length === 0 ? (
            <View style={[styles.card, styles.emptyCard]}>
              <Text style={styles.emptyIcon}>💸</Text>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Pressable
                style={styles.addBtn}
                onPress={() => router.push('/modal/add-transaction')}
              >
                <Text style={styles.addBtnText}>Add your first transaction</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.card}>
              {recent.map((tx, i) => (
                <View key={tx.id}>
                  <TransactionItem
                    transaction={tx}
                    onPress={() => router.push('/(tabs)/transactions')}
                  />
                  {i < recent.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

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
  scroll: { paddingHorizontal: Spacing.xl, paddingBottom: 100, gap: 0 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.base,
  },
  greeting: { fontSize: 13, color: Colors.textSecondary },
  userName: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, maxWidth: 220 },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { opacity: 0.6 },
  section: { marginBottom: Spacing.base },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.base,
    ...Shadow.sm,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  seeAll: { fontSize: 14, color: Colors.brand, fontWeight: '500' },
  divider: { height: 1, backgroundColor: Colors.divider },
  emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptyIcon: { fontSize: 36 },
  emptyTitle: { fontSize: 15, color: Colors.textSecondary },
  addBtn: {
    backgroundColor: Colors.brandLight,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    marginTop: Spacing.sm,
  },
  addBtnText: { color: Colors.brand, fontWeight: '600', fontSize: 14 },
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
