import type { Client } from '../src/generated/Client';
import {
  type EnvironmentFlag,
  fetchEnvironmentSettings,
  isEnvironmentFlagActive,
} from '../src/utilities/environmentSettings';

function buildClient(meta: Record<string, unknown>, locales = ['en']) {
  const find = jest.fn(async () => ({ locales, meta }));

  return { client: { site: { find } } as unknown as Client, find };
}

describe('environment settings', () => {
  it('derives the flag names from the generated meta type', () => {
    // Every boolean in `site.meta` is a flag, whether it is a product-update
    // opt-in or plain state...
    const flags: EnvironmentFlag[] = [
      'non_localized_focal_points',
      'milliseconds_in_datetime',
      'draft_mode_default',
      'improved_exposure_of_inline_blocks_in_cda',
      'custom_upload_storage_settings',
      'allow_custom_theme',
    ];

    expect(flags).toHaveLength(6);

    // ...and nothing else is: `created_at` is a string, `nope` isn't there
    // @ts-expect-error
    const notAFlag: EnvironmentFlag = 'created_at';
    // @ts-expect-error
    const neitherIsThis: EnvironmentFlag = 'nope';

    expect([notAFlag, neitherIsThis]).toBeTruthy();
  });

  it('reports an active flag', async () => {
    const { client } = buildClient({ milliseconds_in_datetime: true });

    await expect(
      isEnvironmentFlagActive(client, 'milliseconds_in_datetime'),
    ).resolves.toBe(true);
  });

  it('treats an absent flag as inactive', async () => {
    const { client } = buildClient({});

    await expect(
      isEnvironmentFlagActive(client, 'non_localized_focal_points'),
    ).resolves.toBe(false);
  });

  it('answers about several flags with a single lookup', async () => {
    const { client, find } = buildClient({
      improved_items_listing: true,
      milliseconds_in_datetime: false,
    });

    await Promise.all([
      isEnvironmentFlagActive(client, 'improved_items_listing'),
      isEnvironmentFlagActive(client, 'milliseconds_in_datetime'),
      fetchEnvironmentSettings(client),
    ]);

    expect(find).toHaveBeenCalledTimes(1);
  });

  it('picks up an activation once the cached site expires', async () => {
    const { client, find } = buildClient({ improved_boolean_fields: false });

    await expect(
      isEnvironmentFlagActive(client, 'improved_boolean_fields'),
    ).resolves.toBe(false);

    find.mockResolvedValue({
      locales: ['en'],
      meta: { improved_boolean_fields: true },
    });

    // Still cached, so the activation is not seen yet
    await expect(
      isEnvironmentFlagActive(client, 'improved_boolean_fields'),
    ).resolves.toBe(false);
    expect(find).toHaveBeenCalledTimes(1);

    const realNow = Date.now();
    jest.spyOn(Date, 'now').mockReturnValue(realNow + 21 * 60 * 1000);

    await expect(
      isEnvironmentFlagActive(client, 'improved_boolean_fields'),
    ).resolves.toBe(true);
    expect(find).toHaveBeenCalledTimes(2);

    jest.spyOn(Date, 'now').mockRestore();
  });

  it('keeps a cache per client', async () => {
    const first = buildClient({ improved_items_listing: true });
    const second = buildClient({ improved_items_listing: false });

    await expect(
      isEnvironmentFlagActive(first.client, 'improved_items_listing'),
    ).resolves.toBe(true);
    await expect(
      isEnvironmentFlagActive(second.client, 'improved_items_listing'),
    ).resolves.toBe(false);
  });

  it('does not cache a failed lookup', async () => {
    const { client, find } = buildClient({ improved_items_listing: true });

    find.mockRejectedValueOnce(new Error('boom'));

    await expect(fetchEnvironmentSettings(client)).rejects.toThrow('boom');
    await expect(
      isEnvironmentFlagActive(client, 'improved_items_listing'),
    ).resolves.toBe(true);

    expect(find).toHaveBeenCalledTimes(2);
  });
});
