const ARRAY_INDEX = '__ARRAY_INDEX__';

function buildKey(path: string[]) {
  return path.reduce(
    (result, chunk, index) =>
      index === 0
        ? chunk
        : chunk === ARRAY_INDEX
          ? `${result}[]`
          : `${result}[${chunk}]`,
    '',
  );
}

function serializeValue(value: unknown) {
  if (typeof value === 'number' || typeof value === 'string') {
    return value.toString();
  }

  if (value === true) {
    return 'true';
  }

  if (value === false) {
    return 'false';
  }

  throw `Don't know how to serialize param value ${JSON.stringify(value)}`;
}

export function buildNormalizedParams(
  value: unknown,
  path: string[] = [],
): [string, string][] {
  const result: [string, string][] = [];

  if (
    typeof value === 'number' ||
    typeof value === 'string' ||
    typeof value === 'boolean'
  ) {
    result.push([buildKey(path), serializeValue(value)]);
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) {
      for (const innerValue of value as unknown[]) {
        for (const param of buildNormalizedParams(innerValue, [
          ...path,
          ARRAY_INDEX,
        ])) {
          result.push(param);
        }
      }
    } else if (value) {
      for (const [key, innerValue] of Object.entries(value)) {
        for (const param of buildNormalizedParams(innerValue, [...path, key])) {
          result.push(param);
        }
      }
    }
  }

  return result;
}
