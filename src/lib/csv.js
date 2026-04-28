import { getStudentStatus, getStatusLabel } from './students.js';

export function escapeCsvCell(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function buildCsvRows(students) {
  return [
    [
      '#',
      'Имя',
      'Телефон',
      'Курсы',
      'Март (сом)',
      'Способ (март)',
      'Апрель (сом)',
      'Способ (апрель)',
      'Статус',
      'Дней посещено',
      'Дней пропущено',
      'Примечание',
    ],
    ...students.map((student, index) => {
      const att = student.attendance || {};
      const presentDays = Object.values(att).filter((s) => s === 'present').length;
      const absentDays = Object.values(att).filter((s) => s === 'absent').length;
      return [
        index + 1,
        student.name,
        student.phone,
        student.courses.join(', '),
        student.payments.march || 0,
        student.payments.marchMethod,
        student.payments.april || 0,
        student.payments.aprilMethod,
        getStatusLabel(getStudentStatus(student)),
        presentDays,
        absentDays,
        student.note,
      ];
    }),
  ];
}

export function studentsToCsv(students) {
  return buildCsvRows(students)
    .map((row) => row.map(escapeCsvCell).join(','))
    .join('\n');
}

export function downloadCsv(students, filename = 'students-payments-demo.csv') {
  const blob = new Blob([`\uFEFF${studentsToCsv(students)}`], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
