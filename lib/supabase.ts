import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          currency: string;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          currency?: string;
        };
        Update: {
          full_name?: string | null;
          currency?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          icon: string;
          color: string;
          type: 'income' | 'expense' | 'both';
          is_default: boolean;
          created_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          icon: string;
          color: string;
          type: 'income' | 'expense' | 'both';
          is_default?: boolean;
        };
        Update: {
          name?: string;
          icon?: string;
          color?: string;
          type?: 'income' | 'expense' | 'both';
        };
      };
      transactions: {
        Row: {
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
        Insert: {
          user_id: string;
          type: 'income' | 'expense';
          amount: number;
          category_id?: string | null;
          note?: string | null;
          date?: string;
        };
        Update: {
          type?: 'income' | 'expense';
          amount?: number;
          category_id?: string | null;
          note?: string | null;
          date?: string;
        };
      };
    };
  };
};
