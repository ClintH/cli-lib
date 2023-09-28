import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

export const pathResolver = (offset = ``) => {
  const __dirname = fileURLToPath(new URL(`.`, import.meta.url));
  return (relativePath: string) => {
    return resolve(__dirname, offset, relativePath);
  }
}
