import { ApiError, TimeoutError } from '../errors';
import { request } from '../request';

const API_TOKEN = 'aaaabbbbccccdddd';

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    statusText: 'Unprocessable Entity',
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildOptions(fetchFn: typeof fetch) {
  return {
    baseUrl: 'https://site-api.datocms.com',
    fetchJobResult: async () => {
      throw new Error('not needed');
    },
    fetchFn,
    apiToken: API_TOKEN,
    method: 'GET' as const,
    url: '/items/bad-id',
    autoRetry: false,
  };
}

describe('request()', () => {
  it('sends the real API token, but keeps it out of the error', async () => {
    let sentAuthorization: string | undefined;

    const fetchFn = jest.fn(async (_url: unknown, init?: RequestInit) => {
      sentAuthorization = (init?.headers as Record<string, string>)
        ?.authorization;
      return jsonResponse(422, { data: [] });
    }) as unknown as typeof fetch;

    const error: ApiError = await request(buildOptions(fetchFn)).then(
      () => {
        throw new Error('expected the request to fail');
      },
      (error) => error,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect(sentAuthorization).toBe(`Bearer ${API_TOKEN}`);
    expect(error.request.headers.authorization).toBe(
      '[REDACTED, ending in dddd]',
    );
    expect(JSON.stringify(error)).not.toContain(API_TOKEN);
  });

  it('keeps the token out of a timeout error too', async () => {
    const fetchFn = (async () => {
      const error: NodeJS.ErrnoException = new Error('timeout');
      error.code = 'ETIMEDOUT';
      throw error;
    }) as unknown as typeof fetch;

    const error: TimeoutError = await request({
      ...buildOptions(fetchFn),
      autoRetry: false,
    }).then(
      () => {
        throw new Error('expected the request to fail');
      },
      (error) => error,
    );

    expect(error).toBeInstanceOf(TimeoutError);
    expect(error.request.headers.authorization).toBe(
      '[REDACTED, ending in dddd]',
    );
  });

  it('does not spill the failed call through incidental serialization', async () => {
    const fetchFn = (async () =>
      jsonResponse(422, {
        data: [],
      })) as unknown as typeof fetch;

    const error: ApiError = await request({
      ...buildOptions(fetchFn),
      body: {
        data: { attributes: { url: 'https://example.com/?token=s3cr3t' } },
      },
    }).then(
      () => {
        throw new Error('expected the request to fail');
      },
      (error) => error,
    );

    // `request` and `response` stay readable...
    expect(error.request.url).toContain('/items/bad-id');
    expect(error.response.status).toBe(422);

    // ...but no longer travel by accident: this is what `console.error()`,
    // `serialize-error` and most error trackers walk.
    expect(Object.keys(error)).not.toContain('request');
    expect(Object.keys(error)).not.toContain('response');
    expect(JSON.stringify(error)).not.toContain('s3cr3t');
    expect(JSON.stringify({ ...error })).not.toContain('s3cr3t');
  });
});
