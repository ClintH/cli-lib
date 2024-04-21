export const incrementThrough = <T>(source: ReadonlyArray<T>) => {
  let index = 0;
  return (): T => {
    if (index >= source.length) index = 0;
    return source[ index++ ];
  }
}