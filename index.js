import { registerRootComponent } from 'expo';
import { App } from './components/App';
import './msw.polyfills';
import { server } from './mocks/server';

async function enableMocking() {
  if (!__DEV__) {
    return;
  }

  server.listen();
}

enableMocking().then(() => {
  registerRootComponent(App);
});
