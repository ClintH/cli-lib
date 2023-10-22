import { ArgumentConfig, parse } from 'ts-command-line-args';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface IBaseArguments {
  verbose: boolean
  log: string
  indentedTerm: boolean
}

export type Command<T> = {
  config: ArgumentConfig<T>
  invoke: (config: T) => void
}
export type Commands<T> = Record<string, Command<T>>;



export const parseArguments = <V>(config?: ArgumentConfig<V>): IBaseArguments & V => {
  const x = parse({
    verbose: { type: Boolean, defaultValue: false, alias: `v`, description: `Verbose` },
    log: { type: String, defaultValue: ``, description: `File to log to` },
    ...config
  });

  return x as (V & IBaseArguments);
}