import Logger from './Log.js';
import { Term } from './Term.js';
import exitHook from 'exit-hook';
export * from './Log.js';
export * from './Term.js';
export * as Json from './files/Json.js';
export * as Arrays from './Arrays.js';
export * as Files from './files/index.js';
export * from './ForgetfulMap.js';
export * as Maths from './Math.js';
export * from './Progress.js';
export * as Time from './Time.js';
export * as Debug from './Debug.js';

export type App = Readonly<{
  onExit?(signal: number): void;
  logPrefix?: string
}>

export type Init = Readonly<{
  log: Logger,
  term: Term
}>

export function init(app: App = {}): Init {
  const logPrefix = app.logPrefix ?? ``;
  const log = new Logger({ prefix: logPrefix });
  const term = new Term(log);
  exitHook(signal => {
    if (app.onExit) app.onExit(signal);
    log.close();
  })

  return {
    log, term
  }
}
