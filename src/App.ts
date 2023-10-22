import { Commands } from "./Arguments.js";
import { Term } from "./Term.js";
import { ArgumentConfig, parse } from 'ts-command-line-args';

export class App {
  static _instance: App | undefined = undefined;

  term;

  private constructor() {
    this.term = Term.instance;
  }

  initWithCommands<T>(commands: Commands<T>) {
    console.log(process.argv);
    this.term.appHeader();

    const listCommands = () => {
      for (const entry of Object.entries(commands)) {
        this.term.log(` · ${ entry[ 0 ] }`);
      }
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit();
    }
    if (process.argv.length === 2) {
      // No options provided
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
    console.log(`main options:`);
    console.log(mainOptions);

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