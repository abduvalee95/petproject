import { COURSE_OPTIONS, DAY_ORDER, DAY_OPTIONS } from './constants.js';

export function cloneSchedule(schedule) {
  return schedule.map((entry) => ({ ...entry }));
}

export function validateScheduleEntry(payload) {
  const errors = [];
  if (!payload.day) errors.push('Выберите день недели.');
  if (!payload.time) errors.push('Выберите время занятия.');
  if (!payload.course) errors.push('Выберите курс.');
  if (!payload.teacherId) errors.push('Выберите преподавателя.');
  return errors;
}

export function createScheduleEntry(payload, id = Date.now()) {
  return {
    id,
    day: payload.day,
    time: payload.time,
    course: payload.course,
    teacherId: Number(payload.teacherId),
    room: payload.room?.trim() || '',
  };
}

export function upsertScheduleEntry(schedule, entry) {
  const next = cloneSchedule(schedule);
  const index = next.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    next[index] = { ...entry };
    return next;
  }
  next.push({ ...entry });
  return next;
}

export function deleteScheduleEntry(schedule, entryId) {
  return schedule.filter((e) => e.id !== entryId);
}

export function getScheduleByDay(schedule, day) {
  return schedule
    .filter((e) => e.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));
}

export function getScheduleForToday(schedule) {
  const jsDay = new Date().getDay();
  const dayMap = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun' };
  const today = dayMap[jsDay] || 'mon';
  return getScheduleByDay(schedule, today);
}

export function getDayLabel(dayValue) {
  const found = DAY_OPTIONS.find((d) => d.value === dayValue);
  return found ? found.label : dayValue;
}

export function getScheduleGroupedByDay(schedule) {
  const groups = {};
  DAY_ORDER.forEach((day) => {
    const entries = getScheduleByDay(schedule, day);
    if (entries.length) groups[day] = entries;
  });
  return groups;
}

export function getTeacherName(teachers, teacherId) {
  const teacher = teachers.find((t) => t.id === teacherId);
  return teacher ? teacher.name : '—';
}

export function getCourseLabel(courseValue) {
  const found = COURSE_OPTIONS.find((c) => c.value === courseValue);
  return found ? found.label : courseValue;
}
