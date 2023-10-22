import boxen from 'boxen';
import { readFileSync } from "node:fs";
import kleur from "kleur";
import { locatePackageJson } from './files/PackageJson.js';
import { ILog, InitOptions, LogMessage, LogOptions, rawConsoleDefault, type RawConsole } from './Types.js';
import * as Debug from './Debug.js';

export type TermTypePrefixStyles = `character` | `word` | `none`;

export type TermOptions = {
  alignLeft: boolean
  prefixStyle: TermTypePrefixStyles
  handleErrors: boolean
}

export class Term {
  static _instance: Term | undefined;

  private _con: RawConsole;
  private _log: ILog | undefined;
  private _prefix?: string;
  private _alignLeft: boolean;
  private _prefixStyle: TermTypePrefixStyles;

  private constructor() {
    this._con = rawConsoleDefault();
    this._alignLeft = false;
    this._prefixStyle = `character`;
    this._log = undefined;
  }

  setLog(log: ILog) {
    this._log = log;
    this._con = log.getRawConsole();
    this._log.addListener(message => this.onLogMessage(message));

  }

  configure(options: TermOptions) {
    this._alignLeft = options.alignLeft ?? false;
    this._prefixStyle = options.prefixStyle ?? `character`;

    const handleErrors = options.handleErrors ?? false;
    if (handleErrors) {
      process.on(`uncaughtException`, error => {
        this.printError(error);
        process.exit(0);
      });
    }
  }

  static get instance(): Term {
    if (Term._instance === undefined) {
      Term._instance = new Term();
    }
    return Term._instance;
  }

  printError(error: Error) {
    const stack = Debug.stack(error);
    if (!stack) return;
    this.raw(boxen(stack, {
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

  log(message: any) {
    this.onLogMessage({ message, type: `` });
  }

  error(message: any) {
    this.onLogMessage({ message, type: `error` });
  }

  private onLogMessage(logMessage: LogMessage): boolean {
    let prefix = this._prefix ? kleur.white(this._prefix) : ``;

    let message = logMessage.message;

    // eslint-disable-next-line unicorn/prefer-switch
    if (logMessage.type === `error`) {
      let typePrefix = ``;
      if (this._prefixStyle === `character`) typePrefix = `E `;
      else if (this._prefixStyle === `word`) typePrefix = `Error `;
      prefix = kleur.red(typePrefix) + prefix;
      message = kleur.red(message)
    } else if (logMessage.type === `warning`) {
      let typePrefix = ``;
      if (this._prefixStyle === `character`) typePrefix = `! `;
      else if (this._prefixStyle === `word`) typePrefix = ` Warn `;
      prefix = kleur.yellow(typePrefix) + prefix;
      message = kleur.yellow(message)

    } else if (logMessage.type === `info`) {
      let indentTimes = 0;
      if (this._alignLeft) {
        if (this._prefixStyle === `character`) indentTimes = 2;
        else if (this._prefixStyle === `word`) indentTimes = 6;
      }

      prefix = ` `.repeat(indentTimes) + prefix;
      message = kleur.dim(message)
    } else {
      let indentTimes = 0;
      if (this._alignLeft) {
        if (this._prefixStyle === `character`) indentTimes = 2;
        else if (this._prefixStyle === `word`) indentTimes = 6;
      }
      prefix = ` `.repeat(indentTimes) + prefix;
    }

    const additional = logMessage.parameters === undefined ? `` : logMessage.parameters.join(` `);

    this.raw(prefix + message + additional);
    return true;
  }

  box = (message: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.raw(boxen(message, {
      padding: 1
    }));
  }


  header(message: string) {
    const bit = kleur.blue().underline(message);
    this.raw();
    this.raw(bit);
    this.raw();
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
      this._con.error(`Could not load package.json`);
      this._con.error(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }

    const title = `${ name } ${ version }`;

    this.raw(kleur.gray(`-`.repeat(title.length)));
    this.raw(kleur.blue(title));
    if (description.length > 0) this.raw(description);
    this.raw(kleur.gray(`-`.repeat(title.length)));
  }

  separator() {
    this.raw();
    this.raw(kleur.cyan(kleur.bold(`-----`)));
    this.raw();
  }


  raw(message?: any, ...optionalParameters: Array<any>) {
    if (message === undefined) {
      this._con.log();
      return;
    }
    this._con.log(message, ...optionalParameters);
  }

  emphasis(message: string) {
    const messageLines = message.split(`\n`);
    for (const m of messageLines) {
      const txt = m.trim();
      this.raw(kleur.italic(txt));
    }
  }

  write(message: string) {
    this.raw(message);
  }

}