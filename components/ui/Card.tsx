import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '@/constants/colors';
import { Radius, Shadow, Spacing } from '@/constants/spacing';

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
};

export function Card({ children, style, padding = Spacing.base }: CardProps) {
  return (
    <View style={[styles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.md,
  },
});
