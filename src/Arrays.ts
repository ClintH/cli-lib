export const incrementThrough = <T>(source: Array<T>) => {
  let index = 0;
  return (): T => {
    if (index >= source.length) index = 0;
    return source[index++];
  }
}