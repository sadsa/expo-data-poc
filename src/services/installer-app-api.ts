import { createRestApi } from '~/utils/rest/create-rest-api';
import { env } from '~/env';

/**
 * Installer App REST API.
 */
export const installerAppApi = createRestApi(
  env.EXPO_PUBLIC_INSTALLER_APP_API || ''
);
