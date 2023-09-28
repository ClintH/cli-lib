export const remainder = (v: number, divider: number): [ value: number, remainder: number ] => {
  const x = Math.floor(v / divider);
  const y = v % (x * divider);
  return [ x, y ];
}

export const numberToString = (value: number, fixed = -1) => {
  return (fixed > -1)
    ? (fixed === 0
      ? Math.round(value)
      : value.toFixed(fixed))
    : value.toString();
}

export const singleOrPlural = (value: number, single: string, plural: string, fixed = -1) => {
  const valueAsString = numberToString(value, fixed);
  if (value === 1) return valueAsString + single;
  return valueAsString + plural;
}