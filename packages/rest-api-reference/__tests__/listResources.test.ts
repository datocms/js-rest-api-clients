import { listResources } from '../src/listResources';
import type {
  Hyperschema,
  HyperschemaEntity,
  ResourcesSchema,
} from '../src/types';

const hyperschema: Hyperschema = {
  groups: [
    { title: 'Content', resources: ['item', 'item_type'] },
    { title: 'Media', resources: ['upload'] },
  ],
  properties: {
    item: {
      title: 'Item',
      description: 'A content record.\nMore details here.',
    } as HyperschemaEntity,
    item_type: {
      title: 'Model',
      description: 'Defines the shape of items.',
    } as HyperschemaEntity,
    upload: {
      title: 'Upload',
      description: 'A media asset.',
    } as HyperschemaEntity,
  },
};

const resourcesSchema: ResourcesSchema = [
  {
    jsonApiType: 'item',
    namespace: 'items',
    resourceClassName: 'Item',
    endpoints: [],
  },
  {
    jsonApiType: 'item_type',
    namespace: 'itemTypes',
    resourceClassName: 'ItemType',
    endpoints: [],
  },
  {
    jsonApiType: 'upload',
    namespace: 'uploads',
    resourceClassName: 'Upload',
    endpoints: [],
  },
];

describe('listResources', () => {
  it('renders grouped resource listing', () => {
    const result = listResources(hyperschema, resourcesSchema);

    expect(result).toContain('# Available resources grouped by theme');
    expect(result).toContain('## Content');
    expect(result).toContain('## Media');
    expect(result).toContain('items');
    expect(result).toContain('itemTypes');
    expect(result).toContain('uploads');
  });

  it('includes only first line of description', () => {
    const result = listResources(hyperschema, resourcesSchema);
    expect(result).toContain('A content record.');
    expect(result).not.toContain('More details here.');
  });

  it('includes further documentation section', () => {
    const result = listResources(hyperschema, resourcesSchema);
    expect(result).toContain('# Further documentation');
    expect(result).toContain('`items`');
  });

  it('skips resources not found in either schema', () => {
    const partial: Hyperschema = {
      groups: [{ title: 'Test', resources: ['missing_type'] }],
    };

    const result = listResources(partial, []);
    expect(result).toContain('## Test');
    expect(result).not.toContain('missing_type');
  });
});
