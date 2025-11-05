import { Commands } from "./arguments.js";
import { Term } from "./term.js";
import { parse } from 'ts-command-line-args';
import * as exitHook from 'exit-hook';
import { InitOptions } from "types.js";

export class App {
  static _instance: App | undefined = undefined;
  term;
  #opts: InitOptions | undefined;

  private constructor() {
    this.term = Term.instance;
  }

  quit(signal = 0) {
    exitHook.gracefulExit(signal);
  }

  init(opts: InitOptions) {
    //console.log(process.argv);
    this.#opts = opts;
    if (opts.terminal) this.term.configure(opts.terminal);

    globalThis.term = this.term;
    this.term.appHeader();
    this.#opts = opts;

    exitHook.asyncExitHook((signal) => {
      if (opts.onExit) opts.onExit(signal);
      this.term.close();
    }, { wait: 100 });

    this.#initWithCommands(opts.commands);
  }

  #initWithCommands<T>(commands: Commands<T>) {
    const listCommands = () => {
      for (const entry of Object.entries(commands)) {
        this.term.log(` · ${ entry[ 0 ] }`);
      }
      exitHook.gracefulExit(0);
    }

    if (process.argv.length === 2) {
      this.term.log(`No command specified. Available commands:`);
      listCommands();
    }

    const mainOptions = parse({
      command: { type: String, defaultOption: true },
    }, {
      helpArg: `help`,
      hideMissingArgMessages: true,
      stopAtFirstUnknown: true,
      showHelpWhenArgsMissing: true
    });

    const argv = mainOptions._unknown || [];
    // this.term.log(`main options:`);
    // this.term.log(mainOptions);

    const c = commands[ mainOptions.command ];
    if (c === undefined) {
      // Unknown command
      this.term.error(`Command '${ mainOptions.command }' not found.`);
      this.term.log(`Available commands:`);
      listCommands();
    } else {
      const mergedOptions = parse(c.config, { argv });
      c.invoke(mergedOptions);
    }

  }

  static get instance(): App {
    if (App._instance === undefined) {
      App._instance = new App();
    }
    return App._instance;
  }
}