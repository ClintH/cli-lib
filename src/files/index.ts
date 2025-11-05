import { extname } from 'node:path';

export * from './json.js';
export * from './types.js';
export * from './crawl.js';
export * from './path-resolver.js';
export * from './ensure-path.js';

export const withoutExtension = (path: string) => {
  const extension = extname(path);
  if (extension.length > 0) {
    return path.slice(0, path.length - extension.length);
  }
  return path;
}

/**
 * Normalises a user-provided extension
 * '.jpeg' -> '.jpeg'
 * 'jpeg' -> '.jpeg'
 * 'JPEG' -> '.jpeg'
 * @param ext 
 */
export const normaliseExtension = (extension: string) => {
  if (extension.includes(`/`)) throw new Error(`Extension contains '/'`);
  if (extension.includes(` `)) throw new Error(`Extension contains ' '`);
  if (extension.includes(`\\`)) throw new Error(`Extension contains '\\'`);
  if (!extension.startsWith(`.`)) extension = `.` + extension;
  return extension.toLowerCase();
}