import { fetchHyperschema } from '../src/fetchHyperschema';

// Mock fetch and $RefParser
const mockFetch = jest.fn();
global.fetch = mockFetch;

jest.mock('@apidevtools/json-schema-ref-parser', () => ({
  __esModule: true,
  default: {
    dereference: jest.fn((raw: unknown) => Promise.resolve(raw)),
  },
}));

const fakeSchema = {
  groups: [{ title: 'Content', resources: ['item'] }],
  properties: { item: { title: 'Item' } },
};

const okResponse = {
  ok: true,
  json: () => Promise.resolve(fakeSchema),
};

describe('fetchHyperschema', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches and dereferences a hyperschema from a full URL', async () => {
    mockFetch.mockResolvedValue(okResponse);

    const result = await fetchHyperschema('https://example.com/schema.json');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://example.com/schema.json',
    );
    expect(result).toEqual(fakeSchema);
  });

  it('resolves "cma" to the site-api hyperschema URL', async () => {
    mockFetch.mockResolvedValue(okResponse);

    await fetchHyperschema('cma');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://site-api.datocms.com/docs/site-api-hyperschema.json',
    );
  });

  it('resolves "dashboard" to the account-api hyperschema URL', async () => {
    mockFetch.mockResolvedValue(okResponse);

    await fetchHyperschema('dashboard');

    expect(mockFetch).toHaveBeenCalledWith(
      'https://site-api.datocms.com/docs/account-api-hyperschema.json',
    );
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    await expect(
      fetchHyperschema('https://example.com/missing.json'),
    ).rejects.toThrow('Failed to fetch hyperschema');
  });
});
