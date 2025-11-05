import { Dirent } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { isAbsolute, join, resolve } from 'node:path';
import { CrawlOptions } from './types.js';

/**
 * Recursive file system crawl
 * 
 * Extensions need to have a '.' starting the string.
 * @param basePath 
 * @param opts 
 * @param depth 
 * @returns 
 */
export async function* crawl(basePath: string, opts: CrawlOptions = {}, depth = 0): AsyncIterableIterator<Dirent> {
  const ignoreExtensions = opts.ignoreExtensions ?? [];
  const includeExtensions = opts.includeExtensions ?? [];
  const ignoreDirectories = opts.ignoreDirectories ?? false;
  const maximumDepth = opts.maximumDepth ?? Number.MAX_SAFE_INTEGER;

  // Maximum depth reached
  if (depth > maximumDepth) return;

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
    entry.parentPath = basePath;
    if (entry.isDirectory()) {
      if (!ignoreDirectories) yield entry;
      yield* crawl(join(basePath, entry.name), opts, depth + 1);
    } else {
      if (!includeExtension(entry)) continue;
      yield entry;
    }
  }
}