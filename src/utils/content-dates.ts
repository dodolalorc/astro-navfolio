import { statSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';

export interface DatedContentEntry {
  id: string;
  filePath?: string;
  data: {
    date: Date;
  };
}

function getAbsoluteFilePath(filePath: string) {
  return isAbsolute(filePath) ? filePath : resolve(process.cwd(), filePath);
}

export function getContentLastmod(entry: DatedContentEntry) {
  if (!entry.filePath) {
    return entry.data.date;
  }

  try {
    return statSync(getAbsoluteFilePath(entry.filePath)).mtime;
  } catch {
    return entry.data.date;
  }
}

export function sortByDateDesc<T extends DatedContentEntry>(entries: T[]) {
  return [...entries].sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function sortByLastmodDesc<T extends DatedContentEntry>(entries: T[]) {
  return [...entries].sort((a, b) => {
    const lastmodDiff = getContentLastmod(b).valueOf() - getContentLastmod(a).valueOf();

    if (lastmodDiff !== 0) {
      return lastmodDiff;
    }

    return b.data.date.valueOf() - a.data.date.valueOf();
  });
}
