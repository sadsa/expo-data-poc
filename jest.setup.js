import '@testing-library/jest-native/extend-expect';
import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Load env.test variables
// TODO: We need access env variable like this until
// this is fixed https://github.com/expo/expo/issues/26513
import { load } from '@expo/env';
load(process.cwd());

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
