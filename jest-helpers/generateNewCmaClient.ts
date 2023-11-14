import { buildClient, ClientConfigOptions } from '../packages/cma-client-node';

import { fetch as ponyfillFetch } from '@whatwg-node/fetch';
import { generateNewDashboardClient } from './generateNewDashboardClient';

const fetchFn = typeof fetch === 'undefined' ? ponyfillFetch : fetch;

export const baseConfigOptions: Partial<ClientConfigOptions> = {
  baseUrl: process.env.SITE_API_BASE_URL,
  fetchFn,
};

export async function generateNewCmaClient(
  extraConfig?: Partial<ClientConfigOptions>,
) {
  const dashboardClient = await generateNewDashboardClient();

  const site = await dashboardClient.sites.create({
    name: 'Project',
  });

  return buildClient({
    ...extraConfig,
    apiToken: site.readwrite_token!,
    ...baseConfigOptions,
  });
}
