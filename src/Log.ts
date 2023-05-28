import kleur, {Kleur} from "kleur";
import {open, FileHandle} from "fs/promises";

import {render} from "./Debug.js";


export default class Logger {
  verboseEnable: boolean = false;
  prefix: string;
  timestamp: boolean;
  file?: FileHandle;
  _log;
  _error;
  _warn;

  constructor(prefix: string = '', timestamp = false) {
    this._log = console.log;
    this._error = console.error;
    this._warn = console.warn;

    console.log = this.info;
    console.error = this.error;
    console.warn = this.warn;

    if (prefix.length > 0) prefix = prefix + " ";
    else prefix = ' · ';
    this.prefix = prefix;
    this.timestamp = timestamp;
    // @ts-ignore
    if (globalThis.args) this.initFromArgs();
  }

  async setOutputFile(file: string, append: boolean) {
    if (this.file) {
      await this.close();
    }
    const flag = append ? 'a' : 'w'
    this.file = await open(file, flag);
    if (append) this.writeFileLine('--- Opened --- ');
  }

  async writeFileLine(line: string) {
    if (!this.file) return;
    const ts = new Date().toISOString();
    await this.file.write(ts + ' ' + line + '\n');
  }

  async close() {
    if (!this.file) return;
    await this.writeFileLine('--- Closed ---');
    await this.file.close();
    this.file = undefined;
  }

  initFromArgs() {
    // @ts-ignore
    this.verboseEnable = globalThis.args.verbose || false;
  }

  // demo() {
  //   this.header('Header');
  //   this.info('An info message');
  //   this.info('A really long info message'.repeat(10));
  //   this.separator();
  //   this.info('A really long info message. '.repeat(10));

  //   this.warn('A warning message');
  //   this.verbose('A verbose message');
  //   this.error('An error msg');
  // }

  getLinePrefix() {
    if (this.timestamp) {
      const now = Date.now();
      return kleur.gray(now)
    } else {
      return '';
    }
  }

  info(msg?: any, ...optionalParams: any[]) {
    let bit = kleur.white(this.prefix) + msg;
    if (msg.length > 0 && parseInt(msg[0]!)) {
      if (msg[1] === '.' && msg[2] === ' ') {
        // Assume a numbered list
        bit = kleur.bold().white(msg.substring(0, 2)) + msg.substring(2);
      }
    }

    const bits = this.optParams(optionalParams);
    this._log(this.getLinePrefix() + bit + bits.fancy.join(' '));
    this.writeFileLine('INFO\t' + msg + ' ' + bits.plain.join(' '));
  }

  private optParams(optionalParams: any[]): {fancy: Kleur[], plain: string[]} {
    if (optionalParams.length > 0) {
      const plain = optionalParams.map(render);
      const fancy = plain.map(kleur.gray);
      return {fancy, plain};
    }
    return {fancy: [], plain: []};
  }

  verbose(msg?: any, ...optionalParams: any[]) {
    if (!this.verboseEnable) return;
    return this.info(msg, ...optionalParams);
  }

  error(msg?: any, ...optionalParams: any[]) {
    if (msg instanceof Error) {
      this.errorString(msg.message, ...optionalParams);
    } else {
      this.errorString(msg as string, ...optionalParams);
    }
  }

  errorString(msg: string, ...optionalParams: any[]) {
    const bits = this.optParams(optionalParams);
    const bit = kleur.bold(kleur.red().bgBlack(this.prefix + 'Error ')) + msg;
    this._log(bit + bits.fancy.join(' '));
    this.writeFileLine('ERROR\t' + msg + ' ' + bits.plain.join(' '));
  }

  warn(msg?: any, ...optionalParams: any[]) {
    const bits = this.optParams(optionalParams);
    let bit = kleur.bold(kleur.magenta().bgBlack(this.prefix + 'Warn ')) + msg;
    this._log(bit + bits.fancy.join(' '));
    this.writeFileLine('WARN\t' + msg + ' ' + bits.plain.join(' '));
  }

}
