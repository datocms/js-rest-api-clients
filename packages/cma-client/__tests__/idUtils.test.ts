import { generateId, isValidId } from '../src/utilities/id';

describe('generateId', () => {
  it('expects an ID from generateId() to validate as a DatoCMS ID', () => {
    expect(isValidId(generateId())).toBe(true);
  });
});

describe('isValidId', () => {
  it('checks if passed string is a valid DatoCMS ID', () => {
    expect(isValidId('')).toBe(false);
    expect(isValidId('foobar')).toBe(false);
    expect(isValidId('WTyssHtyTzu9_EbszSVhPw')).toBe(true);
  });
});
