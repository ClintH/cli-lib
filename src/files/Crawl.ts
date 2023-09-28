import { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { CrawlOptions } from './Types.js';


export async function* crawl(basePath: string, opts: CrawlOptions = {}): AsyncIterableIterator<Dirent> {
  const ignoreExtensions = opts.ignoreExtensions ?? [];
  const includeExtensions = opts.includeExtensions ?? [];
  const ignoreDirectories = opts.ignoreDirectories ?? false;

  if (!isAbsolute(basePath)) basePath = resolve(process.cwd(), basePath);

  const validateExtensions = (extension: string) => !extension.startsWith(`.`);
  if (ignoreExtensions.some(extension => validateExtensions(extension))) throw new Error(`Ignore extensions need to have . prefix`);
  if (includeExtensions.some(extension => validateExtensions(extension))) throw new Error(`Include extensions need to have . prefix`);

  const getExtension = (entry: Dirent) => entry.name.slice(Math.max(0, entry.name.lastIndexOf(`.`)));
  let includeExtension = (_entry: Dirent) => true;
  if (includeExtensions.length > 0) {
    includeExtension = (entry: Dirent) => {
      return (includeExtensions.includes(getExtension(entry)));
    }
  } else if (ignoreExtensions.length > 0) {
    includeExtension = (entry: Dirent) => {
      return (!ignoreExtensions.includes(getExtension(entry)));
    }
  }

  const entries = await readdir(basePath, { withFileTypes: true });
  for (const entry of entries) {
    entry.path = basePath;
    if (entry.isDirectory()) {
      if (!ignoreDirectories) yield entry;
      yield* crawl(join(basePath, entry.name), opts);
    } else {
      if (!includeExtension(entry)) continue;
      yield entry;
    }
  }
}