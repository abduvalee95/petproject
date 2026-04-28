import { STORAGE_KEY, TEACHERS_KEY, SCHEDULE_KEY, JOURNAL_KEY } from './constants.js';
import { cloneStudents } from './students.js';
import { cloneTeachers } from './teachers.js';
import { cloneSchedule } from './schedule.js';
import { cloneJournal } from './journal.js';

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

export function loadTeachers(fallbackTeachers, storage) {
  const target = getStorage(storage);
  try {
    const raw = target.getItem(TEACHERS_KEY);
    if (!raw) return cloneTeachers(fallbackTeachers);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return cloneTeachers(fallbackTeachers);
    return cloneTeachers(parsed);
  } catch {
    return cloneTeachers(fallbackTeachers);
  }
}

export function saveTeachers(teachers, storage) {
  const target = getStorage(storage);
  try {
    target.setItem(TEACHERS_KEY, JSON.stringify(teachers));
    return true;
  } catch {
    return false;
  }
}

export function resetTeachers(storage) {
  const target = getStorage(storage);
  try {
    target.removeItem(TEACHERS_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadSchedule(fallbackSchedule, storage) {
  const target = getStorage(storage);
  try {
    const raw = target.getItem(SCHEDULE_KEY);
    if (!raw) return cloneSchedule(fallbackSchedule);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return cloneSchedule(fallbackSchedule);
    return cloneSchedule(parsed);
  } catch {
    return cloneSchedule(fallbackSchedule);
  }
}

export function saveSchedule(schedule, storage) {
  const target = getStorage(storage);
  try {
    target.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
    return true;
  } catch {
    return false;
  }
}

export function resetSchedule(storage) {
  const target = getStorage(storage);
  try {
    target.removeItem(SCHEDULE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function loadJournal(fallbackJournal, storage) {
  const target = getStorage(storage);
  try {
    const raw = target.getItem(JOURNAL_KEY);
    if (!raw) return cloneJournal(fallbackJournal);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return cloneJournal(fallbackJournal);
    return cloneJournal(parsed);
  } catch {
    return cloneJournal(fallbackJournal);
  }
}

export function saveJournal(journal, storage) {
  const target = getStorage(storage);
  try {
    target.setItem(JOURNAL_KEY, JSON.stringify(journal));
    return true;
  } catch {
    return false;
  }
}

export function resetJournal(storage) {
  const target = getStorage(storage);
  try {
    target.removeItem(JOURNAL_KEY);
    return true;
  } catch {
    return false;
  }
}

export function resetAll(storage) {
  const target = getStorage(storage);
  try {
    target.removeItem(STORAGE_KEY);
    target.removeItem(TEACHERS_KEY);
    target.removeItem(SCHEDULE_KEY);
    target.removeItem(JOURNAL_KEY);
    return true;
  } catch {
    return false;
  }
}
