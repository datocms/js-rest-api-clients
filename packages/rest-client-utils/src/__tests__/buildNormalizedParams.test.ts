import { buildNormalizedParams } from '../buildNormalizedParams';

describe('buildNormalizedParams', () => {
  it('encodes complex params', async () => {
    expect(buildNormalizedParams({ foo: 0 })).toMatchInlineSnapshot(`
      [
        [
          "foo",
          "0",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: true })).toMatchInlineSnapshot(`
      [
        [
          "foo",
          "true",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: false })).toMatchInlineSnapshot(`
      [
        [
          "foo",
          "false",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: '' })).toMatchInlineSnapshot(`
      [
        [
          "foo",
          "",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: null })).toMatchInlineSnapshot('[]');
    expect(buildNormalizedParams({ foo: undefined })).toMatchInlineSnapshot(
      '[]',
    );

    expect(buildNormalizedParams({ foo: 'bàr' })).toMatchInlineSnapshot(`
      [
        [
          "foo",
          "bàr",
        ],
      ]
    `);

    expect(
      buildNormalizedParams({
        page: {
          offset: 0,
          limit: 10,
        },
      }),
    ).toMatchInlineSnapshot(`
      [
        [
          "page[offset]",
          "0",
        ],
        [
          "page[limit]",
          "10",
        ],
      ]
    `);

    expect(
      buildNormalizedParams({
        filter: { fields: { md5: { eq: 'foo' } } },
      }),
    ).toMatchInlineSnapshot(`
      [
        [
          "filter[fields][md5][eq]",
          "foo",
        ],
      ]
    `);

    expect(
      buildNormalizedParams({
        foo: { bar: ['a', 'b', 10] },
      }),
    ).toMatchInlineSnapshot(`
      [
        [
          "foo[bar][]",
          "a",
        ],
        [
          "foo[bar][]",
          "b",
        ],
        [
          "foo[bar][]",
          "10",
        ],
      ]
    `);
  });
});
