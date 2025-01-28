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

export type TimeoutErrorInitObject = {
  request: ApiErrorRequest;
  preCallStack?: string;
};

export class TimeoutError extends Error {
  request: ApiErrorRequest;
  preCallStack?: string;

  constructor(initObject: TimeoutErrorInitObject) {
    super('API Error!');
    Object.setPrototypeOf(this, new.target.prototype);

    if ('captureStackTrace' in Error) {
      Error.captureStackTrace(this, ApiError);
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

  constructor(initObject: ApiErrorInitObject) {
    super('API Error!');
    Object.setPrototypeOf(this, new.target.prototype);

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
