import { fetch as ponyfillFetch } from '@whatwg-node/fetch';
import { buildClient, ClientConfigOptions } from '../packages/cma-client-node';
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

  const randomString =
    Math.random().toString(36).substring(7) + new Date().getTime();

  const site = await dashboardClient.sites.create({
    name: `Project ${randomString}`,
  });

  return buildClient({
    ...extraConfig,
    // biome-ignore lint/style/noNonNullAssertion: We're owners of the site, so readwrite_token is present
    apiToken: site.readwrite_token!,
    ...baseConfigOptions,
  });
}
