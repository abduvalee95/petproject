import test from 'node:test';
import assert from 'node:assert/strict';

import { STORAGE_KEY } from '../src/lib/constants.js';
import { loadStudents, resetStudents, saveStudents } from '../src/lib/storage.js';

const fallback = [
  {
    id: 7,
    name: 'Fallback',
    phone: '',
    courses: ['IT'],
    note: '',
    payments: { march: 0, april: 0, marchMethod: '', aprilMethod: '' },
  },
];

function createStorage(initialState = {}) {
  const state = new Map(Object.entries(initialState));

  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
    removeItem(key) {
      state.delete(key);
    },
  };
}

test('loads fallback data when storage is empty', () => {
  const students = loadStudents(fallback, createStorage());
  assert.deepEqual(students, fallback);
  assert.notEqual(students, fallback);
});

test('loads fallback data when storage payload is broken', () => {
  const storage = createStorage({ [STORAGE_KEY]: '{bad json}' });
  assert.deepEqual(loadStudents(fallback, storage), fallback);
});

test('saves and resets students using the configured key', () => {
  const storage = createStorage();
  const ok = saveStudents(fallback, storage);

  assert.equal(ok, true);
  assert.match(storage.getItem(STORAGE_KEY), /Fallback/);

  assert.equal(resetStudents(storage), true);
  assert.equal(storage.getItem(STORAGE_KEY), null);
});
