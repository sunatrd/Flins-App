import { Pressable, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.textInverse : Colors.brand} size="small" />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label` as keyof typeof styles] as TextStyle]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: Spacing.base,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primary: { backgroundColor: Colors.brand },
  ghost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: Colors.border },
  danger: { backgroundColor: Colors.expenseLight },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.75 },
  label: { fontSize: 15, fontWeight: '600' },
  primaryLabel: { color: Colors.textInverse },
  ghostLabel: { color: Colors.textPrimary },
  dangerLabel: { color: Colors.expense },
});
