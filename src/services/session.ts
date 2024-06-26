import { z } from 'zod';
import { createRestApi } from '~/utils/rest/create-rest-api';
import { env } from '~/env';

const loginResponseSchema = z.object({
  Code: z.number(),
  Message: z.string().nullable(),
  Value: z
    .object({
      SessionID: z.string()
    })
    .nullable()
});

const sessionSchema = z.object({
  sessionId: z.string(),
  environmentId: z.enum(['SYSCO', 'ODFL', 'DEFAULT'])
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type Session = z.infer<typeof sessionSchema>;

export enum EnvironmentId {
  ODFL = 'ODFL',
  SYSCO = 'SYSCO',
  DEFAULT = 'DEFAULT'
}

const ODFL_DOMAINS = new Set(
  ['@odfl.com'].map((domain) => domain.trim().toLowerCase())
);

const SYSCO_DOMAINS = new Set(
  [
    '@sysco.com',
    '@grecoandsons.com',
    '@pennmacfs.com',
    '@sidarifoods.com',
    '@van.sysco.ca',
    '@kelowna.sysco.ca',
    '@vic.sysco.com',
    '@edm.sysco.ca',
    '@cgy.sysco.ca',
    '@reg.sysco.ca',
    '@wpg.sysco.ca',
    '@tor.sysco.ca',
    '@swont.sysco.ca',
    '@milton.sysco.ca',
    '@ont.sysco.com',
    '@mtl.sysco.ca',
    '@hfx.sysco.ca',
    '@mct.sysco.ca',
    '@stj.sysco.ca',
    '@orbitalcustoms.com',
    '@sygmanetwork.com'
  ].map((domain) => domain.trim().toLowerCase())
);

function getEnvironmentIdFromUsername(username: string) {
  const usernameLower = username.toLowerCase();
  const domain = '@' + (usernameLower.split('@').pop() || '');
  const isODFL = ODFL_DOMAINS.has(domain);
  const isSysco = SYSCO_DOMAINS.has(domain);

  return isODFL
    ? EnvironmentId.ODFL
    : isSysco
      ? EnvironmentId.SYSCO
      : EnvironmentId.DEFAULT;
}

const environmentEndpoints = {
  [EnvironmentId.SYSCO]: env.EXPO_PUBLIC_CORETEX_SYSCO_REST_API ?? '',
  [EnvironmentId.ODFL]: env.EXPO_PUBLIC_CORETEX_ODFL_REST_API ?? '',
  [EnvironmentId.DEFAULT]: env.EXPO_PUBLIC_CORETEX_360_REST_API ?? ''
};

const getEndpointByEnvironmentId = (environmentId: EnvironmentId) => {
  return environmentEndpoints[environmentId];
};

/**
 * Logs in a user asynchronously using their username and password.
 *
 * The function identifies the user's environment by extracting the domain from the username
 * and fetching the relevant API endpoint. It then sends a POST request to '/Logon/UserLogin'
 * with the user credentials.
 *
 * If the login fails (indicated by no response or a non-zero response code), an error is thrown
 * with the response message.
 *
 * Upon successful login, a session object is created with the session ID and environment ID,
 * which is then validated and returned.
 *
 * @throws {Error} If the login is unsuccessful.
 */
async function login(username: string, password: string): Promise<Session> {
  const environmentId = getEnvironmentIdFromUsername(username);
  const endpointUrl = getEndpointByEnvironmentId(environmentId);
  const response = await createRestApi(endpointUrl).post(
    '/Logon/UserLogin',
    loginResponseSchema,
    {
      username,
      password
    }
  );
  if (!response || response.Code !== 0) {
    throw new Error(`Login failed: ${response?.Message}`);
  }
  const session = { sessionId: response.Value?.SessionID, environmentId };
  return sessionSchema.parse(session);
}

export const sessionService = { login };
