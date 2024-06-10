import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ConfigPage from '~/app/config';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue('123')
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ConfigPage', () => {
  test('refetches config data on button press', async () => {
    const { findByText } = render(<ConfigPage />, { wrapper });
    expect(await findByText('Loading...')).toBeTruthy();
    fireEvent.press(await findByText('Fetch config'));
    expect(await findByText(/supportedVersions/i)).toBeTruthy();
  });
});
