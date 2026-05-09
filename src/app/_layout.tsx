import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuthStore } from '@/store/authStore';
import { initI18n } from '@/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function RootLayout() {
  useEffect(() => {
    // 1. restore auth session
    useAuthStore.getState().rehydrate();

    // 2. initialize language (device → user → fallback)
    initI18n();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="taxon/[id]"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="auth/login"
          options={{ presentation: 'modal' }}
        />

        <Stack.Screen
          name="auth/register"
          options={{ presentation: 'modal' }}
        />

        <Stack.Screen
          name="premium"
          options={{ presentation: 'modal' }}
        />
      </Stack>
    </QueryClientProvider>
  );
}