export function toId(thing: string | { id: string }): string {
  return typeof thing === 'string' ? thing : thing.id;
}
