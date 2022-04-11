import qs from 'qs';
import fetch from 'cross-fetch';
import pkg from '../package.json';
import { ApiError, ApiErrorInitObject } from './ApiError';
import { JobResult } from './cma/SchemaTypes';

export type RequestOptions = {
  method: 'GET' | 'PUT' | 'POST' | 'DELETE';
  url: string;
  queryParams?: Record<string, unknown>;
  body?: unknown;
  preCallStack?: string;
};

export enum LogLevel {
  NONE = 0,
  INFO = 1,
  DEBUG = 2,
  TRACE = 3,
}

export type ClientConfigOptions = {
  apiToken: string | null;
  baseUrl?: string;
  environment?: string;
  extraHeaders?: Record<string, string>;
  logLevel?: LogLevel;
  autoRetry?: boolean;
};

type InnerOptions = {
  retryCount?: number;
};

type CompleteRequestOptions = ClientConfigOptions &
  RequestOptions &
  InnerOptions & {
    baseUrl: string;
    fetchJobResult: (jobId: string) => Promise<JobResult>;
  };

function headersToObject(headers: Headers): Record<string, string> {
  const result = {};

  for (const pair of headers.entries()) {
    result[pair[0]] = pair[1];
  }

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

export default async function request<T>(
  options: CompleteRequestOptions,
): Promise<T> {
  const requestId = requestCount;
  requestCount += 1;

  const preCallStack = options.preCallStack;
  const retryCount = options.retryCount || 1;
  const logLevel = options.logLevel || LogLevel.NONE;
  const autoRetry = 'autoRetry' in options ? options.autoRetry : true;

  const headers = {
    'content-type': 'application/json',
    accept: 'application/json',
    authorization: `Bearer ${options.apiToken}`,
    'user-agent': `@datocms/client v${pkg.version}`,
    'X-Api-Version': '3',
    ...(options.extraHeaders || {}),
  };

  const baseUrl = options.baseUrl.replace(/\/$/, '');
  const body = options.body ? JSON.stringify(options.body, null, 2) : undefined;

  const queryString =
    options.queryParams && Object.keys(options.queryParams).length > 0
      ? `?${qs.stringify(options.queryParams, { arrayFormat: 'brackets' })}`
      : '';

  const url = `${baseUrl}${options.url}${queryString}`;

  if (logLevel) {
    console.log(`[${requestId}] ${options.method} ${url}`);
    if (logLevel >= 2) {
      for (const [key, value] of Object.entries(headers || {})) {
        console.log(`[${requestId}] ${key}: ${value}`);
      }
    }
    if (logLevel >= 3 && body) {
      console.log(`[${requestId}] ${body}`);
    }
  }

  try {
    const response = await fetch(url, {
      method: options.method,
      headers,
      body,
    });

    if (response.status === 429) {
      if (!autoRetry) {
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

      if (logLevel) {
        console.log(
          `[${requestId}] Rate limit exceeded, waiting ${waitTimeInSecs} seconds...`,
        );
      }

      await wait(waitTimeInSecs * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    if (logLevel) {
      console.log(
        `[${requestId}] Status: ${response.status} (${response.statusText})`,
      );
      if (logLevel >= 2) {
        [
          'content-type',
          'x-api-version',
          'x-environment',
          'x-queue-time',
          'x-ratelimit-remaining',
        ].forEach((key) => {
          const value = response.headers.get(key);
          if (value) {
            console.log(`[${requestId}] ${key}: ${value}`);
          }
        });
      }
    }

    let responseBody =
      response.status === 204 ? undefined : await response.json();

    if (logLevel >= 3 && responseBody) {
      console.log(`[${requestId}] ${JSON.stringify(responseBody, null, 2)}`);
    }

    if (response.status === 202) {
      const jobResult = await options.fetchJobResult(responseBody.data.id);

      if (
        jobResult.attributes.status < 200 ||
        jobResult.attributes.status >= 300
      ) {
        throw new ApiError(
          buildApiErrorInitObjectFromJobResult(
            options.method,
            url,
            headers,
            options.body,
            jobResult.attributes.status,
            jobResult.attributes.payload,
            preCallStack,
          ),
        );
      }

      responseBody = jobResult.attributes.payload;
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

    if (
      autoRetry &&
      error.findErrorWithCode('BATCH_DATA_VALIDATION_IN_PROGRESS')
    ) {
      if (logLevel) {
        console.log(
          `[${requestId}] Data validation in progress, waiting ${retryCount} seconds...`,
        );
      }

      await wait(retryCount * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    throw error;
  } catch (error) {
    if (isErrorWithCode(error) && error.code.includes('ETIMEDOUT')) {
      if (logLevel) {
        console.log(
          `[${requestId}] Error ${error.code}, waiting ${retryCount} seconds...`,
        );
      }

      await wait(retryCount * 1000);

      return request({ ...options, retryCount: retryCount + 1 });
    }

    throw error;
  }
}
