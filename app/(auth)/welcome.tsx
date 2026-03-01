import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoIcon}>💰</Text>
          </View>
          <Text style={styles.appName}>FlinS</Text>
          <Text style={styles.tagline}>Track your money,{'\n'}master your finances.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.btnPrimaryText}>Get Started</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.btnGhost, pressed && styles.pressed]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.btnGhostText}>I already have an account</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: Spacing.xxl,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
  },
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: Radius.xl,
    backgroundColor: Colors.brandLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  logoIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
  },
  actions: {
    gap: Spacing.sm,
  },
  btnPrimary: {
    backgroundColor: Colors.brand,
    paddingVertical: Spacing.base,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  btnGhost: {
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  btnGhostText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  pressed: {
    opacity: 0.7,
  },
});
