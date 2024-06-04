import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom';
import { server } from './mocks/server';

// Establish API mocking before all tests.
global.beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
global.afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
global.afterAll(() => server.close());
