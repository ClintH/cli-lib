/* eslint-disable @typescript-eslint/unbound-method */
import kleur from "kleur";
import { open, FileHandle } from "node:fs/promises";
import { render } from "./Debug.js";


export type LogOptions = {
  verbose: boolean
  prefix: string
  timestamp: boolean
}

export default class Logger {
  verboseEnable = false;
  prefix: string;
  timestamp: boolean;
  file?: FileHandle;
  _log;
  _error;
  _warn;

  constructor(options: Partial<LogOptions> = {}) {
    this._log = console.log;
    this._error = console.error;
    this._warn = console.warn;

    this.prefix = options.prefix ?? ``;
    this.verboseEnable = options.verbose ?? false;
    this.timestamp = options.timestamp ?? false;

    this.prefix = this.prefix.length > 0 ? this.prefix + ` ` : ` · `;

    console.log = this.info;
    console.error = this.error;
    console.warn = this.warn;

  }

  async setOutputFile(file: string, append: boolean) {
    if (this.file) {
      await this.close();
    }
    const flag = append ? `a` : `w`
    this.file = await open(file, flag);
    if (append) await this.writeFileLine(`--- Opened --- `);
  }

  async writeFileLine(line: string) {
    if (!this.file) return;
    const ts = new Date().toISOString();
    await this.file.write(ts + ` ` + line + `\n`);
  }

  async close() {
    if (!this.file) return;
    await this.writeFileLine(`--- Closed ---`);
    await this.file.close();
    this.file = undefined;
  }

  initFromArgs() {
    // @ts-expect-error
    this.verboseEnable = globalThis.args.verbose || false;
  }


  getLinePrefix() {
    if (this.timestamp) {
      const now = Date.now();
      return kleur.gray(now)
    } else {
      return ``;
    }
  }

  info(message?: any, ...optionalParameters: Array<any>) {
    let bit = kleur.white(this.prefix) + message;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (message.length > 0 && Number.parseInt(message[ 0 ]!) && message[ 1 ] === `.` && message[ 2 ] === ` `) {
      // Assume a numbered list
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      bit = kleur.bold().white(message.slice(0, 2)) + message.slice(2);
    }

    const bits = this.optParams(optionalParameters);
    this._log(this.getLinePrefix() + bit + bits.fancy.join(` `));
    void this.writeFileLine(`INFO\t` + message + ` ` + bits.plain.join(` `));
  }

  private optParams(optionalParameters: Array<any>): { fancy: Array<string>, plain: Array<string> } {
    if (optionalParameters.length > 0) {
      const plain = optionalParameters.map(p => render(p));
      const fancy = plain.map(p => kleur.gray(p));
      return { fancy, plain };
    }
    return { fancy: [], plain: [] };
  }

  verbose(message?: any, ...optionalParameters: Array<any>) {
    if (!this.verboseEnable) return;
    this.info(message, ...optionalParameters);
  }

  error(message?: any, ...optionalParameters: Array<any>) {
    if (message instanceof Error) {
      this.errorString(message.message, ...optionalParameters);
    } else {
      this.errorString(message as string, ...optionalParameters);
    }
  }

  errorString(message: string, ...optionalParameters: Array<any>) {
    const bits = this.optParams(optionalParameters);
    const bit = kleur.bold(kleur.red().bgBlack(this.prefix + `Error `)) + message;
    this._log(bit + bits.fancy.join(` `));
    void this.writeFileLine(`ERROR\t` + message + ` ` + bits.plain.join(` `));
  }

  warn(message?: any, ...optionalParameters: Array<any>) {
    const bits = this.optParams(optionalParameters);
    const bit = kleur.bold(kleur.magenta().bgBlack(this.prefix + `Warn `)) + message;
    this._log(bit + bits.fancy.join(` `));
    void this.writeFileLine(`WARN\t` + message + ` ` + bits.plain.join(` `));
  }

}
