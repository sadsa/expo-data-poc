import { storage } from '~/services/storage';

/**
 * Returns authorization headers for external API.
 */
export async function authorizationHeaders() {
  const sessionId = await storage.getItemAsync('sessionId');
  const environmentId = await storage.getItemAsync('environmentId');

  if (!sessionId || !environmentId) {
    throw new Error('Session ID or Environment ID is missing');
  }

  return {
    'Session-Id': sessionId,
    'Environment-Id': environmentId
  };
}
