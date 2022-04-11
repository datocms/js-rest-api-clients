type Options = {
  body: unknown;
  id?: string;
  type: string;
};

export type Rel = {
  id: string;
  type: string;
};

function isRel(object: unknown): object is Rel {
  return (
    typeof object === 'object' && !!object && 'id' in object && 'type' in object
  );
}

function isRelArray(object: unknown): object is Rel[] {
  return Array.isArray(object) && object.every(isRel);
}

export default function serializeRequestBody<T>(options: Options): T {
  if (typeof options.body !== 'object' || !options.body) {
    throw new Error('Invalid body!');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id, type, meta, ...otherProperties } = options.body as any;

  const attributes = {};
  const relationships = {};

  Object.entries(otherProperties).forEach(([key, value]) => {
    if (isRel(value)) {
      const { id, type } = value;
      relationships[key] = { data: { id, type } };
    } else if (isRelArray(value)) {
      relationships[key] = {
        data: value.map(({ id, type }) => ({ id, type })),
      };
    } else {
      attributes[key] = value;
    }
  });

  return {
    data: {
      ...(id || options.id ? { id: id || options.id } : {}),
      type: type || options.type,
      ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
      ...(Object.keys(relationships).length > 0 ? { relationships } : {}),
      ...(meta ? { meta } : {}),
    },
  } as unknown as T;
}
