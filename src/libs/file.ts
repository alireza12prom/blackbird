import fs from 'fs';

export function openIfExists(path: string) {
  try {
    return fs.readFileSync(path);
  } catch (error) {
    return undefined;
  }
}
