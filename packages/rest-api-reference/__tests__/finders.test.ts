import {
  findHyperschemaEntity,
  findHyperschemaLink,
  findResourcesEndpointByRel,
  findResourcesEntityByJsonApiType,
  findResourcesEntityByNamespace,
} from '../src/finders';
import type {
  Hyperschema,
  HyperschemaEntity,
  ResourcesEntity,
  ResourcesSchema,
} from '../src/types';

const hyperschema: Hyperschema = {
  groups: [],
  properties: {
    item: {
      title: 'Item',
      links: [
        { rel: 'create', title: 'Create', href: '/items', method: 'POST' },
        { rel: 'instances', title: 'List', href: '/items', method: 'GET' },
      ],
    } as HyperschemaEntity,
    upload: {
      title: 'Upload',
      links: [
        { rel: 'self', title: 'Get', href: '/uploads/:id', method: 'GET' },
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
    ],
  },
  {
    jsonApiType: 'upload',
    namespace: 'uploads',
    resourceClassName: 'Upload',
    endpoints: [],
  },
];

describe('findHyperschemaEntity', () => {
  it('finds an entity by jsonApiType', () => {
    const entity = findHyperschemaEntity(hyperschema, 'item');
    expect(entity?.title).toBe('Item');
  });

  it('returns undefined for unknown type', () => {
    expect(findHyperschemaEntity(hyperschema, 'unknown')).toBeUndefined();
  });

  it('returns undefined when properties is missing', () => {
    const empty: Hyperschema = { groups: [] };
    expect(findHyperschemaEntity(empty, 'item')).toBeUndefined();
  });
});

describe('findHyperschemaLink', () => {
  it('finds a link by type and rel', () => {
    const link = findHyperschemaLink(hyperschema, 'item', 'create');
    expect(link?.method).toBe('POST');
  });

  it('returns undefined for unknown rel', () => {
    expect(findHyperschemaLink(hyperschema, 'item', 'destroy')).toBeUndefined();
  });

  it('returns undefined for unknown type', () => {
    expect(
      findHyperschemaLink(hyperschema, 'unknown', 'create'),
    ).toBeUndefined();
  });
});

describe('findResourcesEntityByJsonApiType', () => {
  it('finds entity by jsonApiType', () => {
    expect(
      findResourcesEntityByJsonApiType(resourcesSchema, 'item')?.namespace,
    ).toBe('items');
  });

  it('returns undefined for unknown type', () => {
    expect(
      findResourcesEntityByJsonApiType(resourcesSchema, 'nope'),
    ).toBeUndefined();
  });
});

describe('findResourcesEntityByNamespace', () => {
  it('finds entity by namespace', () => {
    expect(
      findResourcesEntityByNamespace(resourcesSchema, 'uploads')?.jsonApiType,
    ).toBe('upload');
  });

  it('returns undefined for unknown namespace', () => {
    expect(
      findResourcesEntityByNamespace(resourcesSchema, 'nope'),
    ).toBeUndefined();
  });
});

describe('findResourcesEndpointByRel', () => {
  it('finds endpoint by rel', () => {
    const entity = resourcesSchema[0] as ResourcesEntity;
    expect(findResourcesEndpointByRel(entity, 'create')?.method).toBe('POST');
  });

  it('returns undefined for unknown rel', () => {
    const entity = resourcesSchema[0] as ResourcesEntity;
    expect(findResourcesEndpointByRel(entity, 'destroy')).toBeUndefined();
  });
});
