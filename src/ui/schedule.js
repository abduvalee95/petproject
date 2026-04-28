import { COURSE_THEME, DAY_ORDER } from '../lib/constants.js';
import { getDayLabel, getCourseLabel, getTeacherName } from '../lib/schedule.js';

export function renderSchedulePage(dom, schedule, teachers) {
  const grouped = {};
  DAY_ORDER.forEach((day) => {
    const entries = schedule
      .filter((e) => e.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
    if (entries.length) grouped[day] = entries;
  });

  dom.scheduleBody.innerHTML = Object.keys(grouped).length
    ? Object.entries(grouped)
        .map(([day, entries]) => renderDayGroup(day, entries, teachers))
        .join('')
    : `<div class="empty-state"><h3>Нет занятий</h3><p>Добавьте расписание занятий.</p></div>`;

  dom.todaySchedule.innerHTML = renderTodaySchedule(schedule, teachers);
}

function renderDayGroup(day, entries, teachers) {
  const rows = entries
    .map((entry) => renderEntryRow(entry, teachers))
    .join('');

  return `
    <div class="schedule-day-group">
      <div class="schedule-day-header">
        <h3>${getDayLabel(day)}</h3>
        <span class="badge badge--gray">${entries.length} зан.</span>
      </div>
      <div class="schedule-entries">${rows}</div>
    </div>
  `;
}

function renderEntryRow(entry, teachers) {
  const theme = COURSE_THEME[entry.course] ?? 'gray';
  const courseLabel = entry.course === 'En' ? 'En' : getCourseLabel(entry.course);

  return `
    <div class="schedule-entry" data-schedule-id="${entry.id}">
      <div class="schedule-time">${entry.time}</div>
      <span class="badge badge--${theme}">${courseLabel}</span>
      <span class="schedule-teacher">${getTeacherName(teachers, entry.teacherId)}</span>
      ${entry.room ? `<span class="schedule-room">Каб. ${entry.room}</span>` : ''}
      <div class="row-actions">
        <button type="button" class="att-btn" data-action="edit-schedule" data-schedule-id="${entry.id}" title="Редактировать">✎</button>
        <button type="button" class="att-btn att-btn--absent" data-action="delete-schedule" data-schedule-id="${entry.id}" title="Удалить">✗</button>
      </div>
    </div>
  `;
}

function renderTodaySchedule(schedule, teachers) {
  const jsDay = new Date().getDay();
  const dayMap = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun' };
  const today = dayMap[jsDay] || 'mon';
  const entries = schedule
    .filter((e) => e.day === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (!entries.length) {
    return '<p class="schedule-empty-today">Сегодня нет занятий</p>';
  }

  return entries
    .map((entry) => {
      const theme = COURSE_THEME[entry.course] ?? 'gray';
      const courseLabel = entry.course === 'En' ? 'En' : getCourseLabel(entry.course);
      return `
        <div class="today-entry">
          <span class="today-time">${entry.time}</span>
          <span class="badge badge--${theme}">${courseLabel}</span>
          <span class="today-teacher">${getTeacherName(teachers, entry.teacherId)}</span>
        </div>
      `;
    })
    .join('');
}
