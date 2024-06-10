import { createRestApi } from '~/utils/rest/create-rest-api';
import { env } from '~/env';

export { handleRestApiError } from '~/utils/rest/handle-error';
export { RestApiError } from '~/utils/rest/rest-api-error';

/**
 * Support Panel REST API.
 */
export const supportPanelApi = createRestApi(
  env.EXPO_PUBLIC_SUPPORT_PANEL_API ?? ''
);
