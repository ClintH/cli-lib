export const element = <V>(
  array: ArrayLike<V>,
): V => {
  return array[ Math.floor(Math.random() * array.length) ];
};

export const randomIndexWeightedSource = <V>(array: ArrayLike<V>, weightings: Array<number>, rand = Math.random) => {
  const precompute: Array<number> = [];
  let total = 0;
  for (const [ index, weighting ] of weightings.entries()) {
    total += weighting;
    precompute[ index ] = total;
  }
  const offFromOne = Math.abs(total - 1);
  if (offFromOne < 0.001) {
    precompute[ precompute.length - 1 ] = 1;
  } else {
    throw new Error(`Weightings should add up to 1. Got: ${ total }`);
  }

  return (): V => {
    const v = rand();
    for (const [ index, element_ ] of precompute.entries()) {
      if (v <= element_) return array[ index ];
    }
    throw new Error(`Bug: randomIndexWeightedSource could not select index`);
  }
}