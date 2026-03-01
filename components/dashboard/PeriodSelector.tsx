import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';

type Period = 'week' | 'month' | 'year';

type Props = {
  value: Period;
  onChange: (p: Period) => void;
};

const PERIODS: { key: Period; label: string }[] = [
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export function PeriodSelector({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      {PERIODS.map((p) => (
        <Pressable
          key={p.key}
          style={[styles.btn, value === p.key && styles.btnActive]}
          onPress={() => onChange(p.key)}
        >
          <Text style={[styles.label, value === p.key && styles.labelActive]}>
            {p.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 3,
  },
  btn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  btnActive: {
    backgroundColor: Colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  label: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  labelActive: { color: Colors.textPrimary, fontWeight: '600' },
});
