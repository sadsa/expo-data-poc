import { Slot } from 'expo-router';
import { SessionProvider } from '~/context/session-provider';

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}
