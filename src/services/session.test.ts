import { sessionService, EnvironmentId } from './session';
import { env } from '~/env';
import { http, HttpResponse } from 'msw';
import { server } from '~/mocks/server';

describe('sessionService', () => {
  describe('login', () => {
    it('should login successfully and return a session object', async () => {
      server.use(
        http.post(
          `${env.EXPO_PUBLIC_CORETEX_SYSCO_REST_API}/Logon/UserLogin`,
          () => {
            return HttpResponse.json({
              Code: 0,
              Message: null,
              Value: { SessionID: '12345' }
            });
          }
        )
      );

      const username = 'user@sysco.com';
      const password = 'password123';
      const result = await sessionService.login(username, password);

      expect(result).toEqual({
        sessionId: '12345',
        environmentId: EnvironmentId.SYSCO
      });
    });

    it('should throw an error if the login response code is not 0', async () => {
      server.use(
        http.post(
          `${env.EXPO_PUBLIC_CORETEX_ODFL_REST_API}/Logon/UserLogin`,
          () => {
            return HttpResponse.json({
              Code: -1,
              Message: 'Invalid credentials',
              Value: null
            });
          }
        )
      );

      const username = 'user@odfl.com';
      const password = 'password123';

      await expect(sessionService.login(username, password)).rejects.toThrow(
        'Login failed: Invalid credentials'
      );
    });

    it('should default to the DEFAULT environment if the domain is unrecognized', async () => {
      server.use(
        http.post(
          `${env.EXPO_PUBLIC_CORETEX_360_REST_API}/Logon/UserLogin`,
          () => {
            return HttpResponse.json({
              Code: 0,
              Message: null,
              Value: { SessionID: '67890' }
            });
          }
        )
      );

      const username = 'user@unknown.com';
      const password = 'password123';
      const result = await sessionService.login(username, password);

      expect(result).toEqual({
        sessionId: '67890',
        environmentId: EnvironmentId.DEFAULT
      });
    });

    it('should handle network or server errors gracefully', async () => {
      const username = 'user@unknown.com';
      const password = 'password123';
      server.use(
        http.post(
          `${env.EXPO_PUBLIC_CORETEX_360_REST_API}/Logon/UserLogin`,
          () => {
            return HttpResponse.error();
          }
        )
      );

      await expect(sessionService.login(username, password)).rejects.toThrow(
        'Failed to fetch'
      );
    });
  });
});
