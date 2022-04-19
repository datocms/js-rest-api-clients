import Bottleneck from 'bottleneck';

export type IteratorOptions = {
  perPage?: number;
  concurrency?: number;
};

type JsonApiPage<T> = {
  data: T[];
  meta: { total_count: number };
};

export async function* rawPageIterator<T>(
  callPerformer: (page: {
    limit: number;
    offset: number;
  }) => Promise<JsonApiPage<T>>,
  iteratorOptions?: IteratorOptions,
) {
  const perPage = iteratorOptions?.perPage || 100;
  const concurrency = iteratorOptions?.concurrency || 5;

  const firstResponse = await callPerformer({ limit: perPage, offset: 0 });

  for (const item of firstResponse.data) {
    yield item;
  }

  const totalCount = firstResponse.meta.total_count;

  const limiter = new Bottleneck({ maxConcurrent: concurrency });
  const promises: Promise<JsonApiPage<T>>[] = [];

  for (let offset = perPage; offset < totalCount; offset += perPage) {
    promises.push(
      limiter.schedule<JsonApiPage<T>>(() =>
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
