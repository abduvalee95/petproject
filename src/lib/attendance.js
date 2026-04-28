import { COURSE_OPTIONS } from './constants.js';

export function setAttendance(students, studentId, date, status) {
  return students.map((student) => {
    if (student.id !== studentId) {
      return student;
    }

    const attendance = { ...(student.attendance || {}) };

    if (status === '') {
      delete attendance[date];
    } else {
      attendance[date] = status;
    }

    return { ...student, attendance };
  });
}

export function getAttendanceForDate(students, date) {
  return students.map((student) => {
    const attendance = student.attendance || {};
    return {
      id: student.id,
      name: student.name,
      courses: student.courses,
      status: attendance[date] || '',
    };
  });
}

export function getAttendanceStats(students, date) {
  const records = getAttendanceForDate(students, date);
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const excused = records.filter((r) => r.status === 'excused').length;
  const unmarked = total - present - absent - excused;

  return { total, present, absent, excused, unmarked };
}

export function getAttendanceByCourse(students, date) {
  const records = getAttendanceForDate(students, date);
  const result = Object.fromEntries(COURSE_OPTIONS.map(({ value }) => [value, { total: 0, present: 0 }]));

  records.forEach((record) => {
    const courses = record.courses.flatMap((c) => c.split(',').map((p) => p.trim()));
    courses.forEach((course) => {
      if (result[course] !== undefined) {
        result[course].total += 1;
        if (record.status === 'present') {
          result[course].present += 1;
        }
      }
    });
  });

  return result;
}

export function getStudentAttendanceHistory(student) {
  const attendance = student.attendance || {};
  return Object.entries(attendance)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, status]) => ({ date, status }));
}

export function getAttendanceRate(students, date) {
  const stats = getAttendanceStats(students, date);
  if (stats.total === 0) return 0;
  return Math.round((stats.present / stats.total) * 100);
}

export function getRecentDates(count = 7) {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates.reverse();
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateLabel(dateStr) {
  const [year, month, day] = dateStr.split('-');
  const months = [
    '', 'янв', 'фев', 'мар', 'апр', 'май', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек',
  ];
  return `${Number(day)} ${months[Number(month)]} ${year}`;
}
