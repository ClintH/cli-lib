import { numberToString, remainder, singleOrPlural } from "./Math.js";

export const humanElapsed = (value: number, detailed = false) => {
  if (value < 1000) {
    return singleOrPlural(value, `ms`, `ms`);
  }
  const seconds = remainder(value, 1000);
  //console.log(`value: ${value} seconds[0]: ${seconds[0]} seconds[1]: ${seconds[1]}`);
  if (seconds[ 0 ] < 60) {
    return singleOrPlural(seconds[ 0 ], `sec`, `secs`, 0);
  }

  const mins = remainder(value / 1000, 60);
  if (mins[ 0 ] < 60) {
    return detailed ? numberToString(mins[ 0 ], 0) + `m` + numberToString(mins[ 1 ], 0) + `s` : singleOrPlural(mins[ 0 ], `min`, `mins`, 2);
  }
  const hours = remainder(value / 60 / 1000, 60);
  return detailed ? numberToString(hours[ 0 ], 0) + `h` + numberToString(mins[ 0 ], 2) + `m` + numberToString(mins[ 1 ], 0) + `s` : singleOrPlural(hours[ 0 ], `hour`, `hours`) + ` ` + numberToString(hours[ 1 ], 0) + `m`;
}