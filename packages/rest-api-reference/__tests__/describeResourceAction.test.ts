import { describeResourceAction } from '../src/describeResourceAction';
import type {
  Hyperschema,
  HyperschemaEntity,
  ResourcesSchema,
} from '../src/types';

const hyperschema: Hyperschema = {
  groups: [],
  properties: {
    item: {
      title: 'Item',
      links: [
        {
          rel: 'create',
          title: 'Create item',
          description: 'Creates a new item record.',
          href: '/items',
          method: 'POST',
          documentation: {
            javascript: {
              examples: [
                {
                  id: 'basic',
                  title: 'Basic creation',
                  description: 'A basic example.',
                  request: { code: 'client.items.create({ itemType: "123" })' },
                },
              ],
            },
          },
        },
        {
          rel: 'instances',
          title: 'List items',
          href: '/items',
          method: 'GET',
        },
      ],
    } as HyperschemaEntity,
  },
};

const resourcesSchema: ResourcesSchema = [
  {
    jsonApiType: 'item',
    namespace: 'items',
    resourceClassName: 'Item',
    endpoints: [
      {
        rel: 'create',
        rawName: 'create',
        returnsCollection: false,
        urlTemplate: '/items',
        method: 'POST',
        comment: 'Create a new item',
        urlPlaceholders: [],
        simpleMethodAvailable: true,
        optionalRequestBody: false,
        jsonApiType: 'item',
        namespace: 'items',
        resourceClassName: 'Item',
      },
      {
        rel: 'instances',
        rawName: 'list',
        returnsCollection: true,
        urlTemplate: '/items',
        method: 'GET',
        comment: 'List all items',
        urlPlaceholders: [],
        simpleMethodAvailable: true,
        optionalRequestBody: false,
        jsonApiType: 'item',
        namespace: 'items',
        resourceClassName: 'Item',
      },
    ],
  },
];

describe('describeResourceAction', () => {
  it('returns undefined for unknown namespace', () => {
    expect(
      describeResourceAction(hyperschema, resourcesSchema, 'unknown', 'create'),
    ).toBeUndefined();
  });

  it('returns undefined for unknown rel', () => {
    expect(
      describeResourceAction(hyperschema, resourcesSchema, 'items', 'destroy'),
    ).toBeUndefined();
  });

  it('returns undefined when hyperschema link not found', () => {
    const noLinks: Hyperschema = {
      groups: [],
      properties: { item: { title: 'Item' } as HyperschemaEntity },
    };
    expect(
      describeResourceAction(noLinks, resourcesSchema, 'items', 'create'),
    ).toBeUndefined();
  });

  it('renders action description with header and HTTP info', () => {
    const result = describeResourceAction(
      hyperschema,
      resourcesSchema,
      'items',
      'create',
    )!;
    expect(result).toContain('Creates a new item record.');
    expect(result).toContain('# Action: items.create');
    expect(result).toContain('HTTP POST /items');
  });

  it('includes collapsed examples', () => {
    const result = describeResourceAction(
      hyperschema,
      resourcesSchema,
      'items',
      'create',
    )!;
    expect(result).toContain(
      '<details><summary>Example: Basic creation</summary></details>',
    );
  });

  it('handles action without description', () => {
    const result = describeResourceAction(
      hyperschema,
      resourcesSchema,
      'items',
      'instances',
    )!;
    expect(result).toContain('# Action: items.instances');
    expect(result).toContain('HTTP GET /items');
  });

  describe('with expandDetails filter', () => {
    it('returns only expanded matching examples', () => {
      const result = describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'create',
        ['Example: Basic creation'],
      )!;
      expect(result).toContain('<details open>');
      expect(result).toContain('client.items.create');
      expect(result).not.toContain('# Action:');
    });

    it('returns empty string when no examples match', () => {
      const result = describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'create',
        ['Example: Nonexistent'],
      );
      expect(result).toBe('');
    });
  });

  describe("with '*' wildcard", () => {
    it('returns the full output with all details expanded', () => {
      const result = describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'create',
        ['*'],
      )!;
      expect(result).toContain('# Action: items.create');
      expect(result).toContain('HTTP POST /items');
      expect(result).toContain('<details open>');
      expect(result).toContain('client.items.create');
    });
  });

  describe('with autoExpandIfBelow', () => {
    it('expands all details when output is below threshold', () => {
      const result = describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'create',
        undefined,
        10_000,
      )!;
      expect(result).toContain('<details open>');
      expect(result).toContain('client.items.create');
      expect(result).toContain('# Action: items.create');
    });

    it('keeps details collapsed when output exceeds threshold', () => {
      const result = describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'create',
        undefined,
        5,
      )!;
      expect(result).not.toContain('<details open>');
      expect(result).toContain(
        '<details><summary>Example: Basic creation</summary></details>',
      );
    });

    it('is ignored when an explicit filter is active', () => {
      const result = describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'create',
        ['Example: Basic creation'],
        10_000,
      )!;
      expect(result).not.toContain('# Action: items.create');
    });
  });
});
