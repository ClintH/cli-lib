/**
 * Returns everything before `match` if found in `source`. If not found,
 * all of `source` is returned.
 * @param source 
 * @param match 
 */
export const beforeLastMatch = (source: string, match: string) => {
  const pos = source.lastIndexOf(match);
  if (pos < 0) return source;
  return source.slice(0, pos);
}

/**
 * Returns everything from `source` following the occurence
 * of `match`. `match` is itself included.
 * @param source 
 * @param match 
 * @returns 
 */
export const afterLastMatch = (source: string, match: string) => {
  const pos = source.lastIndexOf(match);
  if (pos < 0) return source;
  return source.slice(pos);

}