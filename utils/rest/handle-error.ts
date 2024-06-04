import { logger } from '~/services/logger';

/**
 * Higher order function.
 *
 * Enhances the wrapped rest API function (e.g. `supportPanelApi.get`) so that it
 * automatically handles errors.
 *
 * Errors are being logged (as errors) in both cases.
 */

export function handleRestApiError<T extends any[], P>(
  restApiFn: (...args: T) => Promise<P>
) {
  return async (...args: T) => {
    return restApiFn(...args).catch((error: unknown) => {
      logger.error(error);
    });
  };
}
