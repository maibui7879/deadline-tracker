export interface Entity<TId = string> {
  id: TId;
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export function filterAndSort<T>(
  items: readonly T[],
  predicate: (item: T) => boolean,
  compare?: (a: T, b: T) => number,
): T[] {
  const filtered = items.filter(predicate);
  return compare ? [...filtered].sort(compare) : filtered;
}

export function groupBy<T, K extends string | number>(
  items: readonly T[],
  getKey: (item: T) => K,
): Record<K, T[]> {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    (acc[key] ??= []).push(item);
    return acc;
  }, {} as Record<K, T[]>);
}
