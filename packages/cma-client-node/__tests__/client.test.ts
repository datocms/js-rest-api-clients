import { baseConfigOptions } from '../../../jest-helpers/generateNewCmaClient';
import { ApiError, type ApiTypes, buildClient } from '../src';

describe('@datocms/client', () => {
  it.concurrent('first test', async () => {
    try {
      const client = buildClient({ apiToken: 'XXX', ...baseConfigOptions });
      await client.items.list({});
    } catch (e) {
      if (!(e instanceof ApiError)) {
        expect(false).toBe(true);
        return;
      }

      const unauthorizedError = e.findError('INVALID_AUTHORIZATION_HEADER');

      expect(unauthorizedError).toBeTruthy();
    }
  });

  it.concurrent('iterators', async () => {
    const client = buildClient({
      apiToken: 'faeb9172e232a75339242faafb9e56de8c8f13b735f7090964',
      ...baseConfigOptions,
    });

    const allItems: ApiTypes.Item[] = [];

    for await (const item of client.items.listPagedIterator(
      {
        filter: { type: 'blog_post' },
        page: { offset: 4 },
      },
      { perPage: 5 },
    )) {
      allItems.push(item);
    }

    expect(allItems.length).toBeGreaterThan(5);
  });
});
