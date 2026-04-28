import { COURSE_OPTIONS, STATUS_LABELS } from './constants.js';
import { normalizePhone } from './formatters.js';

export function cloneStudent(student) {
  return {
    ...student,
    courses: [...student.courses],
    payments: { ...student.payments },
    attendance: student.attendance ? { ...student.attendance } : {},
  };
}

export function cloneStudents(students) {
  return students.map(cloneStudent);
}

export function getStudentStatus(student) {
  const march = Number(student.payments.march) || 0;
  const april = Number(student.payments.april) || 0;

  if (march > 0 && april > 0) {
    return 'paid';
  }

  if (march === 0 && april === 0) {
    return 'unpaid';
  }

  return 'partial';
}

export function getStatusLabel(status) {
  return STATUS_LABELS[status] ?? STATUS_LABELS.partial;
}

export function filterStudents(
  students,
  { query = '', course = '', status = '', method = '' } = {},
) {
  const loweredQuery = query.trim().toLowerCase();
  const digitsQuery = normalizePhone(loweredQuery);

  return students.filter((student) => {
    const matchesQuery =
      !loweredQuery ||
      student.name.toLowerCase().includes(loweredQuery) ||
      (digitsQuery ? normalizePhone(student.phone).includes(digitsQuery) : false);
    const matchesCourse = !course || student.courses.some((c) => {
      const parts = c.split(',').map((p) => p.trim());
      return parts.includes(course);
    });
    const matchesStatus = !status || getStudentStatus(student) === status;
    const matchesMethod =
      !method ||
      student.payments.marchMethod === method ||
      student.payments.aprilMethod === method;

    return matchesQuery && matchesCourse && matchesStatus && matchesMethod;
  });
}

export function sortStudents(students, sortKey, direction = 'asc') {
  const factor = direction === 'desc' ? -1 : 1;
  const sorted = [...students];

  sorted.sort((left, right) => {
    const leftValue = getSortableValue(left, sortKey);
    const rightValue = getSortableValue(right, sortKey);

    if (leftValue < rightValue) {
      return -1 * factor;
    }

    if (leftValue > rightValue) {
      return 1 * factor;
    }

    return 0;
  });

  return sorted;
}

function getSortableValue(student, sortKey) {
  if (sortKey === 'id') {
    return Number(student.id) || 0;
  }

  if (sortKey === 'march' || sortKey === 'april') {
    return Number(student.payments[sortKey]) || 0;
  }

  if (sortKey === 'phone') {
    return normalizePhone(student.phone);
  }

  return String(student[sortKey] ?? '').toLowerCase();
}

export function paginateItems(items, page, perPage) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * perPage;
  const pageItems = items.slice(start, start + perPage);

  return {
    pageItems,
    totalPages,
    currentPage,
    start,
  };
}

export function getCourseCounts(students) {
  const counts = Object.fromEntries(COURSE_OPTIONS.map(({ value }) => [value, 0]));

  students.forEach((student) => {
    student.courses.forEach((courseEntry) => {
      const parts = courseEntry.split(',').map((p) => p.trim());
      parts.forEach((course) => {
        if (counts[course] !== undefined) {
          counts[course] += 1;
        }
      });
    });
  });

  return counts;
}

export function getPaymentMethodCounts(students) {
  return students.reduce(
    (accumulator, student) => {
      if (student.payments.march > 0) {
        accumulator[student.payments.marchMethod || 'unknown'] += 1;
      }

      if (student.payments.april > 0) {
        accumulator[student.payments.aprilMethod || 'unknown'] += 1;
      }

      return accumulator;
    },
    { cash: 0, bank: 0, unknown: 0 },
  );
}

export function getTotals(students) {
  return students.reduce(
    (accumulator, student) => {
      accumulator.march += Number(student.payments.march) || 0;
      accumulator.april += Number(student.payments.april) || 0;
      return accumulator;
    },
    { march: 0, april: 0 },
  );
}

export function getStatusBreakdown(students) {
  return students.reduce(
    (accumulator, student) => {
      accumulator[getStudentStatus(student)] += 1;
      return accumulator;
    },
    { paid: 0, partial: 0, unpaid: 0 },
  );
}

export function getRevenueByCourse(students) {
  const revenue = Object.fromEntries(COURSE_OPTIONS.map(({ value }) => [value, 0]));

  students.forEach((student) => {
    const total = (Number(student.payments.march) || 0) + (Number(student.payments.april) || 0);
    const allCourses = student.courses.flatMap((c) => c.split(',').map((p) => p.trim()));
    const divisor = allCourses.length || 1;

    allCourses.forEach((course) => {
      if (revenue[course] !== undefined) {
        revenue[course] += total / divisor;
      }
    });
  });

  return revenue;
}

export function getPaymentSplit(students) {
  return students.reduce(
    (accumulator, student) => {
      const { march, april, marchMethod, aprilMethod } = student.payments;

      if (marchMethod === 'cash') {
        accumulator.march.cash += Number(march) || 0;
      } else if (marchMethod === 'bank') {
        accumulator.march.bank += Number(march) || 0;
      }

      if (aprilMethod === 'cash') {
        accumulator.april.cash += Number(april) || 0;
      } else if (aprilMethod === 'bank') {
        accumulator.april.bank += Number(april) || 0;
      }

      return accumulator;
    },
    {
      march: { cash: 0, bank: 0 },
      april: { cash: 0, bank: 0 },
    },
  );
}

export function validateStudent(payload) {
  const errors = [];
  const digits = normalizePhone(payload.phone);

  if (!payload.name.trim()) {
    errors.push('Введите имя ученика.');
  }

  if (payload.name.trim().length > 80) {
    errors.push('Имя должно быть короче 80 символов.');
  }

  if (digits && ![9, 12].includes(digits.length)) {
    errors.push('Телефон должен содержать 9 или 12 цифр.');
  }

  if (!payload.courses.length) {
    errors.push('Выберите хотя бы один курс.');
  }

  if ((Number(payload.march) || 0) < 0 || (Number(payload.april) || 0) < 0) {
    errors.push('Сумма оплаты не может быть отрицательной.');
  }

  if (payload.note.trim().length > 160) {
    errors.push('Примечание должно быть короче 160 символов.');
  }

  return errors;
}

export function createStudentFromForm(payload, id = Date.now()) {
  return {
    id,
    name: payload.name.trim(),
    phone: normalizePhone(payload.phone),
    courses: [...payload.courses],
    note: payload.note.trim(),
    payments: {
      march: Math.max(0, Number(payload.march) || 0),
      april: Math.max(0, Number(payload.april) || 0),
      marchMethod: Number(payload.march) > 0 ? payload.marchMethod : '',
      aprilMethod: Number(payload.april) > 0 ? payload.aprilMethod : '',
    },
    attendance: {},
  };
}

export function upsertStudent(students, student) {
  const nextStudents = cloneStudents(students);
  const index = nextStudents.findIndex((entry) => entry.id === student.id);

  if (index >= 0) {
    nextStudents[index] = cloneStudent(student);
    return nextStudents;
  }

  nextStudents.push(cloneStudent(student));
  return nextStudents;
}

export function getDashboardStats(students) {
  const totals = getTotals(students);
  const status = getStatusBreakdown(students);

  return [
    {
      key: 'students',
      label: 'Всего учеников',
      value: String(students.length),
      sub: `Полностью оплатили: ${status.paid}`,
      tone: 'primary',
      icon: '👥',
    },
    {
      key: 'march',
      label: 'Оплата за март',
      value: `${totals.march.toLocaleString('ru-RU')} сом`,
      sub: `Не оплатили: ${students.filter((student) => student.payments.march === 0).length}`,
      tone: 'success',
      icon: '📅',
    },
    {
      key: 'april',
      label: 'Оплата за апрель',
      value: `${totals.april.toLocaleString('ru-RU')} сом`,
      sub: `Не оплатили: ${students.filter((student) => student.payments.april === 0).length}`,
      tone: 'warning',
      icon: '📆',
    },
    {
      key: 'risk',
      label: 'Риск по оплатам',
      value: String(status.unpaid),
      sub: `Частично: ${status.partial}`,
      tone: 'danger',
      icon: '⚠',
    },
  ];
}
