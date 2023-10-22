import { mkdirSync, existsSync, renameSync } from "node:fs";

export type SplitFolderNameOptions = {
  /**
   * Default: false
   */
  trailingSlashFolder: boolean
  /**
   * Default: true
   */
  filesWithPeriods: boolean
}
/**
 * Attempts to split path into folder and filename components.
 * 
 * By default, assumes files must have a period ('.')
 * @param path 
 * @param strictTrailingSlash If true, folders are expected to have trailing slash
 * @returns 
 */
export const splitFolderName = (path: string, options: Partial<SplitFolderNameOptions> = {}): { folder: string, file: string } => {
  const trailingSlashFolder = options.trailingSlashFolder ?? false;
  const filesWithPeriods = options.filesWithPeriods ?? true;

  const lastBackwardSlash = path.lastIndexOf(`/`);
  const lastForwardSlash = path.lastIndexOf(`\\`);
  const lastSlash = Math.max(lastBackwardSlash, lastForwardSlash);
  const lastPeriod = path.lastIndexOf(`.`);

  if (lastSlash === path.length - 1) {
    // Path ends with a slash
    return { folder: path, file: `` };
  }

  const folder = path.slice(0, lastSlash + 1);
  const file = path.slice(lastSlash + 1);

  if (lastPeriod > lastSlash) {
    // Hint of a file
    return { folder, file };
  }

  if (filesWithPeriods) {
    // Only consider files if they have period, and there's no period
    if (trailingSlashFolder) {
      throw new Error(`Path has no trailing slash to denote folder, nor does it have required period to denote file`);
    } else {
      // Let whole thing be path, with no file
      return { folder: path, file: `` };
    }
  } else {
    // It's allowed to have files without periods
    return { folder, file };
  }
}

export type EnsurePathOptions = SplitFolderNameOptions;

export const ensurePath = (path: string, options: Partial<EnsurePathOptions> = {}) => {
  if (existsSync(path)) return;
  const split = splitFolderName(path, options);
  mkdirSync(split.folder, { recursive: true });
}

export const rename = (existingPath: string, replacementPath: string) => {
  if (existsSync(replacementPath)) throw new Error(`Path already exists: ${ replacementPath }`);
  ensurePath(replacementPath, { filesWithPeriods: true, trailingSlashFolder: true });
  renameSync(existingPath, replacementPath);
}