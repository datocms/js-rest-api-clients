import { buildNormalizedParams } from '../buildNormalizedParams';

describe('URLQueryParams', () => {
  it('encodes complex params', async () => {
    expect(buildNormalizedParams({ foo: 0 })).toMatchInlineSnapshot(`
      Array [
        Array [
          "foo",
          "0",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: true })).toMatchInlineSnapshot(`
      Array [
        Array [
          "foo",
          "true",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: false })).toMatchInlineSnapshot(`
      Array [
        Array [
          "foo",
          "false",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: '' })).toMatchInlineSnapshot(`
      Array [
        Array [
          "foo",
          "",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: null })).toMatchInlineSnapshot(
      `Array []`,
    );
    expect(buildNormalizedParams({ foo: undefined })).toMatchInlineSnapshot(
      `Array []`,
    );

    expect(buildNormalizedParams({ foo: 'bàr' })).toMatchInlineSnapshot(`
      Array [
        Array [
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
      Array [
        Array [
          "page[offset]",
          "0",
        ],
        Array [
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
      Array [
        Array [
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
      Array [
        Array [
          "foo[bar][]",
          "a",
        ],
        Array [
          "foo[bar][]",
          "b",
        ],
        Array [
          "foo[bar][]",
          "10",
        ],
      ]
    `);
  });
});
