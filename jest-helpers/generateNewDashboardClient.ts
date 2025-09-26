import { fetch as ponyfillFetch } from '@whatwg-node/fetch';
import {
  ApiError,
  buildClient,
  Client,
  ClientConfigOptions
} from '../packages/dashboard-client';

const fetchFn = typeof fetch === 'undefined' ? ponyfillFetch : fetch;

export const baseConfigOptions: Partial<ClientConfigOptions> = {
  baseUrl: process.env.ACCOUNT_API_BASE_URL,
  fetchFn,
};

export function shuffleArray<T>(source: T[]) {
  const array = [...source];

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j]!;
    array[j] = temp!;
  }
  return array;
}

export async function generateNewDashboardClient(
  extraConfig?: Partial<ClientConfigOptions>,
): Promise<Client> {
  if (process.env.DATOCMS_SESSION_ID) {
    return buildClient({
      ...extraConfig,
      apiToken: process.env.DATOCMS_SESSION_ID,
      organization: process.env.DATOCMS_ORGANIZATION_ID,
      ...baseConfigOptions,
    });
  }

  if (
    !process.env.DATOCMS_ACCOUNT_EMAIL ||
    !process.env.DATOCMS_ACCOUNT_PASSWORD
  ) {
    throw new Error(
      'DATOCMS_ACCOUNT_EMAIL, DATOCMS_ACCOUNT_PASSWORD (and optionally DATOCMS_ORGANIZATION_ID) environment variables must be set on .env file!',
    );
  }

  // To avoid incurring in rate limits, a pool of accouts that share the same
  // password and organization membership can be used.

  const emails = shuffleArray(
    process.env.DATOCMS_ACCOUNT_EMAIL.split(/\s*,\s*/),
  );

  for (const email of emails) {
    const client = buildClient({
      ...extraConfig,
      apiToken: null,
      autoRetry: false,
      ...baseConfigOptions,
    });

    try {
      console.log(`Trying with ${email}...`);

      const account = await client.session.rawCreate({
        data: {
          type: 'email_credentials',
          attributes: {
            email: email,
            password: process.env.DATOCMS_ACCOUNT_PASSWORD,
          },
        },
      });

      process.env.DATOCMS_SESSION_ID = account.data.id;
      // console.log('DATOCMS_SESSION_ID', account.data.id);

      return generateNewDashboardClient(extraConfig);
    } catch (e) {
      // Let's try with next account
      if (e instanceof ApiError && e.findError('RATE_LIMIT_EXCEEDED')) {
        continue;
      }

      throw e;
    }
  }

  throw new Error('Account pool exhausted!');
}
