import { z } from 'zod';

import { installerAppApi } from '~/services/installer-app-api';

export const installerAppConfigSchema = z
  .object({
    supportedVersions: z.object({
      android: z.string(),
      ios: z.string()
    })
  })
  .strip();

/**
 * Fetches installer application configuration data.
 */
export async function getInstallerAppConfig() {
  return installerAppApi.get(
    `/api/installer-app-config`,
    installerAppConfigSchema
  );
}
