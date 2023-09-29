import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
// export const getPackageFile = () => {
//   const p = process.argv[ 1 ];
//   if (!p) throw new Error('argv[1] undefined');
//   const src = dirname(p);
//   const pkg = join(src, '../package.json');
//   return pkg;
// }

export const locatePackageJson = () => {
  let prefix = ``;
  while (prefix.length < 7) {
    const path = new URL(prefix + `package.json`, import.meta.url);
    if (existsSync(path)) return path;
    prefix += `../`;
  }
  throw new Error(`Could not resolve package`);
}