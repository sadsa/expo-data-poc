import 'expo-router/entry';
import './msw.polyfills';
import { server } from './mocks/server';
import { worker } from './mocks/browser';

async function enableMocking() {
  if (!__DEV__) return;
  if (!process.env.EXPO_PUBLIC_ENABLE_MOCKS) return;

  server.listen();
  worker.start();
}

enableMocking();
