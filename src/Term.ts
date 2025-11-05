import boxen from 'boxen';
import { readFileSync } from "node:fs";
import kleur from "kleur";
import { locatePackageJson } from './files/PackageJson.js';
import { ILog, LogMessage, rawConsoleDefault, type RawConsole } from './types.js';
import * as Debug from './debug.js';

export type TermTypePrefixStyles = `character` | `word` | `none`;

export type TermOptions = {
  alignLeft: boolean
  prefixStyle: TermTypePrefixStyles
  handleErrors: boolean
}

export class Term {
  static _instance: Term | undefined;

  private _con: RawConsole | undefined;
  private _log: ILog | undefined;
  private _prefix?: string;
  private _alignLeft: boolean;
  private _prefixStyle: TermTypePrefixStyles;
  private _closed = false;

  private _onLogMessage;

  private constructor() {
    this._con = rawConsoleDefault();
    this._alignLeft = false;
    this._prefixStyle = `character`;
    this._log = undefined;
    this._onLogMessage = (message: LogMessage) => this.onLogMessage(message);

  }

  setLog(log: ILog | undefined) {
    if (this._log !== undefined) {
      this._log.removeListener(this._onLogMessage);
      this._con = rawConsoleDefault();
    }
    this._log = log;

    if (this._log) {
      this._log.addListener(this._onLogMessage);
      this._con = this._log.getRawConsole();
    }
  }

  close() {
    this._closed = true;
  }

  configure(options: Partial<TermOptions>) {
    if (this._closed) throw new Error(`Term closed`);

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
    if (this._closed) throw new Error(`Term closed`);

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
    if (this._closed) throw new Error(`Term closed`);

    this.onLogMessage({ message, type: `` });
  }

  error(message: any) {
    if (this._closed) throw new Error(`Term closed`);

    this.onLogMessage({ message, type: `error` });
  }

  private onLogMessage(logMessage: LogMessage): boolean {
    if (this._closed) throw new Error(`Term closed`);

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
    if (this._closed) throw new Error(`Term closed`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    this.raw(boxen(message, {
      padding: 1
    }));
  }


  header(message: string) {
    if (this._closed) throw new Error(`Term closed`);

    const bit = kleur.blue().underline(message);
    this.raw();
    this.raw(bit);
    this.raw();
  }

  appHeader() {
    if (this._closed) throw new Error(`Term closed`);

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
      this._con?.error(`Could not load package.json`);
      this._con?.error(error);
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
    if (this._closed) throw new Error(`Term closed`);

    if (message === undefined) {
      this._con?.log();
      return;
    }
    this._con?.log(message, ...optionalParameters);
  }

  emphasis(message: string) {
    if (this._closed) throw new Error(`Term closed`);

    const messageLines = message.split(`\n`);
    for (const m of messageLines) {
      const txt = m.trim();
      this.raw(kleur.italic(txt));
    }
  }

  write(message: string) {
    if (this._closed) throw new Error(`Term closed`);

    this.raw(message);
  }

}