import { Scheduler } from 'async-scheduler';

export type IteratorOptions = {
  perPage?: number;
  concurrency?: number;
};

type PaginationOptions = {
  defaultLimit: number;
  maxLimit: number;
};

type JsonApiPage<T> = {
  data: T[];
  meta: { total_count: number };
};

export async function* rawPageIterator<T>(
  pagination: PaginationOptions,
  callPerformer: (page: {
    limit: number;
    offset: number;
  }) => Promise<JsonApiPage<T>>,
  iteratorOptions?: IteratorOptions,
) {
  const perPage = iteratorOptions?.perPage || pagination.defaultLimit;

  if (perPage > pagination.maxLimit) {
    throw new Error(
      `perPage option cannot exceed maximum value of ${pagination.maxLimit}`,
    );
  }

  const concurrency = iteratorOptions?.concurrency || 1;

  if (concurrency > 10) {
    throw new Error(`concurrency option cannot exceed maximum value of 10`);
  }

  const firstResponse = await callPerformer({ limit: perPage, offset: 0 });

  for (const item of firstResponse.data) {
    yield item;
  }

  const totalCount = firstResponse.meta.total_count;

  const limiter = new Scheduler(concurrency);
  const promises: Promise<JsonApiPage<T>>[] = [];

  for (let offset = perPage; offset < totalCount; offset += perPage) {
    promises.push(
      limiter.enqueue<JsonApiPage<T>, void>(() =>
        callPerformer({ limit: perPage, offset }),
      ),
    );
  }

  while (promises.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const response = await promises.shift()!;
    for (const item of response.data) {
      yield item;
    }
  }
}
