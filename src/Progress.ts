import { incrementThrough } from "./Arrays.js";
import { humanElapsed } from "./Time.js";
import logUpdate from 'log-update'

const spinner = [ `-`, `\\`, `|`, `/`, `-`, `\\`, `|`, `/` ];

export const progress = (total: number) => {
  let count = 0;
  const startTime = Date.now();
  const spinnerLoop = incrementThrough(spinner);
  const sinceLastUpdate = startTime;
  const updateThresholdMs = 200;

  return (suffix = ``) => {
    count++;
    if (count > total) return;
    const now = Date.now();
    const elapsed = now - startTime;
    const elapsedSinceLastUpdate = now - sinceLastUpdate;

    let percentage = count / total;
    if (percentage > 1) percentage = 1;

    if (elapsedSinceLastUpdate > updateThresholdMs) {
      // Only update if enough time has passed since last update
      const humanPercent = Math.round(percentage * 100);
      const humanElapsedValue = humanElapsed(elapsed, true);
      logUpdate(`${ spinnerLoop() } ${ humanPercent }% ${ count }/${ total } ${ humanElapsedValue } ${ suffix }`);
    }
    if (percentage === 1) {
      logUpdate(`  ${ total } in ${ humanElapsed(elapsed, false) } ${ suffix }`);
      logUpdate.done();
    }
  }
}