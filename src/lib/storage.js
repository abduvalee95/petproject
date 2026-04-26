import { STORAGE_KEY } from './constants.js';
import { cloneStudents } from './students.js';

function getStorage(storage) {
  return storage ?? globalThis.localStorage;
}

export function loadStudents(fallbackStudents, storage) {
  const target = getStorage(storage);

  try {
    const raw = target.getItem(STORAGE_KEY);

    if (!raw) {
      return cloneStudents(fallbackStudents);
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return cloneStudents(fallbackStudents);
    }

    return cloneStudents(parsed);
  } catch {
    return cloneStudents(fallbackStudents);
  }
}

export function saveStudents(students, storage) {
  const target = getStorage(storage);

  try {
    target.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch {
    return false;
  }
}

export function resetStudents(storage) {
  const target = getStorage(storage);

  try {
    target.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
