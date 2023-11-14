import { buildClient, ClientConfigOptions } from '../packages/dashboard-client';

import { fetch as ponyfillFetch } from '@whatwg-node/fetch';

const fetchFn = typeof fetch === 'undefined' ? ponyfillFetch : fetch;

export const baseConfigOptions: Partial<ClientConfigOptions> = {
  baseUrl: process.env.ACCOUNT_API_BASE_URL,
  fetchFn,
};

export async function generateNewDashboardClient(
  extraConfig?: Partial<ClientConfigOptions>,
) {
  const randomString =
    Math.random().toString(36).substring(7) + new Date().getTime();

  const client = buildClient({
    apiToken: null,
    ...baseConfigOptions,
  });

  const account = await client.account.create({
    email: `${randomString}@delete-this-at-midnight-utc.tk`,
    password: 'STRONG_pass123!',
    first_name: 'Test',
    company: 'DatoCMS',
  });

  return buildClient({
    ...extraConfig,
    apiToken: account.id,
    ...baseConfigOptions,
  });
}
