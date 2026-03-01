import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useCategoryStore } from '@/stores/categoryStore';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';
import { useAuthStore } from '@/stores/authStore';

export default function CategoriesScreen() {
  const { categories, removeCategory } = useCategoryStore();
  const { user } = useAuthStore();

  function handleDelete(id: string, name: string) {
    Alert.alert('Delete Category', `Delete "${name}"? Transactions using it will keep a reference.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeCategory(id),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Pressable
          style={styles.addBtn}
          onPress={() => router.push('/modal/add-category')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </Pressable>
      </View>

      {categories.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🗂️</Text>
          <Text style={styles.emptyTitle}>No categories yet</Text>
          <Text style={styles.emptySubtitle}>Add one to organize your transactions</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onLongPress={() => handleDelete(item.id, item.name)}
            >
              <View style={[styles.iconBox, { backgroundColor: `${item.color}20` }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              <View style={[styles.typePill, { backgroundColor: `${item.color}20` }]}>
                <Text style={[styles.typeLabel, { color: item.color }]}>
                  {item.type === 'both' ? 'Both' : item.type === 'income' ? 'Income' : 'Expense'}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
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
  list: { padding: Spacing.base, gap: Spacing.sm },
  row: { gap: Spacing.sm },
  card: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'flex-start',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 22 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  typePill: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.full,
  },
  typeLabel: { fontSize: 11, fontWeight: '600' },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  emptySubtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});
