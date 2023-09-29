import boxen from 'boxen';
import { readFileSync } from "node:fs";
import kleur from "kleur";
import { locatePackageJson } from './files/PackageJson.js';
import { ILog, InitOptions, LogMessage, type RawConsole } from './Types.js';
import * as Debug from './Debug.js';


export type TermTypePrefixStyles = `character` | `word` | `none`;

export type TermOptions = {
  alignLeft: boolean
  prefixStyle: TermTypePrefixStyles
  handleErrors: boolean
}

export class Term {
  private con: RawConsole;
  private log: ILog;
  private prefix?: string;
  private alignLeft: boolean;
  private prefixStyle: TermTypePrefixStyles;

  constructor(log: ILog, options: Partial<TermOptions> = {}) {
    this.log = log;
    this.con = log.getRawConsole();
    this.alignLeft = options.alignLeft ?? false;
    this.prefixStyle = options.prefixStyle ?? `character`;

    const handleErrors = options.handleErrors ?? false;
    log.addListener(message => this.onLogMessage(message));

    if (handleErrors) {
      process.on(`uncaughtException`, error => {
        this.printError(error);
        process.exit(0);
      });
    }
  }

  printError(error: Error) {
    const stack = Debug.stack(error);
    if (!stack) return;
    this.l(boxen(stack, {
      borderStyle: `arrow`,
      borderColor: `red`,
      title: `Uncaught exception`,
      titleAlignment: `center`,
      padding: 1
    }))
    // this.l(kleur.red(`\\\\\\\\ uncaught exception \\\\\\\\`));
    // this.l(stack);
    // this.l(kleur.red(`\\\\\\\\`));
  }

  private onLogMessage(message: LogMessage): boolean {
    let prefix = this.prefix ? kleur.white(this.prefix) : ``;

    let msg = message.message;

    if (message.type === `error`) {
      let typePrefix = ``;
      if (this.prefixStyle === `character`) typePrefix = `E `;
      else if (this.prefixStyle === `word`) typePrefix = `Error `;
      prefix = kleur.red(typePrefix) + prefix;
      msg = kleur.red(msg)
    } else if (message.type === `warning`) {
      let typePrefix = ``;
      if (this.prefixStyle === `character`) typePrefix = `! `;
      else if (this.prefixStyle === `word`) typePrefix = ` Warn `;
      prefix = kleur.yellow(typePrefix) + prefix;
      msg = kleur.yellow(msg)

    } else if (message.type === `info`) {
      let indentTimes = 0;
      if (this.alignLeft) {
        if (this.prefixStyle === `character`) indentTimes = 2;
        else if (this.prefixStyle === `word`) indentTimes = 6;
      }

      prefix = ` `.repeat(indentTimes) + prefix;
      msg = kleur.dim(msg)
    } else {
      let indentTimes = 0;
      if (this.alignLeft) {
        if (this.prefixStyle === `character`) indentTimes = 2;
        else if (this.prefixStyle === `word`) indentTimes = 6;
      }
      prefix = ` `.repeat(indentTimes) + prefix;
    }

    const additional = message.parameters.join(` `);

    this.l(prefix + msg + additional);
    return true;
  }

  box = (message: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.l(boxen(message, {
      padding: 1
    }));
  }


  header(message: string) {
    const bit = kleur.blue().underline(message);
    this.l();
    this.l(bit);
    this.l();
  }

  appHeader() {
    let version = `?`;
    let name = `app`;
    let description = ``;

    try {
      const path = locatePackageJson();
      const json = JSON.parse(readFileSync(path, `utf-8`));
      name = json.name;
      version = json.version;
      description = json.description;
    } catch (error) {
      this.con.error(`Could not load package.json`);
      this.con.error(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }

    const title = `${ name } ${ version }`;

    this.l(kleur.gray(`-`.repeat(title.length)));
    this.l(kleur.blue(title));
    if (description.length) this.l(description);
    this.l(kleur.gray(`-`.repeat(title.length)));
  }

  separator() {
    this.l();
    this.l(kleur.cyan(kleur.bold(`-----`)));
    this.l();
  }

  l(message?: any, ...optionalParameters: Array<any>) {
    if (message === undefined) {
      this.con.log();
      return;
    }
    this.con.log(message, ...optionalParameters);
  }

  emphasis(message: string) {
    const messageLines = message.split(`\n`);
    for (const m of messageLines) {
      const txt = m.trim();
      this.l(kleur.italic(txt));
    }
  }

  write(msg: string) {
    this.l(msg);
  }

}