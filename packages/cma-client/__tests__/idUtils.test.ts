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

  it('does not crash when given a URL', () => {
    expect(isValidId('https://example.com')).toBe(false);
    expect(isValidId('http://example.com/path?query=value')).toBe(false);
    expect(isValidId('www.example.com')).toBe(false);
  });

  it('does not crash with invalid base64 strings', () => {
    expect(isValidId('hello world')).toBe(false);
    expect(isValidId('!!!invalid!!!')).toBe(false);
    expect(isValidId('@#$%^&*()')).toBe(false);
  });
});
