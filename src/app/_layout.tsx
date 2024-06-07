import { Slot } from 'expo-router';
import { SessionProvider } from '~/context/session-provider';

export default function RootLayout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
