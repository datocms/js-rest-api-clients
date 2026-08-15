import { ApiError, TimeoutError } from '../errors';
import { CanceledPromiseError } from '../makeCancelablePromise';

function buildApiError() {
  return new ApiError({
    request: {
      url: '/items/bad-id',
      method: 'GET',
      headers: {},
      body: undefined,
    },
    response: {
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      body: {
        data: [
          {
            id: '1',
            type: 'api_error' as const,
            attributes: {
              code: 'INVALID_FIELD',
              doc_url: 'https://www.datocms.com/docs',
              details: { field: 'item_id' },
            },
          },
        ],
      },
    },
  });
}

function buildTimeoutError() {
  return new TimeoutError({
    request: { url: '/items', method: 'GET', headers: {}, body: undefined },
  });
}

describe('ApiError', () => {
  it('keeps a correct prototype chain and name', () => {
    const error = buildApiError();

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('ApiError');
    expect(error.constructor.name).toBe('ApiError');
  });

  it('exposes request, response and parsed errors', () => {
    const error = buildApiError();

    expect(error.response.status).toBe(422);
    expect(error.request.url).toBe('/items/bad-id');
    expect(error.errors).toHaveLength(1);
    expect(error.findError('INVALID_FIELD')).toBeTruthy();
  });

  // These packages ship parallel CJS and ESM builds, so a bundler can load two
  // distinct copies of this module. `instanceof` must still work for an error
  // produced by the other copy.
  it('recognizes an instance coming from a duplicate copy of the module', () => {
    const fromOtherCopy = Object.assign(new Error('API Error!'), {
      name: 'ApiError',
      [Symbol.for('@datocms/rest-client-utils:ApiError')]: true,
    });

    expect(fromOtherCopy).toBeInstanceOf(ApiError);
  });

  it('does not recognize unrelated values', () => {
    expect(new Error('nope')).not.toBeInstanceOf(ApiError);
    expect({}).not.toBeInstanceOf(ApiError);
    expect(null).not.toBeInstanceOf(ApiError);
    expect(buildTimeoutError()).not.toBeInstanceOf(ApiError);
    // merely borrowing the name is not enough
    expect(
      Object.assign(new Error('impostor'), { name: 'ApiError' }),
    ).not.toBeInstanceOf(ApiError);
  });

  it('keeps subclass checks exact', () => {
    class SubclassedApiError extends ApiError {}

    const parent = buildApiError();
    const child = new SubclassedApiError({
      request: { url: '/items', method: 'GET', headers: {}, body: undefined },
      response: { status: 500, statusText: 'Error', headers: {}, body: {} },
    });

    expect(child).toBeInstanceOf(SubclassedApiError);
    expect(child).toBeInstanceOf(ApiError);
    expect(parent).not.toBeInstanceOf(SubclassedApiError);
  });
});

describe('TimeoutError', () => {
  it('keeps a correct prototype chain and name', () => {
    const error = buildTimeoutError();

    expect(error).toBeInstanceOf(TimeoutError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('TimeoutError');
  });

  it('recognizes an instance coming from a duplicate copy of the module', () => {
    const fromOtherCopy = Object.assign(new Error('API Error!'), {
      name: 'TimeoutError',
      [Symbol.for('@datocms/rest-client-utils:TimeoutError')]: true,
    });

    expect(fromOtherCopy).toBeInstanceOf(TimeoutError);
  });

  it('is not confused with an ApiError', () => {
    expect(buildApiError()).not.toBeInstanceOf(TimeoutError);
  });
});

describe('CanceledPromiseError', () => {
  it('keeps a correct prototype chain and name', () => {
    const error = new CanceledPromiseError();

    expect(error).toBeInstanceOf(CanceledPromiseError);
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('CanceledPromiseError');
  });

  it('recognizes an instance coming from a duplicate copy of the module', () => {
    const fromOtherCopy = Object.assign(new Error('Promise canceled!'), {
      name: 'CanceledPromiseError',
      [Symbol.for('@datocms/rest-client-utils:CanceledPromiseError')]: true,
    });

    expect(fromOtherCopy).toBeInstanceOf(CanceledPromiseError);
  });

  it('is not confused with other error types', () => {
    expect(buildApiError()).not.toBeInstanceOf(CanceledPromiseError);
    expect(new Error('nope')).not.toBeInstanceOf(CanceledPromiseError);
  });
});
