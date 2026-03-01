import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Radius, Shadow } from '@/constants/spacing';

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar', symbol: '$' },
  { code: 'THB', label: 'Thai Baht', symbol: '฿' },
];

export default function SettingsModal() {
  const { user, signOut } = useAuthStore();

  const [name, setName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('full_name, currency')
        .eq('id', user.id)
        .single();

      if (data) {
        setName(data.full_name ?? '');
        setCurrency(data.currency ?? 'USD');
      }
      setLoading(false);
    }
    loadProfile();
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim(), currency })
      .eq('id', user.id);

    setSaving(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      router.back();
    }
  }

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  }

  const selectedCurrency = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <Pressable onPress={handleSave} disabled={saving || loading}>
          <Text style={[styles.save, (saving || loading) && styles.saveDisabled]}>
            {saving ? 'Saving…' : 'Save'}
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.brand} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>

          {/* Profile section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>Profile</Text>
            <View style={styles.card}>

              {/* Name */}
              <View style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons name="person-outline" size={18} color={Colors.brand} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>Name</Text>
                  <TextInput
                    style={styles.rowInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                    placeholderTextColor={Colors.textTertiary}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              <View style={styles.divider} />

              {/* Email */}
              <View style={styles.row}>
                <View style={styles.rowIcon}>
                  <Ionicons name="mail-outline" size={18} color={Colors.textTertiary} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>Email</Text>
                  <Text style={styles.rowValueDisabled} numberOfLines={1}>
                    {user?.email}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Preferences section */}
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionLabel}>Preferences</Text>
            <View style={styles.card}>

              {/* Currency */}
              <Pressable
                style={styles.row}
                onPress={() => setCurrencyOpen((v) => !v)}
              >
                <View style={styles.rowIcon}>
                  <Ionicons name="cash-outline" size={18} color={Colors.brand} />
                </View>
                <View style={styles.rowContent}>
                  <Text style={styles.rowLabel}>Currency</Text>
                  <Text style={styles.rowValue}>
                    {selectedCurrency.symbol} {selectedCurrency.code}
                  </Text>
                </View>
                <Ionicons
                  name={currencyOpen ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={Colors.textTertiary}
                />
              </Pressable>

              {currencyOpen && (
                <View style={styles.currencyOptions}>
                  {CURRENCIES.map((c, i) => (
                    <Pressable
                      key={c.code}
                      style={[
                        styles.currencyOption,
                        i < CURRENCIES.length - 1 && styles.currencyOptionBorder,
                        currency === c.code && styles.currencyOptionSelected,
                      ]}
                      onPress={() => { setCurrency(c.code); setCurrencyOpen(false); }}
                    >
                      <View style={styles.currencyOptionLeft}>
                        <Text style={styles.currencySymbol}>{c.symbol}</Text>
                        <View>
                          <Text style={[
                            styles.currencyCode,
                            currency === c.code && styles.currencyCodeSelected,
                          ]}>
                            {c.code}
                          </Text>
                          <Text style={styles.currencyLabel}>{c.label}</Text>
                        </View>
                      </View>
                      {currency === c.code && (
                        <Ionicons name="checkmark" size={18} color={Colors.brand} />
                      )}
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Sign out */}
          <Pressable
            style={({ pressed }) => [styles.signOutBtn, pressed && styles.pressed]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.expense} />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  cancel: { fontSize: 15, color: Colors.textSecondary },
  save: { fontSize: 15, fontWeight: '600', color: Colors.brand },
  saveDisabled: { opacity: 0.4 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 48 },

  sectionGroup: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    paddingHorizontal: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowContent: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  rowInput: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '500',
    padding: 0,
  },
  rowValue: { fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  rowValueDisabled: { fontSize: 15, color: Colors.textTertiary },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.base + 32 + Spacing.md,
  },

  // Currency dropdown
  currencyOptions: {
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
  },
  currencyOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  currencyOptionSelected: {
    backgroundColor: Colors.brandLight,
  },
  currencyOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  currencySymbol: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.textPrimary,
    width: 28,
    textAlign: 'center',
  },
  currencyCode: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  currencyCodeSelected: { color: Colors.brand },
  currencyLabel: { fontSize: 12, color: Colors.textSecondary },

  // Sign out
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.expenseLight,
    paddingVertical: Spacing.base,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: `${Colors.expense}20`,
  },
  signOutText: { fontSize: 15, fontWeight: '600', color: Colors.expense },
  pressed: { opacity: 0.7 },
});
