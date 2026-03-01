import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTransactionStore } from '@/stores/transactionStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAuthStore } from '@/stores/authStore';
import { CategoryPicker } from '@/components/category/CategoryPicker';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';

type TxType = 'expense' | 'income';

export default function AddTransactionModal() {
  const { addTransaction } = useTransactionStore();
  const { categories } = useCategoryStore();
  const { user } = useAuthStore();

  const [type, setType] = useState<TxType>('expense');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [dateObj, setDateObj] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    const parsed = parseFloat(amount.replace(',', '.'));
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be signed in to save a transaction.');
      return;
    }

    setSaving(true);
    const errorMsg = await addTransaction({
      user_id: user.id,
      type,
      amount: parsed,
      category_id: categoryId,
      note: note.trim() || null,
      date: format(dateObj, 'yyyy-MM-dd'),
    });
    setSaving(false);

    if (errorMsg) {
      Alert.alert('Could not save', errorMsg);
      return;
    }

    router.back();
  }

  const accentColor = type === 'income' ? Colors.income : Colors.expense;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New Transaction</Text>
        <Pressable onPress={handleSave} disabled={saving}>
          <Text style={[styles.save, saving && styles.saveDisabled]}>Save</Text>
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type Toggle */}
          <View style={styles.typeRow}>
            {(['expense', 'income'] as TxType[]).map((t) => (
              <Pressable
                key={t}
                style={[
                  styles.typeBtn,
                  type === t && {
                    backgroundColor: t === 'income' ? Colors.incomeLight : Colors.expenseLight,
                    borderColor: t === 'income' ? Colors.income : Colors.expense,
                  },
                ]}
                onPress={() => { setType(t); setCategoryId(null); }}
              >
                <Text
                  style={[
                    styles.typeBtnText,
                    type === t && {
                      color: t === 'income' ? Colors.income : Colors.expense,
                      fontWeight: '700',
                    },
                  ]}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Amount */}
          <View style={styles.amountContainer}>
            <Text style={[styles.currencySymbol, { color: accentColor }]}>$</Text>
            <TextInput
              style={[styles.amountInput, { color: accentColor }]}
              placeholder="0.00"
              placeholderTextColor={`${accentColor}50`}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              autoFocus
            />
          </View>

          {/* Category */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Category</Text>
            <CategoryPicker
              categories={categories}
              selectedId={categoryId}
              onSelect={setCategoryId}
              type={type}
            />
          </View>

          {/* Note */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Note</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (optional)"
              placeholderTextColor={Colors.textTertiary}
              value={note}
              onChangeText={setNote}
              multiline
              maxLength={200}
            />
          </View>

          {/* Date */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Date</Text>
            <Pressable
              style={styles.dateBtn}
              onPress={() => setShowDatePicker((v) => !v)}
            >
              <Text style={styles.dateIcon}>📅</Text>
              <Text style={styles.dateBtnText}>
                {format(dateObj, 'MMMM d, yyyy')}
              </Text>
              <Text style={styles.dateChevron}>›</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  if (Platform.OS === 'android') setShowDatePicker(false);
                  if (selectedDate) setDateObj(selectedDate);
                }}
                style={styles.datePicker}
              />
            )}
          </View>

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: accentColor },
              pressed && styles.pressed,
              saving && styles.saveDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving…' : `Save ${type === 'income' ? 'Income' : 'Expense'}`}
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  cancel: { fontSize: 15, color: Colors.textSecondary },
  save: { fontSize: 15, fontWeight: '600', color: Colors.brand },
  saveDisabled: { opacity: 0.5 },
  content: { padding: Spacing.xl, gap: Spacing.xl, paddingBottom: 48 },
  typeRow: { flexDirection: 'row', gap: Spacing.sm },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  typeBtnText: { fontSize: 15, fontWeight: '500', color: Colors.textSecondary },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.base,
  },
  currencySymbol: { fontSize: 40, fontWeight: '300', marginRight: 4, marginTop: 8 },
  amountInput: {
    fontSize: 64,
    fontWeight: '700',
    letterSpacing: -2,
    minWidth: 120,
    textAlign: 'center',
  },
  section: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noteInput: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  dateIcon: { fontSize: 16 },
  dateBtnText: { flex: 1, fontSize: 15, color: Colors.textPrimary, fontWeight: '500' },
  dateChevron: { fontSize: 20, color: Colors.textTertiary },
  datePicker: { marginTop: Spacing.sm },
  saveBtn: {
    paddingVertical: Spacing.base,
    borderRadius: Radius.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  saveBtnText: { color: Colors.textInverse, fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.8 },
});
