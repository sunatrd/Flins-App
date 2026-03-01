import { Pressable, Text, StyleSheet, View } from 'react-native';
import type { Category } from '@/stores/categoryStore';
import { Radius, Spacing } from '@/constants/spacing';
import { Colors } from '@/constants/colors';

type Props = {
  category: Category;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryChip({ category, selected, onPress }: Props) {
  return (
    <Pressable
      style={[styles.chip, selected && { borderColor: category.color, backgroundColor: `${category.color}18` }]}
      onPress={onPress}
    >
      <Text style={styles.icon}>{category.icon}</Text>
      <Text style={[styles.label, selected && { color: category.color }]}>{category.name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  icon: { fontSize: 14 },
  label: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
});
