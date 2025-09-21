import {
  type ApiTypes,
  type ItemTypeDefinition,
  type RawApiTypes,
  type ToItemDefinitionAsRequest,
  buildBlockRecord,
} from '../src';
import { inspectItem } from '../src/utilities/inspectItem';

type EnvironmentSettings = { locales: 'en' | 'it' | 'fr' };

type ComprehensiveModel = ItemTypeDefinition<
  EnvironmentSettings,
  'O9BXqTayQ_Wf-Yw6d863LQ',
  {
    string_field: { type: 'string' };
    text_field: { type: 'text' };
    boolean_true: { type: 'boolean' };
    boolean_false: { type: 'boolean' };
    boolean_null: { type: 'boolean' };
    integer_field: { type: 'integer' };
    float_field: { type: 'float' };
    color_field: { type: 'color' };
    date_field: { type: 'date' };
    datetime_field: { type: 'date_time' };
    file_field: { type: 'file' };
    gallery_field: { type: 'gallery' };
    json_field: { type: 'json' };
    lat_lon_field: { type: 'lat_lon' };
    link_field: { type: 'link' };
    links_field: { type: 'links' };
    slug_field: { type: 'slug' };
    seo_field: { type: 'seo' };
    video_field: { type: 'video' };
    structured_text: {
      type: 'structured_text';
      blocks: Block;
      inline_blocks: Block;
    };
    single_block: {
      type: 'single_block';
      blocks: Block;
    };
    rich_text: {
      type: 'rich_text';
      blocks: Block;
    };
    null_string: { type: 'string' };
    null_file: { type: 'file' };
    empty_gallery: { type: 'gallery' };
    null_link: { type: 'link' };
    empty_links: { type: 'links' };
  }
>;

type LocalizedModel = ItemTypeDefinition<
  EnvironmentSettings,
  'O9BXqTayQ_Wf-Yw6d863LQ',
  {
    string_field: { type: 'string'; localized: true };
    text_field: { type: 'text'; localized: true };
    integer_field: { type: 'integer'; localized: true };
    file_field: { type: 'file'; localized: true };
    structured_text: {
      type: 'structured_text';
      blocks: Block;
      inline_blocks: Block;
      localized: true;
    };
    seo_field: { type: 'seo'; localized: true };
    boolean_true: { type: 'boolean' };
  }
>;

type Block = ItemTypeDefinition<
  EnvironmentSettings,
  'NOYldjT6TtKXXjZ8efU-dw',
  {
    title: { type: 'string' };
    structured_text: {
      type: 'structured_text';
      blocks: Block;
      inline_blocks: Block;
    };
  }
>;

describe('inspectItem', () => {
  it('inspects an item with all field types', () => {
    const item: any = {
      type: 'item',
      id: 'IdMLV2GJTXyQ0Bfns7R4IQ',
      relationships: {
        item_type: {
          data: {
            type: 'item_type',
            id: 'O9BXqTayQ_Wf-Yw6d863LQ',
          },
        },
      },
      meta: {
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        published_at: null,
        first_published_at: null,
        publication_scheduled_at: null,
        unpublishing_scheduled_at: null,
        is_valid: true,
        is_current_version_valid: true,
        is_published_version_valid: false,
        stage: 'draft',
        current_version: '1',
        status: 'draft',
        has_children: false,
      },
      attributes: {
        // String field
        string_field: 'Sample string',

        // Text field
        text_field:
          'This is a longer text content that might span multiple lines',

        // Boolean fields
        boolean_true: true,
        boolean_false: false,
        boolean_null: null,

        // Number fields
        integer_field: 42,
        float_field: Math.PI,

        // Color field
        color_field: {
          red: 255,
          green: 128,
          blue: 0,
          alpha: 255,
        },

        // Date and DateTime fields
        date_field: '2023-12-25',
        datetime_field: '2023-12-25T10:30:00Z',

        // File field
        file_field: {
          upload_id: 'P4qKpnFfTR6Tc96-NwceLQ',
          alt: 'Sample image alt text',
          title: 'Sample image title',
          custom_data: {
            photographer: 'John Doe',
            location: 'Paris',
          },
          focal_point: {
            x: 0.5,
            y: 0.3,
          },
        },

        // Gallery field
        gallery_field: [
          {
            upload_id: 'RvLIJ-z0T32S2hd71zBxnQ',
            alt: 'First gallery image',
            title: 'Gallery Image 1',
            custom_data: {},
            focal_point: null,
          },
          {
            upload_id: 'a0QsFvzMQKCH1h-axboXKQ',
            alt: null,
            title: 'Gallery Image 2',
            custom_data: {
              category: 'landscape',
            },
            focal_point: {
              x: 0.7,
              y: 0.4,
            },
          },
        ],

        // JSON field
        json_field: JSON.stringify({
          nested: {
            data: 'value',
            number: 123,
            array: [1, 2, 3],
          },
        }),

        // Lat/Lon field
        lat_lon_field: {
          latitude: 48.8566,
          longitude: 2.3522,
        },

        // Link field
        link_field: 'FicV5CxCSQ6yOrgfwRoiKA',

        // Links field
        links_field: ['NVPfHLHQQZe_rDi4_e6M2w', 'VY3VzQFUS9C1ITDkG48Sgw'],

        // Slug field
        slug_field: 'sample-slug-value',

        // SEO field
        seo_field: {
          title: 'SEO Title',
          description: 'SEO Description for better search engine optimization',
          image: null,
          no_index: false,
          twitter_card: null,
        },

        // Video field
        video_field: {
          provider: 'youtube',
          provider_uid: 'dQw4w9WgXcQ',
          url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          title: 'Sample Video Title',
          thumbnail_url:
            'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
          width: 1920,
          height: 1080,
        },

        structured_text: {
          schema: 'dast',
          document: {
            type: 'root',
            children: [
              {
                type: 'heading',
                level: 1,
                children: [{ type: 'span', value: 'Main Title' }],
              },
              {
                type: 'paragraph',
                children: [
                  { type: 'span', value: 'This is a ' },
                  { type: 'span', marks: ['strong'], value: 'bold' },
                  { type: 'span', value: ' paragraph.' },
                ],
              },
              {
                type: 'list',
                style: 'bulleted',
                children: [
                  {
                    type: 'listItem',
                    children: [
                      {
                        type: 'paragraph',
                        children: [{ type: 'span', value: 'First item' }],
                      },
                    ],
                  },
                  {
                    type: 'listItem',
                    children: [
                      {
                        type: 'paragraph',
                        children: [{ type: 'span', value: 'Second item' }],
                      },
                    ],
                  },
                ],
              },
              {
                type: 'block',
                item: 'block-123',
              },
              {
                type: 'block',
                item: buildBlockRecord<Block>({
                  item_type: {
                    type: 'item_type',
                    id: 'NOYldjT6TtKXXjZ8efU-dw',
                  },
                  title: 'Foobar',
                }),
              },
              {
                type: 'code',
                language: 'javascript',
                code: 'console.log("hello");',
              },
            ],
          },
        },

        single_block: buildBlockRecord<Block>({
          item_type: {
            type: 'item_type',
            id: 'NOYldjT6TtKXXjZ8efU-dw',
          },
          title: 'Foobar',
        }),

        rich_text: [
          'RjJIdPrFSwuxSBQQySDjxw',
          buildBlockRecord<Block>({
            item_type: {
              type: 'item_type',
              id: 'NOYldjT6TtKXXjZ8efU-dw',
            },
            title: 'Foobar',
          }),
        ],

        // Null values
        null_string: null,
        null_file: null,
        empty_gallery: [],
        null_link: null,
        empty_links: [],
      },
    };

    const output = inspectItem(item, 80);

    expect(output).toMatchSnapshot();
  });

  it('RawApiTypes.Item', () => {
    const item: ApiTypes.ItemCreateSchema<
      ToItemDefinitionAsRequest<ComprehensiveModel>
    > = {
      __itemTypeId: 'O9BXqTayQ_Wf-Yw6d863LQ',
      single_block: buildBlockRecord<Block>({
        item_type: {
          type: 'item_type',
          id: 'NOYldjT6TtKXXjZ8efU-dw',
        },
        title: 'Foobar',
      }),
      lat_lon_field: {
        latitude: 48.8566,
        longitude: 2.3522,
      },
      item_type: { type: 'item_type', id: 'O9BXqTayQ_Wf-Yw6d863LQ' },
    };

    const output = inspectItem(item, 80);

    expect(output).toMatchSnapshot();
  });

  it('inspects localized fields', () => {
    const item: RawApiTypes.Item<ToItemDefinitionAsRequest<LocalizedModel>> = {
      type: 'item',
      id: 'localizedTestId',
      relationships: {
        item_type: {
          data: {
            type: 'item_type',
            id: 'O9BXqTayQ_Wf-Yw6d863LQ',
          },
        },
      },
      meta: {
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        published_at: null,
        first_published_at: null,
        publication_scheduled_at: null,
        unpublishing_scheduled_at: null,
        is_valid: true,
        is_current_version_valid: true,
        is_published_version_valid: false,
        stage: 'draft',
        current_version: '1',
        status: 'draft',
        has_children: false,
      },
      attributes: {
        // Localized string field
        string_field: {
          en: 'Hello World',
          it: 'Ciao Mondo',
          fr: 'Bonjour le Monde',
        },

        // Localized text field
        text_field: {
          en: 'This is a long text in English',
          it: 'Questo è un testo lungo in italiano',
        },

        // Localized integer field
        integer_field: {
          en: 42,
          it: 24,
        },

        // Localized file field
        file_field: {
          en: {
            upload_id: 'english-file-id',
            alt: 'English alt text',
            title: 'English file title',
            custom_data: {},
            focal_point: null,
          },
          it: {
            upload_id: 'italian-file-id',
            alt: 'Testo alternativo italiano',
            title: 'Titolo file italiano',
            custom_data: { locale: 'it' },
            focal_point: { x: 0.6, y: 0.4 },
          },
        },

        // Localized structured text field
        structured_text: {
          en: {
            schema: 'dast',
            document: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'span', value: 'English content' }],
                },
              ],
            },
          },
          it: {
            schema: 'dast',
            document: {
              type: 'root',
              children: [
                {
                  type: 'paragraph',
                  children: [{ type: 'span', value: 'Contenuto italiano' }],
                },
              ],
            },
          },
        },

        // Non-localized field for comparison
        boolean_true: true,

        // Localized SEO field
        seo_field: {
          en: {
            title: 'English SEO Title',
            description: 'English SEO description',
            image: null,
            no_index: false,
            twitter_card: null,
          },
          it: {
            title: 'Titolo SEO Italiano',
            description: 'Descrizione SEO italiana',
            image: null,
            no_index: false,
            twitter_card: null,
          },
        },
      },
    };

    const output = inspectItem(item, 80);

    expect(output).toMatchSnapshot();
  });
});
