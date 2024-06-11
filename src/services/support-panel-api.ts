import { createRestApi } from '~/utils/rest/create-rest-api';
import { env } from '~/env';

/**
 * Support Panel REST API.
 */
export const supportPanelApi = createRestApi(
  env.EXPO_PUBLIC_SUPPORT_PANEL_API ?? ''
);
