import { readFile, writeFile } from "node:fs/promises"
import { existsSync } from 'fs';
import { Mode, OpenMode } from "node:fs";

export type WriteMode = `append` | `overwrite` | `dont-overwrite`

export type ReadOpts<V> = {
  encoding?: BufferEncoding
  onCreateDefault?: () => V
}

export const readJson = async <V>(file: string, opts: ReadOpts<V> = {}): Promise<V | undefined> => {
  if (!existsSync(file)) {
    if (opts.onCreateDefault) return opts.onCreateDefault();
    return undefined;
  }
  const encoding = opts.encoding ?? 'utf8';
  const txt = await readFile(file, {
    encoding
  });
  const o = JSON.parse(txt);
  return o as V;
}

export type WriteOpts = {
  mode?: WriteMode,
  encoding?: BufferEncoding
}

export const writeJson = async (file: string, data: any, opts: WriteOpts = {}) => {
  const encoding = opts.encoding ?? 'utf8';
  const mode = opts.mode ?? `dont-overwrite`;

  let modeFlag: OpenMode = '';
  switch (mode) {
    case `append`:
      modeFlag = 'a';
      break;
    case `overwrite`:
      modeFlag = 'w';
      break;
    default:
      modeFlag = 'wx';
  }

  const txt = JSON.stringify(data);
  return writeFile(file, txt, {
    encoding: encoding,
    flag: modeFlag
  })
}