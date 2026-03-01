import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTransactionStore } from '@/stores/transactionStore';
import { useProfileStore } from '@/stores/profileStore';

export default function RootLayout() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        useProfileStore.getState().fetch(session.user.id);
        useCategoryStore.getState().fetch(session.user.id).then(() => {
          useCategoryStore.getState().seedDefaults(session.user.id);
        });
        useTransactionStore.getState().fetch(session.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        useProfileStore.getState().fetch(session.user.id);
        useCategoryStore.getState().fetch(session.user.id).then(() => {
          useCategoryStore.getState().seedDefaults(session.user.id);
        });
        useTransactionStore.getState().fetch(session.user.id);
      } else {
        useProfileStore.getState().clear();
        useCategoryStore.getState().clear();
        useTransactionStore.getState().clear();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal/add-transaction"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="modal/add-category"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="modal/settings"
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack>
    </>
  );
}
