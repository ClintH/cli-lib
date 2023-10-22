import { Commands, IBaseArguments, parseArguments } from './Arguments.js';
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
export * as Text from './Text.js';
export { App } from './App.js';
export { Commands, Command } from './Arguments.js';
export type { InitOptions, LogListener, LogMessage, LogTypes, LogOptions } from './Types.js'
// export function init<TArguments>(initOptions: Partial<InitOptions> = {}): App<TArguments> {
//  const args = parseArguments<TArguments>(initOptions.args);
// const args = parseCommand<TArguments>(options.args);
// if (args.log.length > 0) void log.setOutputFile(args.log, false);
// if (args.verbose) log.verboseMode = true;

// exitHook(signal => {
//   if (initOptions.onExit) initOptions.onExit(signal);
//   void log.closeFile();
// })

// const quit = (signal = 0) => {
//   // eslint-disable-next-line unicorn/no-process-exit
//   process.exit(signal);
// }

// return {
//   log, term, quit, args
// }
// }

// function initCommon() {

// }

// export function initCommand<TCommands>(options: Partial<InitOptions>, commands: Commands<TCommands>) {
//   const logPrefix = options.logPrefix ?? ``;
//   const log = new Log({ prefix: logPrefix });
//   const term = new Term(log, options.terminal ?? {});

//   parseCommand<TCommands>(commands);
// }
