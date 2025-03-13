/// <reference lib="dom" />

import { buildNormalizedParams } from './buildNormalizedParams';
import {
  ApiError,
  type ApiErrorInitObject,
  TimeoutError,
  type TimeoutErrorInitObject,
} from './errors';
import type { JobResult } from './internalTypes';
import {
  CanceledPromiseError,
  makeCancelablePromise,
} from './makeCancelablePromise';
import { wait } from './wait';

const isBrowser =
  typeof window !== 'undefined' && typeof window.document !== 'undefined';

const MAX_RETRY_COUNT_ON_TIMEOUT_ERROR = 5;

export enum LogLevel {
  /** No logging */
  NONE = 0,
  /** Logs HTTP requests (method, URL) and responses (status) */
  BASIC = 1,
  /** Logs HTTP requests (method, URL, body) and responses (status, body) */
  BODY = 2,
  /** Logs HTTP requests (method, URL, headers, body) and responses (status, headers, body) */
  BODY_AND_HEADERS = 3,
}

type Job = {
  type: 'job';
  id: string;
};

type JobResponse = {
  data: Job;
};

type RequestOptions = {
  baseUrl: string;
  fetchJobResult: (jobId: string) => Promise<JobResult>;
  fetchFn?: typeof fetch;
  apiToken: string | null;
  extraHeaders?: Record<string, string>;
  logLevel?: LogLevel;
  autoRetry?: boolean;
  retryCount?: number;
  requestTimeout?: number;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  url: string;
  queryParams?: Record<string, unknown>;
  body?: unknown;
  preCallStack?: string;
  logFn?: (message: string) => void;
  userAgent?: string;
};

function headersToObject(headers: Headers): Record<string, string> {
  const result: Record<string, string> = {};

  headers.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

function buildApiErrorInitObject(
  method: string,
  url: string,
  requestHeaders: Record<string, string>,
  requestBody: unknown,
  response: Response,
  responseBody: unknown,
  preCallStack?: string,
): ApiErrorInitObject {
  return {
    request: {
      url,
      method,
      headers: requestHeaders,
      body: requestBody,
    },
    response: {
      status: response.status,
      statusText: response.statusText,
      headers: headersToObject(response.headers),
      body: responseBody,
    },
    preCallStack,
  };
}

function buildTimeoutErrorInitObject(
  method: string,
  url: string,
  requestHeaders: Record<string, string>,
  requestBody: unknown,
  preCallStack?: string,
): TimeoutErrorInitObject {
  return {
    request: {
      url,
      method,
      headers: requestHeaders,
      body: requestBody,
    },
    preCallStack,
  };
}

function buildApiErrorInitObjectFromJobResult(
  method: string,
  url: string,
  requestHeaders: Record<string, string>,
  requestBody: unknown,
  responseStatus: number,
  responseBody: unknown,
  preCallStack?: string,
): ApiErrorInitObject {
  return {
    request: {
      url,
      method,
      headers: requestHeaders,
      body: requestBody,
    },
    response: {
      status: responseStatus,
      statusText: 'N/A',
      headers: {},
      body: responseBody,
    },
    preCallStack,
  };
}

function isErrorWithCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && !!error && 'code' in error;
}

function lowercaseKeys(obj: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]),
  );
}

let requestCount = 1;

export function getFetchFn(customFetchFn?: typeof fetch) {
  const fetchFn =
    customFetchFn ||
    (typeof fetch === 'undefined' ? undefined : fetch) ||
    (typeof globalThis === 'undefined' ? undefined : globalThis.fetch);

  if (typeof fetchFn === 'undefined') {
    throw new Error(
      'fetch() is not available: either polyfill it globally, or provide it as fetchFn option.',
    );
  }

  return fetchFn;
}

export async function request<T>(options: RequestOptions): Promise<T> {
  const requestId = requestCount;
  requestCount += 1;

  const fetchFn = getFetchFn(options.fetchFn);

  const preCallStack = options.preCallStack;
  const userAgent = options.userAgent || '@datocms/rest-client-utils';
  const retryCount = options.retryCount || 1;
  const logLevel = options.logLevel || LogLevel.NONE;
  const autoRetry = 'autoRetry' in options ? options.autoRetry : true;
  const log = options.logFn || (() => true);

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
    authorization: `Bearer ${options.apiToken}`,
    'user-agent': userAgent,
    ...(options.extraHeaders ? lowercaseKeys(options.extraHeaders) : {}),
  };

  if (isBrowser) {
    // user agent cannot be set on browser
    delete headers['user-agent'];
  }

  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const body = options.body ? JSON.stringify(options.body, null, 2) : undefined;

  const queryString =
    options.queryParams && Object.keys(options.queryParams).length > 0
      ? `?${new URLSearchParams(
          buildNormalizedParams(options.queryParams),
        ).toString()}`
      : '';

  const url = `${baseUrl}${options.url}${queryString}`;

  if (logLevel >= LogLevel.BASIC) {
    log(`[${requestId}] ${options.method} ${url}`);
    if (logLevel >= LogLevel.BODY_AND_HEADERS) {
      for (const [key, value] of Object.entries(headers || {})) {
        log(`[${requestId}] ${key}: ${value}`);
      }
    }
    if (logLevel >= LogLevel.BODY && body) {
      log(`[${requestId}] ${body}`);
    }
  }

  try {
    const requestPromise = makeCancelablePromise(
      fetchFn(url, {
        method: options.method,
        headers,
        body,
      }),
    );

    const timeoutId = setTimeout(() => {
      requestPromise.cancel();
    }, options.requestTimeout || 30000);

    const response = await requestPromise;

    clearTimeout(timeoutId);

    const responseContentType = response.headers.get('Content-Type');
    const invalidContentType =
      responseContentType && !responseContentType.includes('application/json');

    if (response.status === 429 || invalidContentType) {
      if (!autoRetry || (invalidContentType && options.method !== 'GET')) {
        throw new ApiError(
          buildApiErrorInitObject(
            options.method,
            url,
            headers,
            options.body,
            response,
            undefined,
            preCallStack,
          ),
        );
      }

      const waitTimeInSecs = response.headers.has('X-RateLimit-Reset')
        ? Number.parseInt(response.headers.get('X-RateLimit-Reset')!, 10)
        : retryCount;

      if (logLevel >= LogLevel.BASIC) {
        if (response.status === 429) {
          log(
            `[${requestId}] Rate limit exceeded, wait ${waitTimeInSecs} seconds then retry...`,
          );
        } else {
          log(
            `[${requestId}] Invalid response content type "${responseContentType}" (status ${response.status}). Wait ${waitTimeInSecs} seconds then retry...`,
          );
        }
      }

      await wait(waitTimeInSecs * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    if (logLevel >= LogLevel.BASIC) {
      log(`[${requestId}] Status: ${response.status} (${response.statusText})`);
      if (logLevel >= LogLevel.BODY_AND_HEADERS) {
        for (const key of [
          'x-api-version',
          'x-environment',
          'x-queue-time',
          'x-ratelimit-remaining',
          'x-request-id',
          'cf-ray',
        ]) {
          const value = response.headers.get(key);
          if (value) {
            log(`[${requestId}] ${key}: ${value}`);
          }
        }
      }
    }

    let responseBody =
      response.status === 204 ? undefined : await response.json();

    if (logLevel >= LogLevel.BODY && responseBody) {
      log(`[${requestId}] ${JSON.stringify(responseBody, null, 2)}`);
    }

    if (response.status === 202) {
      const jobResult = await options.fetchJobResult(
        (responseBody as JobResponse).data.id,
      );

      if (jobResult.status < 200 || jobResult.status >= 300) {
        throw new ApiError(
          buildApiErrorInitObjectFromJobResult(
            options.method,
            url,
            headers,
            options.body,
            jobResult.status,
            jobResult.payload,
            preCallStack,
          ),
        );
      }

      responseBody = jobResult.payload;
    }

    if (response.status >= 200 && response.status < 300) {
      return responseBody as T;
    }

    const error = new ApiError(
      buildApiErrorInitObject(
        options.method,
        url,
        headers,
        options.body,
        response,
        responseBody,
        preCallStack,
      ),
    );

    const transientErrorCode = error.errors.find((e) => e.attributes.transient)
      ?.attributes.code;

    if (autoRetry && transientErrorCode) {
      if (logLevel >= LogLevel.BASIC) {
        log(
          `[${requestId}] ${transientErrorCode}, wait ${retryCount} seconds then retry...`,
        );
      }

      await wait(retryCount * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    throw error;
  } catch (error) {
    if (
      error instanceof CanceledPromiseError ||
      (isErrorWithCode(error) && error.code.includes('ETIMEDOUT'))
    ) {
      if (autoRetry && retryCount < MAX_RETRY_COUNT_ON_TIMEOUT_ERROR) {
        if (logLevel >= LogLevel.BASIC) {
          log(
            `[${requestId}] Timeout error, wait ${retryCount} seconds then retry...`,
          );
        }

        await wait(retryCount * 1000);

        return request({ ...options, retryCount: retryCount + 1 });
      }

      throw new TimeoutError(
        buildTimeoutErrorInitObject(
          options.method,
          url,
          headers,
          options.body,
          preCallStack,
        ),
      );
    }

    throw error;
  }
}
