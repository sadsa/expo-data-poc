import { fireEvent, waitFor } from '@testing-library/react-native';
import { http, HttpResponse } from 'msw';
import { renderRouter, screen } from 'expo-router/testing-library';
import SignInPage from '../app/sign-in';
import { server } from '../mocks/server';
import IndexPage from '~/app/(app)';
import AppLayout from '~/app/(app)/_layout';
import RootLayout from '~/app/_layout';
import { LoginResponse } from '~/services/session';
import { env } from '~/env';

function setup() {
  return renderRouter(
    {
      'sign-in': SignInPage,
      '(app)/index': IndexPage,
      '(app)/_layout': AppLayout,
      _layout: RootLayout
    },
    {
      initialUrl: '/'
    }
  );
}

describe('SignInPage', () => {
  it('redirects to the sign-in page', async () => {
    setup();

    await waitFor(() => {
      expect(screen).toHavePathname('/sign-in');
    });
  });
  it('allows the user to sign in successfully', async () => {
    server.use(
      http.post(
        `${env.EXPO_PUBLIC_CORETEX_360_REST_API}/Logon/UserLogin`,
        () => {
          return HttpResponse.json<LoginResponse>(
            { Code: 0, Message: null, Value: { SessionID: '123' } },
            { status: 200 }
          );
        }
      )
    );

    const { getByRole, findByRole } = setup();

    fireEvent.changeText(
      await findByRole('text', { name: 'Username Input' }),
      'testuser'
    );
    fireEvent.changeText(
      getByRole('text', { name: 'Password Input' }),
      'password123'
    );
    fireEvent.press(getByRole('button', { name: 'Submit Button' }));

    await waitFor(() => {
      expect(screen).toHavePathname('/');
    });
  });

  it('shows an error message on failed sign in', async () => {
    server.use(
      http.post(
        `${env.EXPO_PUBLIC_CORETEX_360_REST_API}/Logon/UserLogin`,
        () => {
          // Respond with a network error.
          return HttpResponse.error();
        }
      )
    );

    const { getByRole, findByRole } = setup();

    fireEvent.changeText(
      await findByRole('text', { name: 'Username Input' }),
      'wronguser'
    );
    fireEvent.changeText(
      getByRole('text', { name: 'Password Input' }),
      'wrongpass'
    );
    fireEvent.press(getByRole('button', { name: 'Submit Button' }));

    expect(await findByRole('alert', { name: 'Submit Error' })).toBeTruthy();
  });
});
