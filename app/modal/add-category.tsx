import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useCategoryStore } from '@/stores/categoryStore';
import { useAuthStore } from '@/stores/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';

const EMOJIS = [
  '🍔','🚗','🛍️','🎬','💊','📚','🏠','💡','✈️','📱',
  '💼','💻','📈','🎁','💰','🎮','🐾','🌿','☕','🍕',
  '🎵','🏋️','💇','🚌','🧴','🎓','🏥','🔧','🎨','📦',
];

const COLORS = Colors.categoryColors;

type CategoryType = 'income' | 'expense' | 'both';

export default function AddCategoryModal() {
  const { addCategory } = useCategoryStore();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [type, setType] = useState<CategoryType>('expense');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a category name.');
      return;
    }
    if (!user) return;

    setSaving(true);
    await addCategory({ user_id: user.id, name: name.trim(), icon, color, type, is_default: false });
    setSaving(false);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>New Category</Text>
        <Pressable onPress={handleSave} disabled={saving}>
          <Text style={[styles.save, saving && styles.saveDisabled]}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Preview */}
        <View style={styles.preview}>
          <View style={[styles.previewIcon, { backgroundColor: `${color}20` }]}>
            <Text style={styles.previewEmoji}>{icon}</Text>
          </View>
          <Text style={styles.previewName}>{name || 'Category Name'}</Text>
        </View>

        {/* Name */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Groceries"
            placeholderTextColor={Colors.textTertiary}
            value={name}
            onChangeText={setName}
            maxLength={30}
          />
        </View>

        {/* Type */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Type</Text>
          <View style={styles.typeRow}>
            {(['expense', 'income', 'both'] as CategoryType[]).map((t) => (
              <Pressable
                key={t}
                style={[styles.typeBtn, type === t && styles.typeBtnActive]}
                onPress={() => setType(t)}
              >
                <Text style={[styles.typeBtnText, type === t && styles.typeBtnTextActive]}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Emoji */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Icon</Text>
          <View style={styles.emojiGrid}>
            {EMOJIS.map((e) => (
              <Pressable
                key={e}
                style={[styles.emojiBtn, icon === e && styles.emojiBtnActive]}
                onPress={() => setIcon(e)}
              >
                <Text style={styles.emoji}>{e}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Color */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <Pressable
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  content: { padding: Spacing.xl, gap: Spacing.xl },
  preview: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.base },
  previewIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewEmoji: { fontSize: 34 },
  previewName: { fontSize: 18, fontWeight: '600', color: Colors.textPrimary },
  section: { gap: Spacing.sm },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
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
  typeRow: { flexDirection: 'row', gap: Spacing.sm },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBtnActive: { backgroundColor: Colors.brandLight, borderColor: Colors.brand },
  typeBtnText: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary },
  typeBtnTextActive: { color: Colors.brand, fontWeight: '600' },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  emojiBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  emojiBtnActive: { backgroundColor: Colors.brandLight, borderWidth: 2, borderColor: Colors.brand },
  emoji: { fontSize: 22 },
  colorRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  colorDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
});
