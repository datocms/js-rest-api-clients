import { Rel } from './serialize';

type JsonApiEntity = {
  id?: string;
  type?: string;
  attributes?: object;
  relationships?: object;
  meta?: object;
};

type ResponseWithData = {
  data: JsonApiEntity | JsonApiEntity[];
};

function hasData(thing: unknown): thing is ResponseWithData {
  return typeof thing === 'object' && !!thing && 'data' in thing;
}

export function deserializeJsonEntity<S>({
  id,
  type,
  attributes,
  relationships,
  meta,
}: JsonApiEntity): S {
  return {
    ...(id ? { id } : {}),
    ...(type ? { type } : {}),
    ...(attributes || {}),
    ...(relationships
      ? Object.fromEntries(
          Object.entries(relationships).map(([rel, value]) => [
            rel,
            value?.data,
          ]),
        )
      : {}),
    ...(meta ? { meta } : {}),
  } as S;
}

export function deserializeResponseBody<T>(body: unknown): T {
  if (!hasData(body)) {
    throw new Error('Invalid body!');
  }

  if (Array.isArray(body.data)) {
    return body.data.map(deserializeJsonEntity) as unknown as T;
  }

  return deserializeJsonEntity(body.data) as unknown as T;
}
