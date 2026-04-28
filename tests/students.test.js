import test from 'node:test';
import assert from 'node:assert/strict';

import { studentsToCsv } from '../src/lib/csv.js';
import { formatMoney, formatPhone } from '../src/lib/formatters.js';
import {
  createStudentFromForm,
  filterStudents,
  getStudentStatus,
  paginateItems,
  sortStudents,
  validateStudent,
} from '../src/lib/students.js';

const students = [
  {
    id: 1,
    name: 'Алина',
    phone: '996700111222',
    courses: ['IT'],
    note: '',
    payments: { march: 6000, april: 6000, marchMethod: 'bank', aprilMethod: 'cash' },
  },
  {
    id: 2,
    name: 'Бекзат',
    phone: '555333444',
    courses: ['Kids', 'En'],
    note: 'Скидка',
    payments: { march: 0, april: 2800, marchMethod: '', aprilMethod: 'bank' },
  },
  {
    id: 3,
    name: 'Вика "Demo"',
    phone: '',
    courses: ['En'],
    note: '',
    payments: { march: 0, april: 0, marchMethod: '', aprilMethod: '' },
  },
];

test('calculates payment status', () => {
  assert.equal(getStudentStatus(students[0]), 'paid');
  assert.equal(getStudentStatus(students[1]), 'partial');
  assert.equal(getStudentStatus(students[2]), 'unpaid');
});

test('filters students by query, course and payment method', () => {
  assert.equal(filterStudents(students, { query: 'бек' }).length, 1);
  assert.equal(filterStudents(students, { course: 'IT' }).length, 1);
  assert.equal(filterStudents(students, { method: 'bank' }).length, 2);
});

test('sorts students by month amount descending', () => {
  const sorted = sortStudents(students, 'march', 'desc');
  assert.deepEqual(
    sorted.map((student) => student.id),
    [1, 2, 3],
  );
});

test('paginates collections safely', () => {
  const meta = paginateItems(students, 3, 2);
  assert.equal(meta.currentPage, 2);
  assert.equal(meta.totalPages, 2);
  assert.equal(meta.pageItems.length, 1);
});

test('validates student payloads', () => {
  const errors = validateStudent({
    name: '',
    phone: '12345',
    courses: [],
    march: -100,
    april: 0,
    marchMethod: 'cash',
    aprilMethod: 'cash',
    note: 'x'.repeat(161),
  });

  assert.deepEqual(errors, [
    'Введите имя ученика.',
    'Телефон должен содержать 9 или 12 цифр.',
    'Выберите хотя бы один курс.',
    'Сумма оплаты не может быть отрицательной.',
    'Примечание должно быть короче 160 символов.',
  ]);
});

test('creates normalized student entities from form payloads', () => {
  const student = createStudentFromForm(
    {
      name: '  Нурлан  ',
      phone: '+996 700 123 123',
      courses: ['IT'],
      march: '5000',
      april: '',
      marchMethod: 'cash',
      aprilMethod: 'bank',
      note: ' test ',
    },
    42,
  );

  assert.deepEqual(student, {
    id: 42,
    name: 'Нурлан',
    phone: '996700123123',
    courses: ['IT'],
    note: 'test',
    payments: { march: 5000, april: 0, marchMethod: 'cash', aprilMethod: '' },
    attendance: {},
  });
});

test('formats money and phone for the UI', () => {
  assert.equal(formatMoney(12300), '12 300 сом');
  assert.equal(formatMoney(0, { emptyDash: true }), '—');
  assert.equal(formatPhone('996700123123'), '+996 700 123 123');
});

test('escapes csv content correctly', () => {
  const csv = studentsToCsv(students);

  assert.match(csv, /"Вика ""Demo"""/);
  assert.match(csv, /"Kids, En"/);
});
