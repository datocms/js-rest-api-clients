// https://github.com/microsoft/TypeScript/issues/31153#issuecomment-1074283505

type NoIndex<T> = {
  [K in keyof T as {} extends Record<K, 1> ? never : K]: T[K];
};

// Inverse of NoIndex, meaning it only gets the index signature of a type, ignoring other well known props
type OnlyIndex<T> = {
  [K in keyof T as {} extends Record<K, 1> ? K : never]: T[K];
};

// Omit from NoIndex version of T, and then intersects with the indexed part of it
export type OmitFromKnownKeys<T, K extends keyof NoIndex<T>> = Omit<
  NoIndex<T>,
  K
> &
  OnlyIndex<T>;
