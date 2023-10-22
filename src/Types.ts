import { ArgumentConfig } from "ts-command-line-args"
import { IBaseArguments } from "./Arguments.js"
import { Term, TermOptions } from "./Term.js"
export type LogTypes = `` | `info` | `error` | `warning`;
export type LogMessage = {
  type: LogTypes
  message: any
  parameters?: Array<any>
}

export type LogListener = (message: LogMessage) => boolean;
export type RawConsole = {
  info: (message?: any, ...optionalParameters: Array<any>) => void
  log: (message?: any, ...optionalParameters: Array<any>) => void
  error: (message?: any, ...optionalParameters: Array<any>) => void
  warn: (message?: any, ...optionalParameters: Array<any>) => void
}

export const rawConsoleDefault = () => ({
  info: (message?: any, ...optionalParameters: Array<any>) => {
    console.info(message, ...optionalParameters);
  },
  log: (message?: any, ...optionalParameters: Array<any>) => {
    console.log(message, ...optionalParameters);
  },
  error: (message?: any, ...optionalParameters: Array<any>) => {
    console.error(message, ...optionalParameters);
  },
  warn: (message?: any, ...optionalParameters: Array<any>) => {
    console.warn(message, ...optionalParameters);
  }
})

export type LogOptions = {
  verbose: boolean
  prefix: string
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface ILog {
  getRawConsole(): RawConsole
  get verboseMode(): boolean
  set verboseMode(value: boolean)
  addListener(listener: LogListener): void
}

export type InitOptions = Readonly<{
  onExit(signal: number): void
  logPrefix: string
  terminal?: Partial<TermOptions>
}>

export type App<TArguments> = Readonly<{
  log: ILog,
  args: TArguments & IBaseArguments,
  term: Term,
  quit: (signal?: number) => void
}>
