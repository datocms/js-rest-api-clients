type JsonApiEntity = {
  id?: string;
  type?: string;
  attributes?: object;
  relationships?: object;
  meta?: object;
  __itemTypeId?: string;
};

type ResponseWithData = {
  data: JsonApiEntity | JsonApiEntity[];
};

type ResponseWithIncluded = {
  included: JsonApiEntity[];
};

function hasData(thing: unknown): thing is ResponseWithData {
  return typeof thing === 'object' && !!thing && 'data' in thing;
}

function hasIncluded(thing: unknown): thing is ResponseWithIncluded {
  return typeof thing === 'object' && !!thing && 'included' in thing;
}

export function deserializeJsonEntity<S>({
  __itemTypeId,
  id,
  type,
  attributes,
  relationships,
  meta,
}: JsonApiEntity): S {
  return {
    ...(__itemTypeId ? { __itemTypeId } : {}),
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

type ItemJsonEntity = {
  id?: string;
  type: 'item';
  attributes?: object;
  relationships: {
    item_type: {
      data: { id: string; type: 'item_type' };
    };
  };
  meta?: object;
};

function isItemEntity(entity: unknown): entity is ItemJsonEntity {
  return Boolean(
    entity &&
      typeof entity === 'object' &&
      'type' in entity &&
      entity.type === 'item',
  );
}

function processValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(processValue);
  }

  if (value && typeof value === 'object') {
    if (isItemEntity(value)) {
      return deserializeRawItem(value);
    }

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = processValue(val);
    }
    return result;
  }

  return value;
}

export function deserializeRawItem<S>(entity: S): S {
  if (!isItemEntity(entity)) {
    return entity;
  }

  const processedAttributes = entity.attributes
    ? processValue(entity.attributes)
    : entity.attributes;

  return {
    ...entity,
    attributes: processedAttributes,
    __itemTypeId: entity.relationships.item_type.data.id,
  } as S;
}

export function deserializeRawResponseBodyWithItems<T>(body: unknown): T {
  if (!hasData(body)) {
    throw new Error('Invalid body!');
  }

  let data: JsonApiEntity | JsonApiEntity[];
  if (Array.isArray(body.data)) {
    data = body.data.map(deserializeRawItem);
  } else {
    data = deserializeRawItem(body.data);
  }

  let included: JsonApiEntity[] | undefined;
  if (hasIncluded(body)) {
    included = body.included.map(deserializeRawItem);
  }

  return {
    ...body,
    data,
    ...(included ? { included } : {}),
  } as unknown as T;
}
