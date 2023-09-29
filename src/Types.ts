import { ArgumentConfig } from "ts-command-line-args"
import { IBaseArguments } from "./Args.js"
import { Term, TermOptions } from "./Term.js"
export type LogTypes = `` | `info` | `error` | `warning`;
export type LogMessage = {
  type: LogTypes
  message: any
  parameters: Array<any>
}

export type LogListener = (message: LogMessage) => boolean;
export type RawConsole = {
  info: (message?: any, ...optionalParameters: Array<any>) => void
  log: (message?: any, ...optionalParameters: Array<any>) => void
  error: (message?: any, ...optionalParameters: Array<any>) => void
  warn: (message?: any, ...optionalParameters: Array<any>) => void
}
export type LogOptions = {
  verbose: boolean
  prefix: string
}

export interface ILog {
  getRawConsole(): RawConsole
  get verboseMode(): boolean
  set verboseMode(value: boolean)
  addListener(listener: LogListener): void
}
export type InitOptions<Args> = Readonly<{
  onExit(signal: number): void
  logPrefix: string
  args: ArgumentConfig<Args>
  terminal?: Partial<TermOptions>
}>

export type App<Args> = Readonly<{
  log: ILog,
  args: Args & IBaseArguments,
  term: Term,
  quit: (signal?: number) => void
}>
