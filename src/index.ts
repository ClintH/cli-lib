import exitHook from 'exit-hook';
import Logger from './Log.js';
import {Term} from './Term.js';

export type App = Readonly<{
  onExit?(signal: number): void;
  logPrefix?: string
}>

export type Init = Readonly<{
  log: Logger,
  term: Term
}>

export function init(app: App = {}): Init {
  const logPrefix = app.logPrefix ?? '';
  const log = new Logger(logPrefix);
  const term = new Term(log);
  exitHook(signal => {
    if (app.onExit) app.onExit(signal);
    log.close();
  })

  return {
    log, term
  }
}