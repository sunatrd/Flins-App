import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { DEFAULT_CATEGORIES } from '@/constants/defaultCategories';

export type Category = {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  is_default: boolean;
  created_at: string;
};

type CategoryState = {
  categories: Category[];
  loading: boolean;
  fetch: (userId: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  seedDefaults: (userId: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,

  fetch: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });
    set({ categories: data ?? [], loading: false });
  },

  addCategory: async (category) => {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    if (!error && data) {
      set((s) => ({ categories: [...s.categories, data] }));
    }
  },

  updateCategory: async (id, updates) => {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (!error && data) {
      set((s) => ({
        categories: s.categories.map((c) => (c.id === id ? data : c)),
      }));
    }
  },

  removeCategory: async (id) => {
    await supabase.from('categories').delete().eq('id', id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },

  seedDefaults: async (userId) => {
    const existing = get().categories;
    if (existing.length > 0) return;

    const rows = DEFAULT_CATEGORIES.map((c) => ({
      ...c,
      user_id: userId,
      is_default: true,
    }));

    const { data } = await supabase
      .from('categories')
      .insert(rows)
      .select();

    if (data) {
      set({ categories: data });
    }
  },
}));
