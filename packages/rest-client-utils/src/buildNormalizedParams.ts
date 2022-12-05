function buildKey(path: string[]) {
  return path.reduce(
    (result, chunk, index) => (index === 0 ? chunk : `${result}[${chunk}]`),
    '',
  );
}

export function buildNormalizedParams(
  input: Record<string, unknown>,
  path: string[] = [],
): [string, string][] {
  const result: [string, string][] = [];

  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'number' || typeof value === 'string') {
      result.push([buildKey([...path, key]), value.toString()]);
    } else if (value === true) {
      result.push([buildKey([...path, key]), 'true']);
    } else if (value === false) {
      result.push([buildKey([...path, key]), 'false']);
    } else if (typeof value === 'object') {
      if (Array.isArray(value)) {
        for (const innerValue of value) {
          result.push([`${buildKey([...path, key])}[]`, innerValue.toString()]);
        }
      } else if (value) {
        for (const param of buildNormalizedParams(
          value as Record<string, unknown>,
          [...path, key],
        )) {
          result.push(param);
        }
      }
    }
  }

  return result;
}
