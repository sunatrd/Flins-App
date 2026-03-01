import { View, Text, StyleSheet } from 'react-native';
import { Radius, Spacing } from '@/constants/spacing';

type BadgeProps = {
  label: string;
  color: string;
  size?: 'sm' | 'md';
};

export function Badge({ label, color, size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.container, size === 'sm' && styles.containerSm]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.label, size === 'sm' && styles.labelSm]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: '#F5F5F7',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  containerSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  labelSm: {
    fontSize: 11,
  },
});
