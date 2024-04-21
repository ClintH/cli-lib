import kleur from "kleur";
import { incrementThrough } from "./Arrays.js";
import { humanElapsed } from "./Time.js";
import logUpdate from 'log-update'

const spinnerLines = [ `-`, `\\`, `|`, `/`, `-`, `\\`, `|`, `/` ] as const;

export type ProgessOptions = {
  /**
   * Kind of spinner.
   * Default: 'lines'
   */
  spinner: `lines` | `none`
  /**
   * Show elapsed time when done
   * Default: _true_
   */
  whenDoneShowElapsed: boolean
  name: string
  /**
   * Minimum time before console updates
   * Default: 200
   */
  updateThresholdMs: number
}

export const progress = (total: number, options: Partial<ProgessOptions> = {}) => {
  let count = 0;
  const whenDoneShowElapsed = options.whenDoneShowElapsed ?? true;
  const updateThresholdMs = options.updateThresholdMs ?? 200;
  const spinner = options.spinner ?? `lines`;
  const startTime = Date.now();
  const spinnerLoop = spinner === `none` ? () => `` : incrementThrough(spinnerLines);
  const sinceLastUpdate = startTime;
  const name = options.name;

  const elapsedTime = () => Date.now() - startTime;
  let _cancelled = false;
  let _finished = false;

  let prefix = ``;
  if (name) {
    prefix = kleur.white(name) + ` `;
  }

  const error = (message: any) => {
    logUpdate.done();
    console.error(message);
  }

  const warn = (message: any) => {
    logUpdate.done();
    console.warn(message);
  }

  const log = (message: any) => {
    logUpdate.done();
    console.log(message);
  }

  const cancel = (message = `Cancelled`) => {
    if (_cancelled || _finished) return;
    _cancelled = true;
    logUpdate(prefix + kleur.red(message));
    logUpdate.done();
  }

  const done = (message = ``) => {
    if (_cancelled || _finished) return;
    _finished = true;
    if (message.length > 0) message += ` `;
    if (whenDoneShowElapsed) {
      logUpdate(`${ prefix }Complete. ${ message }(${ total } in ${ humanElapsed(elapsedTime(), false) })`);
    } else {
      logUpdate(`${ prefix }Complete. ${ message }`);
    }
    logUpdate.done();
  }

  const update = (suffix = ``,) => {
    if (_cancelled || _finished) return;
    count++;
    if (count > total) return;

    const elapsed = elapsedTime();
    const elapsedSinceLastUpdate = Date.now() - sinceLastUpdate;

    let percentage = count / total;
    if (percentage > 1) percentage = 1;

    if (elapsedSinceLastUpdate > updateThresholdMs) {
      // Only update if enough time has passed since last update
      const humanPercent = Math.round(percentage * 100);
      const humanElapsedValue = humanElapsed(elapsed, true);
      logUpdate(`${ prefix }${ spinnerLoop() } ${ humanPercent }% ${ count }/${ total } ${ humanElapsedValue } ${ suffix }`);
    }
    if (percentage === 1) {
      done(suffix);
    }
  }

  return { update, done, cancel, error, warn, log }
}