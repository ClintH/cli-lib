import { ArgumentConfig, parse } from 'ts-command-line-args';

export interface IBaseArguments {
  verbose: boolean
  log: string
  indentedTerm: boolean
}

export const parseArguments = <V>(conf?: ArgumentConfig<V>): IBaseArguments & V => {
  const x = parse({
    verbose: { type: Boolean, defaultValue: false, alias: 'v', description: 'Verbose' },
    log: { type: String, defaultValue: '', description: 'File to log to' },
    ...conf
  });
  return x as (V & IBaseArguments);
}