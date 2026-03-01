import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export type Transaction = {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category_id: string | null;
  note: string | null;
  date: string;
  created_at: string;
  updated_at: string;
};

export type TransactionWithCategory = Transaction & {
  categories: {
    name: string;
    icon: string;
    color: string;
  } | null;
};

type TransactionState = {
  transactions: TransactionWithCategory[];
  loading: boolean;
  fetch: (userId: string) => Promise<void>;
  addTransaction: (tx: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => Promise<string | null>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
};

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  loading: false,

  fetch: async (userId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(name, icon, color)')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    set({ transactions: (data as TransactionWithCategory[]) ?? [], loading: false });
  },

  addTransaction: async (tx) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        ...tx,
        date: tx.date ?? format(new Date(), 'yyyy-MM-dd'),
      })
      .select('*, categories(name, icon, color)')
      .single();

    if (error) return error.message;
    if (data) {
      set((s) => ({
        transactions: [data as TransactionWithCategory, ...s.transactions],
      }));
    }
    return null;
  },

  updateTransaction: async (id, updates) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select('*, categories(name, icon, color)')
      .single();

    if (!error && data) {
      set((s) => ({
        transactions: s.transactions.map((t) =>
          t.id === id ? (data as TransactionWithCategory) : t
        ),
      }));
    }
  },

  removeTransaction: async (id) => {
    await supabase.from('transactions').delete().eq('id', id);
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
    }));
  },
}));
