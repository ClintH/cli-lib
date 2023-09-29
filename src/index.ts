import { IBaseArguments, parseArguments } from './Args.js';
import { Log } from './Log.js';
import { Term } from './Term.js';
import exitHook from 'exit-hook';
import { App, InitOptions } from './Types.js';
export * from './Term.js';
export * as Json from './files/Json.js';
export * as Arrays from './Arrays.js';
export * as Files from './files/index.js';
export * from './ForgetfulMap.js';
export * as Maths from './Math.js';
export * from './Progress.js';
export * as Time from './Time.js';
export * as Debug from './Debug.js';

export function init<Args>(initOptions: Partial<InitOptions<Args>> = {}): App<Args> {
  const logPrefix = initOptions.logPrefix ?? ``;
  const log = new Log({ prefix: logPrefix });
  const term = new Term(log, initOptions.terminal ?? {});

  const args = parseArguments<Args>(initOptions.args);
  if (args.log.length) log.setOutputFile(args.log, false);
  if (args.verbose) log.verboseMode = true;

  exitHook(signal => {
    if (initOptions.onExit) initOptions.onExit(signal);
    log.closeFile();
  })

  const quit = (signal: number = 0) => {
    process.exit(signal);
  }

  return {
    log, term, quit, args
  }
}
