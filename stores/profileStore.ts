import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

type Profile = {
  full_name: string;
  currency: string;
};

type ProfileState = {
  profile: Profile | null;
  fetch: (userId: string) => Promise<void>;
  update: (userId: string, fields: Partial<Profile>) => Promise<string | null>;
  clear: () => void;
};

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,

  fetch: async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('full_name, currency')
      .eq('id', userId)
      .single();
    if (data) {
      set({ profile: { full_name: data.full_name ?? '', currency: data.currency ?? 'USD' } });
    }
  },

  update: async (userId, fields) => {
    const { error } = await supabase
      .from('profiles')
      .update(fields)
      .eq('id', userId);
    if (error) return error.message;
    set((s) => ({
      profile: s.profile ? { ...s.profile, ...fields } : null,
    }));
    return null;
  },

  clear: () => set({ profile: null }),
}));
