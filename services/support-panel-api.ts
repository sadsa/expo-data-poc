import { createRestApi } from '~/utils/rest/create-rest-api';

export { handleRestApiError } from '~/utils/rest/handle-error';
export { RestApiError } from '~/utils/rest/rest-api-error';

/**
 * Support Panel REST API.
 */
export const supportPanelApi = createRestApi(
  process.env.SUPPORT_PANEL_API_ENDPOINT ?? ''
);
