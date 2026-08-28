import {
  fromLocaleKeyed,
  isFieldKeyed,
  toLocaleKeyed,
} from '../src/utilities/defaultFieldMetadata';

describe('telling the two shapes apart', () => {
  it('reads a top-level focal_point as field-keyed', () => {
    expect(
      isFieldKeyed({
        alt: { en: 'An alt' },
        title: { en: null },
        custom_data: { en: {} },
        focal_point: null,
        poster_time: null,
      }),
    ).toBe(true);
  });

  it('reads locale entries as locale-keyed', () => {
    expect(
      isFieldKeyed({
        en: {
          alt: 'An alt',
          title: null,
          custom_data: {},
          focal_point: null,
          poster_time: null,
        },
      }),
    ).toBe(false);
  });

  it('is not fooled by a locale that looks like a field name', () => {
    // `alt` matches the API's language-code pattern, so a project could have a
    // locale called that; `focal_point` cannot, which is why it is the
    // discriminator and `alt` is not
    expect(
      isFieldKeyed({
        alt: {
          alt: 'An alt',
          title: null,
          custom_data: {},
          focal_point: null,
          poster_time: null,
        },
      }),
    ).toBe(false);
  });
});

describe('converting between the shapes', () => {
  it('round-trips a fully populated payload', () => {
    const fieldKeyed = {
      alt: { en: 'An alt', it: 'Un alt' },
      title: { en: 'A title', it: 'Un titolo' },
      custom_data: { en: {}, it: {} },
      focal_point: { x: 0.3, y: 0.6 },
      poster_time: 12.5,
    };

    expect(
      fromLocaleKeyed(toLocaleKeyed(fieldKeyed, ['en', 'it']) as never),
    ).toEqual(fieldKeyed);
  });

  it('survives an empty locale-keyed payload', () => {
    expect(fromLocaleKeyed({})).toEqual({
      alt: {},
      title: {},
      custom_data: {},
      focal_point: null,
      poster_time: null,
    });
  });
});
