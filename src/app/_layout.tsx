import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Platform } from 'react-native';

import { SessionProvider } from '~/context/session-provider';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <Slot />
        {Platform.OS === 'web' && <ReactQueryDevtools initialIsOpen={false} />}
      </SessionProvider>
    </QueryClientProvider>
  );
}
