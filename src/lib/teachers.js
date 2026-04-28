import { COURSE_OPTIONS } from './constants.js';
import { normalizePhone } from './formatters.js';

export function cloneTeacher(teacher) {
  return { ...teacher, courses: [...teacher.courses] };
}

export function cloneTeachers(teachers) {
  return teachers.map(cloneTeacher);
}

export function validateTeacher(payload) {
  const errors = [];
  if (!payload.name.trim()) {
    errors.push('Введите имя преподавателя.');
  }
  if (payload.name.trim().length > 80) {
    errors.push('Имя должно быть короче 80 символов.');
  }
  if (!payload.courses.length) {
    errors.push('Выберите хотя бы один курс.');
  }
  return errors;
}

export function createTeacherFromForm(payload, id = Date.now()) {
  return {
    id,
    name: payload.name.trim(),
    phone: normalizePhone(payload.phone),
    courses: [...payload.courses],
    note: payload.note.trim(),
  };
}

export function upsertTeacher(teachers, teacher) {
  const next = cloneTeachers(teachers);
  const index = next.findIndex((t) => t.id === teacher.id);
  if (index >= 0) {
    next[index] = cloneTeacher(teacher);
    return next;
  }
  next.push(cloneTeacher(teacher));
  return next;
}

export function filterTeachers(teachers, { query = '', course = '' } = {}) {
  const lowered = query.trim().toLowerCase();
  return teachers.filter((t) => {
    const matchesQuery = !lowered || t.name.toLowerCase().includes(lowered);
    const matchesCourse = !course || t.courses.some((c) => {
      const parts = c.split(',').map((p) => p.trim());
      return parts.includes(course);
    });
    return matchesQuery && matchesCourse;
  });
}

export function getTeacherCourseCounts(teachers) {
  const counts = Object.fromEntries(COURSE_OPTIONS.map(({ value }) => [value, 0]));
  teachers.forEach((t) => {
    t.courses.forEach((courseEntry) => {
      const parts = courseEntry.split(',').map((p) => p.trim());
      parts.forEach((course) => {
        if (counts[course] !== undefined) counts[course] += 1;
      });
    });
  });
  return counts;
}
