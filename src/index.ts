export * from './term.js';
export * as Json from './files/json.js';
export * as Arrays from './arrays.js';
export * as Files from './files/index.js';
export * from './collections/forgetful-map.js';
export * as Maths from './math.js';
export * from './progress.js';
export * as Time from './time.js';
export * as Debug from './debug.js';
export * as Text from './text.js';
export { App } from './app.js';
export { Commands, Command } from './arguments.js';
export type * from './types.js'
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
