import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import type { Category } from '@/stores/categoryStore';
import { CategoryChip } from './CategoryChip';
import { Spacing, Radius } from '@/constants/spacing';
import { Colors } from '@/constants/colors';

type Props = {
  categories: Category[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
  type?: 'income' | 'expense';
};

export function CategoryPicker({ categories, selectedId, onSelect, type }: Props) {
  const filtered = type
    ? categories.filter((c) => c.type === type || c.type === 'both')
    : categories;

  if (filtered.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No categories yet. </Text>
        <Pressable onPress={() => router.push('/modal/add-category')}>
          <Text style={styles.emptyLink}>Add one →</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {filtered.map((cat) => (
        <CategoryChip
          key={cat.id}
          category={cat}
          selected={cat.id === selectedId}
          onPress={() => onSelect(cat.id)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  empty: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
  emptyLink: { fontSize: 14, color: Colors.brand, fontWeight: '600' },
});
