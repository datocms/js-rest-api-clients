import type { Client } from '../src/generated/Client';
import UploadResource from '../src/resources/Upload';

type SiteStub = {
  locales: string[];
  meta?: { non_localized_focal_points?: boolean };
};

function buildResource(site: SiteStub, upload: Record<string, unknown> = {}) {
  const find = jest.fn(async () => site);

  const entity = {
    id: 'aaa',
    type: 'upload',
    attributes: { path: '/img.png', ...upload },
  };

  const request = jest.fn(async ({ url }: { url: string }) => ({
    // `/uploads` is the collection endpoint; everything else is a single entity
    data: url === '/uploads' ? [entity] : entity,
  }));

  const client = { site: { find }, request } as unknown as Client;

  return { uploads: new UploadResource(client), find, request };
}

function sentAttributes(request: jest.Mock) {
  return (request.mock.calls[0]?.[0] as { body: { data: { attributes: any } } })
    .body.data.attributes;
}

const fieldKeyedMetadata = {
  alt: { en: 'An alt', it: 'Un alt' },
  title: { en: 'A title', it: 'Un titolo' },
  focal_point: { x: 0.3, y: 0.6 },
};

describe('default_field_metadata wire shape', () => {
  describe('on an environment with the opt-in active', () => {
    const site: SiteStub = {
      locales: ['en', 'it'],
      meta: { non_localized_focal_points: true },
    };

    it('sends the field-keyed payload untouched', async () => {
      const { uploads, request } = buildResource(site);

      await uploads.update('aaa', {
        default_field_metadata: fieldKeyedMetadata,
      });

      expect(sentAttributes(request).default_field_metadata).toEqual(
        fieldKeyedMetadata,
      );
    });

    it('leaves a field-keyed response untouched', async () => {
      const { uploads } = buildResource(site, {
        default_field_metadata: {
          alt: { en: 'An alt' },
          title: { en: null },
          custom_data: { en: {} },
          focal_point: { x: 0.3, y: 0.6 },
          poster_time: null,
        },
      });

      const upload = await uploads.find('aaa');

      expect(upload.default_field_metadata.alt).toEqual({ en: 'An alt' });
      expect(upload.default_field_metadata.focal_point).toEqual({
        x: 0.3,
        y: 0.6,
      });
    });
  });

  describe('on an environment with the opt-in inactive', () => {
    const site: SiteStub = {
      locales: ['en', 'it'],
      meta: { non_localized_focal_points: false },
    };

    it('pivots the payload to the locale-keyed shape', async () => {
      const { uploads, request } = buildResource(site);

      await uploads.update('aaa', {
        default_field_metadata: fieldKeyedMetadata,
      });

      expect(sentAttributes(request).default_field_metadata).toEqual({
        en: {
          alt: 'An alt',
          title: 'A title',
          focal_point: { x: 0.3, y: 0.6 },
        },
        it: { alt: 'Un alt', title: 'Un titolo' },
      });
    });

    it('writes a lone focal_point on the environment first locale', async () => {
      const { uploads, request } = buildResource(site);

      await uploads.update('aaa', {
        default_field_metadata: { focal_point: { x: 0.1, y: 0.2 } },
      });

      expect(sentAttributes(request).default_field_metadata).toEqual({
        en: { focal_point: { x: 0.1, y: 0.2 } },
      });
    });

    it('normalizes a locale-keyed response to the field-keyed shape', async () => {
      const { uploads } = buildResource(site, {
        default_field_metadata: {
          en: {
            alt: 'An alt',
            title: null,
            custom_data: {},
            focal_point: { x: 0.3, y: 0.6 },
            poster_time: 12.5,
          },
          it: {
            alt: 'Un alt',
            title: null,
            custom_data: {},
            focal_point: { x: 0.3, y: 0.6 },
            poster_time: 12.5,
          },
        },
      });

      const upload = await uploads.find('aaa');

      expect(upload.default_field_metadata).toEqual({
        alt: { en: 'An alt', it: 'Un alt' },
        title: { en: null, it: null },
        custom_data: { en: {}, it: {} },
        focal_point: { x: 0.3, y: 0.6 },
        poster_time: 12.5,
      });
    });

    it('treats a missing opt-in flag as inactive', async () => {
      const { uploads, request } = buildResource({ locales: ['en'], meta: {} });

      await uploads.update('aaa', {
        default_field_metadata: { alt: { en: 'An alt' } },
      });

      expect(sentAttributes(request).default_field_metadata).toEqual({
        en: { alt: 'An alt' },
      });
    });
  });

  describe('the environment lookup', () => {
    const site: SiteStub = {
      locales: ['en'],
      meta: { non_localized_focal_points: false },
    };

    it('runs once for a whole batch of concurrent writes', async () => {
      const { uploads, find } = buildResource(site);

      await Promise.all(
        Array.from({ length: 500 }, (_, i) =>
          uploads.update('aaa', {
            default_field_metadata: { alt: { en: `Alt ${i}` } },
          }),
        ),
      );

      expect(find).toHaveBeenCalledTimes(1);
    });

    it('never runs for writes that carry no metadata', async () => {
      const { uploads, find } = buildResource(site);

      await uploads.update('aaa', { author: 'Someone' });
      await uploads.find('aaa');
      await uploads.list();

      expect(find).not.toHaveBeenCalled();
    });

    it('is not poisoned by a failed lookup', async () => {
      const { uploads, find } = buildResource(site);

      find.mockRejectedValueOnce(new Error('boom'));

      await expect(
        uploads.update('aaa', { default_field_metadata: { alt: { en: 'x' } } }),
      ).rejects.toThrow('boom');

      await uploads.update('aaa', {
        default_field_metadata: { alt: { en: 'x' } },
      });

      expect(find).toHaveBeenCalledTimes(2);
    });
  });
});
