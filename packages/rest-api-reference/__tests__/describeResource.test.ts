import { describeResource } from '../src/describeResource';
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
      description:
        'Items are content records.\n\n<details><summary>Schema info</summary>\n\nFull schema here.\n</details>',
      links: [],
    } as HyperschemaEntity,
    upload: {
      title: 'Upload',
      links: [],
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
  {
    jsonApiType: 'upload',
    namespace: 'uploads',
    resourceClassName: 'Upload',
    endpoints: [],
  },
];

describe('describeResource', () => {
  it('returns undefined for unknown namespace', () => {
    expect(
      describeResource(hyperschema, resourcesSchema, 'unknown'),
    ).toBeUndefined();
  });

  it('returns undefined when hyperschema entity not found', () => {
    const noProps: Hyperschema = { groups: [] };
    expect(describeResource(noProps, resourcesSchema, 'items')).toBeUndefined();
  });

  it('renders resource description with available actions', () => {
    const result = describeResource(hyperschema, resourcesSchema, 'items');
    expect(result).toBeDefined();
    expect(result).toContain('Items are content records.');
    expect(result).toContain('# Available actions');
    expect(result).toContain('create');
    expect(result).toContain('Create a new item');
    expect(result).toContain('instances');
    expect(result).toContain('List all items');
  });

  it('collapses details blocks in the description', () => {
    const result = describeResource(hyperschema, resourcesSchema, 'items')!;
    expect(result).toContain(
      '<details><summary>Schema info</summary></details>',
    );
    expect(result).not.toContain('Full schema here.');
  });

  it('includes further documentation section', () => {
    const result = describeResource(hyperschema, resourcesSchema, 'items')!;
    expect(result).toContain('# Further documentation');
    expect(result).toContain('`items create`');
  });

  it('handles entity with no description', () => {
    const result = describeResource(hyperschema, resourcesSchema, 'uploads')!;
    expect(result).toContain('# Available actions');
  });

  describe('with expandDetails filter', () => {
    it('returns only matching expanded details', () => {
      const result = describeResource(hyperschema, resourcesSchema, 'items', [
        'Schema info',
      ]);
      expect(result).toContain('<details open>');
      expect(result).toContain('Full schema here.');
      expect(result).not.toContain('# Available actions');
    });

    it('returns empty string when nothing matches the filter', () => {
      const result = describeResource(hyperschema, resourcesSchema, 'items', [
        'Nonexistent',
      ]);
      expect(result).toBe('');
    });
  });
});
