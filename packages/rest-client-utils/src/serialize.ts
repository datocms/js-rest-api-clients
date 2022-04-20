type Options =
  | {
      id?: string;
      type: string;
      attributes: '*';
      relationships: string[];
    }
  | {
      id?: string;
      type: string;
      attributes: string[];
      relationships: '*';
    }
  | {
      id?: string;
      type: string;
      attributes: string[];
      relationships: string[];
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

export function serializeRequestBody<T>(body: unknown, options: Options): T {
  if (typeof body !== 'object' || !body) {
    throw new Error('Invalid body!');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id, type, meta, ...otherProperties } = body as any;

  const attributes = {};
  const relationships = {};

  if (options.attributes === '*') {
    Object.entries(otherProperties).forEach(([key, value]) => {
      if (options.relationships.includes(key)) {
        if (isRel(value)) {
          const { id, type } = value;
          relationships[key] = { data: { id, type } };
        } else if (isRelArray(value)) {
          relationships[key] = {
            data: value.map(({ id, type }) => ({ id, type })),
          };
        } else {
          relationships[key] = {
            data: null,
          };
        }
      } else {
        attributes[key] = value;
      }
    });
  } else if (options.relationships === '*') {
    Object.entries(otherProperties).forEach(([key, value]) => {
      if (options.attributes.includes(key)) {
        attributes[key] = value;
      } else {
        if (isRel(value)) {
          const { id, type } = value;
          relationships[key] = { data: { id, type } };
        } else if (isRelArray(value)) {
          relationships[key] = {
            data: value.map(({ id, type }) => ({ id, type })),
          };
        } else {
          relationships[key] = {
            data: null,
          };
        }
      }
    });
  } else {
    Object.entries(otherProperties).forEach(([key, value]) => {
      if (options.attributes.includes(key)) {
        attributes[key] = value;
      } else if (options.relationships.includes(key)) {
        if (isRel(value)) {
          const { id, type } = value;
          relationships[key] = { data: { id, type } };
        } else if (isRelArray(value)) {
          relationships[key] = {
            data: value.map(({ id, type }) => ({ id, type })),
          };
        } else {
          relationships[key] = {
            data: null,
          };
        }
      }
    });
  }

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
