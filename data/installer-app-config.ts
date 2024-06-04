import { z } from 'zod';

import { supportPanelApi } from '~/services/support-panel-api';

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
  return supportPanelApi.get(`/installerAppConfig`, installerAppConfigSchema);
}
