import { generateNewCmaClient } from '../../../jest-helpers/generateNewCmaClient';

describe('upload default_field_metadata', () => {
  it.concurrent('round-trips the field-keyed shape', async () => {
    const client = await generateNewCmaClient();

    await client.site.update({ locales: ['en', 'it'] });

    const upload = await client.uploads.createFromUrl({
      url: 'https://www.datocms-assets.com/205/1525789775-dato.png',
      default_field_metadata: {
        alt: { en: 'An alt', it: 'Un alt' },
        title: { en: 'A title', it: 'Un titolo' },
        focal_point: { x: 0.3, y: 0.6 },
      },
    });

    expect(upload.default_field_metadata.alt).toEqual({
      en: 'An alt',
      it: 'Un alt',
    });
    expect(upload.default_field_metadata.focal_point).toEqual({
      x: 0.3,
      y: 0.6,
    });

    const updated = await client.uploads.update(upload.id, {
      default_field_metadata: { alt: { en: 'A new alt' } },
    });

    // A partial patch leaves the untouched keys alone
    expect(updated.default_field_metadata.alt).toEqual({
      en: 'A new alt',
      it: 'Un alt',
    });
    expect(updated.default_field_metadata.title).toEqual({
      en: 'A title',
      it: 'Un titolo',
    });

    const found = await client.uploads.find(upload.id);
    expect(found.default_field_metadata).toEqual(
      updated.default_field_metadata,
    );

    const [listed] = await client.uploads.list();
    expect(listed!.default_field_metadata).toEqual(
      updated.default_field_metadata,
    );
  });

  it.concurrent('looks the environment up once for a batch', async () => {
    const client = await generateNewCmaClient();

    const upload = await client.uploads.createFromUrl({
      url: 'https://www.datocms-assets.com/205/1525789775-dato.png',
    });

    const siteFind = jest.spyOn(client.site, 'find');

    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        client.uploads.update(upload.id, {
          default_field_metadata: { alt: { en: `Alt ${i}` } },
        }),
      ),
    );

    expect(siteFind).toHaveBeenCalledTimes(1);

    // And the cached answer still serves later writes
    await client.uploads.update(upload.id, {
      default_field_metadata: { alt: { en: 'Last alt' } },
    });

    expect(siteFind).toHaveBeenCalledTimes(1);

    siteFind.mockRestore();
  });

  it.concurrent('asks nothing when no metadata is written', async () => {
    const client = await generateNewCmaClient();

    const upload = await client.uploads.createFromUrl({
      url: 'https://www.datocms-assets.com/205/1525789775-dato.png',
    });

    const siteFind = jest.spyOn(client.site, 'find');

    await client.uploads.update(upload.id, { author: 'Someone' });
    await client.uploads.find(upload.id);
    await client.uploads.list();

    expect(siteFind).not.toHaveBeenCalled();

    siteFind.mockRestore();
  });
});
