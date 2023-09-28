import cleanStack from 'clean-stack';
import { inspect } from "node:util";
//import safeStringify from '@sindresorhus/safe-stringify';

export const stack = (error: Error) => {
  return cleanStack(error.stack, {
    pretty: true
  });
}

// export const render = (r: any) => {
//   return safeStringify(r, {indentation: 2});
// }

export const render = (m: any): string => {
  if (m === null) return `(null)`;
  if (typeof m === `string`) return m;
  if (typeof m === `object`) return inspect(m);
  if (typeof m === `undefined`) return `(undefined)`;
  return `` + m;
}