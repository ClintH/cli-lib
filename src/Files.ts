import {fileURLToPath} from 'url';
import {resolve} from 'node:path';
import {writeFile, readFile} from 'fs/promises';
import {existsSync} from 'fs';

export const pathResolver = (offset: string = '') => {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  return (relativePath: string) => {
    return resolve(__dirname, offset, relativePath);
  }
}

export enum WriteMode {
  Overwrite,
  NoOverwrite,
  Append
}

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
  const mode = opts.mode ?? WriteMode.Overwrite;

  let modeFlag = '';
  switch (mode) {
    case WriteMode.Append:
      modeFlag = 'a';
      break;
    case WriteMode.Overwrite:
      modeFlag = 'w';
      break;
    default:
      modeFlag = 'wx';
  }

  const txt = JSON.stringify(data);
  await writeFile(file, txt, {
    encoding: encoding,
    mode: modeFlag
  })
}