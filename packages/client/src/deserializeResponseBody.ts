import { Rel } from './serializeRequestBody';

type JsonApiEntity = {
  id?: string;
  type?: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data: null | Rel | Rel[] }>;
  meta?: Record<string, unknown>;
};

type ResponseWithData = {
  data: JsonApiEntity | JsonApiEntity[];
};

function hasData(thing: unknown): thing is ResponseWithData {
  return typeof thing === 'object' && !!thing && 'data' in thing;
}

function deserializeJsonEntity({
  id,
  type,
  attributes,
  relationships,
  meta,
}: JsonApiEntity) {
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
  };
}

export default function deserializeRequestBody<T>(body: unknown): T {
  if (!hasData(body)) {
    throw new Error('Invalid body!');
  }

  if (Array.isArray(body.data)) {
    return body.data.map(deserializeJsonEntity) as unknown as T;
  }

  return deserializeJsonEntity(body.data) as unknown as T;
}
