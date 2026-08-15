export type ErrorEntity = {
  id: string;
  type: 'api_error';
  attributes: {
    code: string;
    transient?: true;
    doc_url: string;
    details: Record<string, unknown>;
  };
};
type ErrorBody = { data: ErrorEntity[] };

type FilterFn = (details: Record<string, unknown>) => boolean;

function isErrorBody(body: unknown): body is ErrorBody {
  if (typeof body !== 'object' || body === null || !('data' in body)) {
    return false;
  }

  const bodyWithData = body as { data: unknown };

  if (!Array.isArray(bodyWithData.data)) {
    return false;
  }

  const bodyWithDataList = bodyWithData as { data: unknown[] };

  if (bodyWithDataList.data.length === 0) {
    return false;
  }

  const firstEl = bodyWithDataList.data[0];

  if (
    typeof firstEl !== 'object' ||
    firstEl === null ||
    !('id' in firstEl) ||
    !('type' in firstEl) ||
    !('attributes' in firstEl) ||
    (firstEl as ErrorEntity).type !== 'api_error'
  ) {
    return false;
  }

  return true;
}

export type ApiErrorRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body?: unknown;
};

export type ApiErrorResponse = {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: unknown;
};

/**
 * Brands stamped on error instances.
 *
 * `Symbol.for()` looks up the cross-realm global symbol registry, so every copy
 * of this module — CJS or ESM, inlined by a bundler or not — resolves these to
 * the very same symbols. Since these packages ship parallel CJS and ESM builds
 * with no guarantee that a consumer ends up with a single copy, identity is
 * carried by these brands rather than by class identity alone, so `instanceof`
 * keeps working across duplicated copies.
 */
const TIMEOUT_ERROR = Symbol.for('@datocms/rest-client-utils:TimeoutError');
const API_ERROR = Symbol.for('@datocms/rest-client-utils:ApiError');

export type TimeoutErrorInitObject = {
  request: ApiErrorRequest;
  preCallStack?: string;
};

export class TimeoutError extends Error {
  request: ApiErrorRequest;
  preCallStack?: string;

  declare readonly [TIMEOUT_ERROR]: true;

  static [Symbol.hasInstance](value: unknown): value is TimeoutError {
    if (
      typeof value !== 'object' ||
      value === null ||
      !(TIMEOUT_ERROR in value)
    ) {
      return false;
    }

    // `this` is the constructor `instanceof` was invoked on: when it is a
    // subclass, defer to a real prototype-chain check so subclasses stay exact.
    // biome-ignore lint/complexity/noThisInStatic: dynamic `this` is required here; hardcoding the class would break subclass checks
    const invokedOn = this as unknown as { prototype: object };

    if (invokedOn !== TimeoutError) {
      return Object.prototype.isPrototypeOf.call(invokedOn.prototype, value);
    }

    return true;
  }

  constructor(initObject: TimeoutErrorInitObject) {
    super('API Error!');
    Object.setPrototypeOf(this, new.target.prototype);

    Object.defineProperty(this, TIMEOUT_ERROR, {
      value: true,
      enumerable: false,
      writable: false,
      configurable: false,
    });

    this.name = 'TimeoutError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, TimeoutError);
    } else {
      this.stack = new (Error as any)().stack;
    }

    this.request = initObject.request;
    this.preCallStack = initObject.preCallStack;

    this.message = `${initObject.request.method} ${initObject.request.url}: Timeout error`;

    if (this.preCallStack) {
      this.stack += `\nCaused By:\n${this.preCallStack}`;
    }
  }
}

export type ApiErrorInitObject = {
  request: ApiErrorRequest;
  response: ApiErrorResponse;
  preCallStack?: string;
};

export class ApiError extends Error {
  request: ApiErrorRequest;
  response: ApiErrorResponse;
  preCallStack?: string;

  declare readonly [API_ERROR]: true;

  static [Symbol.hasInstance](value: unknown): value is ApiError {
    if (typeof value !== 'object' || value === null || !(API_ERROR in value)) {
      return false;
    }

    // `this` is the constructor `instanceof` was invoked on: when it is a
    // subclass, defer to a real prototype-chain check so subclasses stay exact.
    // biome-ignore lint/complexity/noThisInStatic: dynamic `this` is required here; hardcoding the class would break subclass checks
    const invokedOn = this as unknown as { prototype: object };

    if (invokedOn !== ApiError) {
      return Object.prototype.isPrototypeOf.call(invokedOn.prototype, value);
    }

    return true;
  }

  constructor(initObject: ApiErrorInitObject) {
    super('API Error!');
    Object.setPrototypeOf(this, new.target.prototype);

    Object.defineProperty(this, API_ERROR, {
      value: true,
      enumerable: false,
      writable: false,
      configurable: false,
    });

    this.name = 'ApiError';

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ApiError);
    } else {
      this.stack = new (Error as any)().stack;
    }

    this.request = initObject.request;
    this.response = initObject.response;
    this.preCallStack = initObject.preCallStack;

    let message = `${initObject.request.method} ${initObject.request.url}: ${this.response.status} ${this.response.statusText}`;

    if (this.errors.length > 0) {
      message += `\n\n${JSON.stringify(this.errors, null, 2)}`;
    }

    this.message = message;

    if (this.preCallStack) {
      this.stack += `\nCaused By:\n${this.preCallStack}`;
    }
  }

  get errors() {
    if (!isErrorBody(this.response.body)) {
      return [];
    }

    return this.response.body.data;
  }

  findError(
    codeOrCodes: string | string[],
    filterDetails?: Record<string, string> | FilterFn,
  ) {
    const codes = Array.isArray(codeOrCodes) ? codeOrCodes : [codeOrCodes];
    return this.errors.find(
      (error) =>
        codes.includes(error.attributes.code) &&
        (!filterDetails ||
          (typeof filterDetails === 'function'
            ? filterDetails(error.attributes.details)
            : Object.entries(filterDetails).every(
                ([key, value]) => error.attributes.details[key] === value,
              ))),
    );
  }
}
