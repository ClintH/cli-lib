import { open, FileHandle } from "node:fs/promises";
import { ILog, LogListener, LogMessage, LogOptions, RawConsole } from "./Types.js";


export class Log implements ILog {
  private _verbose = false;
  private _prefix: string | undefined;
  private _file?: FileHandle;
  private _listeners: Array<LogListener> = [];
  private _logRaw;
  private _errorRaw;
  private _warnRaw;
  private _infoRaw;

  constructor(options: Partial<LogOptions> = {}) {
    this._logRaw = console.log;
    this._errorRaw = console.error;
    this._warnRaw = console.warn;
    this._infoRaw = console.info;

    this._verbose = options.verbose ?? false;
    this._prefix = options.prefix;

    console.log = (message?: any, ...optionalParameters: Array<any>) => {
      this.log({
        type: ``,
        message,
        parameters: optionalParameters
      });
    }
    console.info = (message?: any, ...optionalParameters: Array<any>) => {
      this.log({
        type: `info`,
        message,
        parameters: optionalParameters
      });
    }
    console.error = (message?: any, ...optionalParameters: Array<any>) => {
      this.log({
        type: `error`,
        message,
        parameters: optionalParameters
      })
    };
    console.warn = (message?: any, ...optionalParameters: Array<any>) => {
      this.log({
        type: `warning`,
        message,
        parameters: optionalParameters
      })
    };
  }

  getRawConsole(): RawConsole {
    return {
      log: this._logRaw,
      error: this._errorRaw,
      info: this._infoRaw,
      warn: this._warnRaw
    };
  }


  get verboseMode() {
    return this._verbose;
  }

  set verboseMode(v: boolean) {
    this._verbose = v;
  }

  addListener(listener: LogListener) {
    this._listeners.push(listener);
  }

  log(message: LogMessage) {
    if (message.type === `info` && !this._verbose) return;
    let handled = false;
    for (const l of this._listeners) {
      handled = l(message) || handled;
    }

    const text = this._prefix ? this._prefix + ' ' + message.message : message.message;
    if (!handled) {
      switch (message.type) {
        case `error`:
          this._errorRaw(text, ...message.parameters);
          break;
        case `warning`:
          this._warnRaw(text, ...message.parameters);
        default:
          this._logRaw(text, ...message.parameters);
      }
    }

    this.writeFileLine(message.type + '\t' + text + ' ' + message.parameters);
  }

  async setOutputFile(file: string, append: boolean) {
    if (this._file) {
      await this.closeFile();
    }
    const flag = append ? `a` : `w`
    this._file = await open(file, flag);
    if (append) await this.writeFileLine(`--- Opened --- `);
  }

  private async writeFileLine(line: string) {
    if (!this._file) return;
    const ts = new Date().toISOString();
    await this._file.write(ts + ` ` + line + `\n`);
  }

  async closeFile() {
    if (!this._file) return;
    await this.writeFileLine(`--- Closed ---`);
    await this._file.close();
    this._file = undefined;
  }
}