import { fetchHyperschema } from '../src/fetchHyperschema';
import {
  parseResourcesSchema,
  type RawResourcesSchema,
} from '../src/parseResourcesSchema';
import { listResources } from '../src/listResources';
import { describeResource } from '../src/describeResource';
import { describeResourceAction } from '../src/describeResourceAction';
import type { Hyperschema, ResourcesSchema } from '../src/types';

let hyperschema: Hyperschema;
let resourcesSchema: ResourcesSchema;

beforeAll(async () => {
  hyperschema = await fetchHyperschema('cma');

  const rawResources: RawResourcesSchema =
    require('../../cma-client/resources.json');
  resourcesSchema = parseResourcesSchema(rawResources);
});

describe('e2e: fetchHyperschema', () => {
  it('returns a schema with groups and properties', () => {
    expect(hyperschema.groups.length).toBeGreaterThan(0);
    expect(Object.keys(hyperschema.properties!).length).toBeGreaterThan(0);
  });

  it('each group references types that exist in properties', () => {
    for (const group of hyperschema.groups) {
      for (const type of group.resources) {
        expect(hyperschema.properties).toHaveProperty(type);
      }
    }
  });
});

describe('e2e: listResources', () => {
  it('produces a non-empty markdown listing with known resources', () => {
    const result = listResources(hyperschema, resourcesSchema);
    expect(result).toContain('# Available resources grouped by theme');
    expect(result).toContain('items');
    expect(result).toContain('uploads');
    expect(result).toContain('# Further documentation');
  });
});

describe('e2e: describeResource', () => {
  it('describes the "items" resource with its actions', () => {
    const result = describeResource(hyperschema, resourcesSchema, 'items');
    expect(result).toBeDefined();
    expect(result).toContain('# Available actions');
    expect(result).toContain('create');
    expect(result).toContain('instances');
  });

  it('returns undefined for a nonexistent resource', () => {
    expect(
      describeResource(hyperschema, resourcesSchema, 'nonexistent'),
    ).toBeUndefined();
  });
});

describe('e2e: describeResourceAction', () => {
  it('describes items.create with HTTP info and examples', () => {
    const result = describeResourceAction(
      hyperschema,
      resourcesSchema,
      'items',
      'create',
    );
    expect(result).toBeDefined();
    expect(result).toContain('# Action: items.create');
    expect(result).toContain('HTTP POST');
  });

  it('returns undefined for a nonexistent action', () => {
    expect(
      describeResourceAction(
        hyperschema,
        resourcesSchema,
        'items',
        'nonexistent',
      ),
    ).toBeUndefined();
  });
});
