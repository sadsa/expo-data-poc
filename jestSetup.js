import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Load env.test variables
import { load } from '@expo/env';
load(process.cwd());

// Establish API mocking before all tests.
global.beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
global.afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
global.afterAll(() => server.close());
