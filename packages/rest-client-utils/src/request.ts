import qs from 'qs';
import fetch from 'cross-fetch';
import { ApiError, ApiErrorInitObject } from './ApiError';
import { JobResult } from './internalTypes';

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

type RequestOptions = {
  baseUrl: string;
  fetchJobResult: (jobId: string) => Promise<JobResult>;
  apiToken: string | null;
  extraHeaders?: Record<string, string>;
  logLevel?: LogLevel;
  autoRetry?: boolean;
  retryCount?: number;
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  url: string;
  queryParams?: Record<string, unknown>;
  body?: unknown;
  preCallStack?: string;
  logFn?: (message: string) => void;
  userAgent?: string;
};

function headersToObject(headers: Headers): Record<string, string> {
  const result = {};

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

function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function isErrorWithCode(error: unknown): error is { code: string } {
  return typeof error === 'object' && !!error && 'code' in error;
}

let requestCount = 1;

export async function request<T>(options: RequestOptions): Promise<T> {
  const requestId = requestCount;
  requestCount += 1;

  const preCallStack = options.preCallStack;
  const userAgent = options.userAgent || `@datocms/rest-client-utils`;
  const retryCount = options.retryCount || 1;
  const logLevel = options.logLevel || LogLevel.NONE;
  const autoRetry = 'autoRetry' in options ? options.autoRetry : true;
  const log = options.logFn || (() => true);

  const headers = {
    'content-type': 'application/json',
    accept: 'application/json',
    authorization: `Bearer ${options.apiToken}`,
    'user-agent': userAgent,
    ...(options.extraHeaders || {}),
  };

  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const body = options.body ? JSON.stringify(options.body, null, 2) : undefined;

  const queryString =
    options.queryParams && Object.keys(options.queryParams).length > 0
      ? `?${qs.stringify(options.queryParams, { arrayFormat: 'brackets' })}`
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
    const response = await fetch(url, {
      method: options.method,
      headers,
      body,
    });

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
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          parseInt(response.headers.get('X-RateLimit-Reset')!, 10)
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
        [
          'x-api-version',
          'x-environment',
          'x-queue-time',
          'x-ratelimit-remaining',
          'x-request-id',
        ].forEach((key) => {
          const value = response.headers.get(key);
          if (value) {
            log(`[${requestId}] ${key}: ${value}`);
          }
        });
      }
    }

    let responseBody =
      response.status === 204 ? undefined : await response.json();

    if (logLevel >= LogLevel.BODY && responseBody) {
      log(`[${requestId}] ${JSON.stringify(responseBody, null, 2)}`);
    }

    if (response.status === 202) {
      const jobResult = await options.fetchJobResult(responseBody.data.id);

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
      return responseBody;
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

    if (autoRetry && error.findError('BATCH_DATA_VALIDATION_IN_PROGRESS')) {
      if (logLevel >= LogLevel.BASIC) {
        log(
          `[${requestId}] Data validation in progress, wait ${retryCount} seconds then retry...`,
        );
      }

      await wait(retryCount * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    throw error;
  } catch (error) {
    if (isErrorWithCode(error) && error.code.includes('ETIMEDOUT')) {
      if (logLevel >= LogLevel.BASIC) {
        log(
          `[${requestId}] Error ${error.code}, wait ${retryCount} seconds then retry...`,
        );
      }

      await wait(retryCount * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    throw error;
  }
}
