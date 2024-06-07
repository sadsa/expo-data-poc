import { createRestApi } from '~/utils/rest/create-rest-api';

export { handleRestApiError } from '~/utils/rest/handle-error';
export { RestApiError } from '~/utils/rest/rest-api-error';

/**
 * Installer App REST API.
 */
export const installerAppApi = createRestApi('');
