import 'expo-router/entry';
import './msw.polyfills';
import { server } from './mocks/server';
import { env } from '~/env';

async function enableMocking() {
  if (!__DEV__) return;
  if (!env.EXPO_PUBLIC_ENABLE_MOCKS) return;

  server.listen();
}

enableMocking();
