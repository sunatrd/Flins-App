import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      Alert.alert('Login failed', error.message);
    } else {
      router.replace('/(tabs)');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>

          <View style={styles.header}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Sign in to your account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={Colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <Pressable
              style={({ pressed }) => [styles.btnPrimary, loading && styles.btnDisabled, pressed && styles.pressed]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.btnPrimaryText}>{loading ? 'Signing in…' : 'Sign In'}</Text>
            </Pressable>

            <Pressable onPress={() => router.push('/(auth)/signup')}>
              <Text style={styles.switchText}>
                Don't have an account?{' '}
                <Text style={styles.switchLink}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.xxl },
  backBtn: { paddingVertical: Spacing.base },
  backText: { fontSize: 15, color: Colors.brand, fontWeight: '500' },
  header: { marginTop: Spacing.xxl, marginBottom: Spacing.xxxl },
  title: { fontSize: 32, fontWeight: '700', color: Colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, marginTop: Spacing.xs },
  form: { gap: Spacing.base },
  field: { gap: Spacing.xs },
  label: { fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnPrimary: {
    backgroundColor: Colors.brand,
    paddingVertical: Spacing.base,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  btnPrimaryText: { color: Colors.textInverse, fontSize: 16, fontWeight: '600' },
  btnDisabled: { opacity: 0.6 },
  pressed: { opacity: 0.7 },
  switchText: { textAlign: 'center', color: Colors.textSecondary, fontSize: 14, marginTop: Spacing.sm },
  switchLink: { color: Colors.brand, fontWeight: '600' },
});
