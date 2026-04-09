import {
  parseResourcesSchema,
  type RawResourcesSchema,
} from '../src/parseResourcesSchema';

describe('parseResourcesSchema', () => {
  it('enriches each endpoint with parent entity metadata', () => {
    const raw: RawResourcesSchema = [
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
          },
          {
            rel: 'instances',
            rawName: 'list',
            returnsCollection: true,
            urlTemplate: '/items',
            method: 'GET',
            comment: 'List items',
            urlPlaceholders: [],
            simpleMethodAvailable: true,
            optionalRequestBody: false,
          },
        ],
      },
    ];

    const result = parseResourcesSchema(raw);

    expect(result).toHaveLength(1);
    expect(result[0]!.jsonApiType).toBe('item');
    expect(result[0]!.namespace).toBe('items');
    expect(result[0]!.endpoints).toHaveLength(2);

    const endpoint = result[0]!.endpoints[0]!;
    expect(endpoint.rel).toBe('create');
    expect(endpoint.jsonApiType).toBe('item');
    expect(endpoint.namespace).toBe('items');
    expect(endpoint.resourceClassName).toBe('Item');
  });

  it('handles empty endpoints array', () => {
    const raw: RawResourcesSchema = [
      {
        jsonApiType: 'upload',
        namespace: 'uploads',
        resourceClassName: 'Upload',
        endpoints: [],
      },
    ];

    const result = parseResourcesSchema(raw);
    expect(result[0]!.endpoints).toEqual([]);
  });

  it('handles empty schema', () => {
    expect(parseResourcesSchema([])).toEqual([]);
  });
});
