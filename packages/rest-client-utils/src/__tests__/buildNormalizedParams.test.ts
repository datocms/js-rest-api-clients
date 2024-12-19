import { buildNormalizedParams } from "../buildNormalizedParams";

describe("buildNormalizedParams", () => {
  it("encodes complex params", async () => {
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
    expect(buildNormalizedParams({ foo: "" })).toMatchInlineSnapshot(`
      [
        [
          "foo",
          "",
        ],
      ]
    `);
    expect(buildNormalizedParams({ foo: null })).toMatchInlineSnapshot("[]");
    expect(buildNormalizedParams({ foo: undefined })).toMatchInlineSnapshot(
      "[]"
    );

    expect(buildNormalizedParams({ foo: "bàr" })).toMatchInlineSnapshot(`
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
      })
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
        filter: { fields: { md5: { eq: "foo" } } },
      })
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
        filter: {
          type: "product",
          fields: {
            id: { anyIn: ["a", "b", "c"] },
          },
        },
      })
    ).toMatchInlineSnapshot(`
      [
        [
          "filter[type]",
          "product",
        ],
        [
          "filter[fields][id][anyIn][0]",
          "a",
        ],
        [
          "filter[fields][id][anyIn][1]",
          "b",
        ],
        [
          "filter[fields][id][anyIn][2]",
          "c",
        ],
      ]
    `);

    expect(
      buildNormalizedParams({
        filter: {
          type: "product",
          fields: {
            OR: [
              {
                name: { matches: { pattern: "sistrall" } },
                id: { eq: "123456" },
              },
              { productNumber: { matches: { pattern: "AmOYpJwZ3h" } } },
            ],
          },
        },
      })
    ).toMatchInlineSnapshot(`
      [
        [
          "filter[type]",
          "product",
        ],
        [
          "filter[fields][OR][0][name][matches][pattern]",
          "sistrall",
        ],
        [
          "filter[fields][OR][0][id][eq]",
          "123456",
        ],
        [
          "filter[fields][OR][1][productNumber][matches][pattern]",
          "AmOYpJwZ3h",
        ],
      ]
    `);
  });
});
