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

export function serializeRequestBody<T extends { data: unknown } | null>(
  body: unknown,
  options: Options,
): T {
  if (typeof body !== 'object' || !body) {
    throw new Error('Invalid body!');
  }

  if (Array.isArray(body)) {
    return {
      data: body.map(
        (entity) => serializeRequestBody<T>(entity, options)?.data,
      ),
    } as unknown as T;
  }

  const { id, meta, ...otherProperties } = body as any;

  const attributes: Record<string, unknown> = {};
  const relationships: Record<string, unknown> = {};

  if (options.attributes === '*') {
    for (const [key, value] of Object.entries(otherProperties)) {
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
    }
  } else if (options.relationships === '*') {
    for (const [key, value] of Object.entries(otherProperties)) {
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
    }
  } else {
    for (const [key, value] of Object.entries(otherProperties)) {
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
    }
  }

  return {
    data: {
      ...(id || options.id ? { id: id || options.id } : {}),
      type: options.type, // If a body.type is passed in, it should go in data.attributes. Only options.type should be here at the root.
      ...(Object.keys(attributes).length > 0 ? { attributes } : {}),
      ...(Object.keys(relationships).length > 0 ? { relationships } : {}),
      ...(meta ? { meta } : {}),
    },
  } as unknown as T;
}
