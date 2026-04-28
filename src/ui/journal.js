import { COURSE_THEME } from '../lib/constants.js';
import { formatDateLabel } from '../lib/attendance.js';
import { getDayLabel, getCourseLabel, getTeacherName } from '../lib/schedule.js';

export function renderJournalPage(dom, journal, schedule, teachers, students, selectedDate) {
  const dayEntries = journal.filter((e) => e.date === selectedDate);
  const todaySchedule = getScheduleForDate(schedule, selectedDate);

  dom.journalDateNav.innerHTML = renderDateNav(selectedDate);
  dom.journalStats.innerHTML = renderStats(dayEntries, todaySchedule);
  dom.journalBody.innerHTML = todaySchedule.length
    ? todaySchedule.map((slot) => renderSlot(slot, dayEntries, teachers, students, selectedDate)).join('')
    : `<div class="empty-state"><h3>Нет занятий</h3><p>На эту дату нет запланированных занятий.</p></div>`;
}

function getScheduleForDate(schedule, dateStr) {
  const d = new Date(dateStr);
  const jsDay = d.getDay();
  const dayMap = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 0: 'sun' };
  const day = dayMap[jsDay] || 'mon';
  return schedule
    .filter((e) => e.day === day)
    .sort((a, b) => a.time.localeCompare(b.time));
}

function renderDateNav(selectedDate) {
  const dates = [];
  const today = new Date();
  for (let i = -3; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    dates.push(str);
  }

  return dates
    .map((date) => `
      <button
        type="button"
        class="date-chip ${date === selectedDate ? 'date-chip--active' : ''}"
        data-journal-date="${date}"
      >
        ${formatDateLabel(date)}
      </button>
    `)
    .join('');
}

function renderStats(dayEntries, todaySchedule) {
  const filled = dayEntries.length;
  const total = todaySchedule.length;
  return `
    <article class="stat-card stat-card--primary">
      <div class="stat-icon">📓</div>
      <p class="stat-label">Журнал</p>
      <p class="stat-value">${filled}/${total}</p>
      <p class="stat-sub">Записей заполнено</p>
    </article>
    <article class="stat-card stat-card--success">
      <div class="stat-icon">✅</div>
      <p class="stat-label">Занятий сегодня</p>
      <p class="stat-value">${total}</p>
      <p class="stat-sub">По расписанию</p>
    </article>
  `;
}

function renderSlot(slot, dayEntries, teachers, students, selectedDate) {
  const entry = dayEntries.find((e) => e.scheduleId === slot.id);
  const theme = COURSE_THEME[slot.course] ?? 'gray';
  const courseLabel = slot.course === 'En' ? 'En' : getCourseLabel(slot.course);
  const teacherName = getTeacherName(teachers, slot.teacherId);

  const topic = entry?.topic || '';
  const homework = entry?.homework || '';
  const grades = entry?.grades || {};
  const note = entry?.note || '';
  const entryId = entry?.id || '';

  const studentRows = students
    .filter((s) => {
      return s.courses.some((c) => {
        const parts = c.split(',').map((p) => p.trim());
        return parts.includes(slot.course);
      });
    })
    .slice(0, 15)
    .map((student) => {
      const grade = grades[String(student.id)] || '';
      return `
        <tr data-student-id="${student.id}">
          <td>${student.name}</td>
          <td>
            <input
              type="text"
              class="grade-input"
              value="${grade}"
              data-grade-student="${student.id}"
              data-grade-entry="${entryId}"
              data-schedule-id="${slot.id}"
              placeholder="—"
              maxlength="5"
            />
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <div class="journal-slot" data-schedule-id="${slot.id}">
      <div class="journal-slot-header">
        <div class="journal-slot-info">
          <span class="schedule-time">${slot.time}</span>
          <span class="badge badge--${theme}">${courseLabel}</span>
          <span class="schedule-teacher">${teacherName}</span>
          ${slot.room ? `<span class="schedule-room">Каб. ${slot.room}</span>` : ''}
        </div>
      </div>
      <div class="journal-slot-body">
        <div class="journal-fields">
          <div class="form-group">
            <label class="form-label">Тема урока</label>
            <input class="form-input" type="text" name="topic" value="${topic}" data-journal-field="topic" data-schedule-id="${slot.id}" data-entry-id="${entryId}" data-date="${selectedDate}" placeholder="Тема урока" />
          </div>
          <div class="form-group">
            <label class="form-label">Домашнее задание</label>
            <input class="form-input" type="text" name="homework" value="${homework}" data-journal-field="homework" data-schedule-id="${slot.id}" data-entry-id="${entryId}" data-date="${selectedDate}" placeholder="Домашнее задание" />
          </div>
          <div class="form-group form-group--full">
            <label class="form-label">Примечание</label>
            <input class="form-input" type="text" name="note" value="${note}" data-journal-field="note" data-schedule-id="${slot.id}" data-entry-id="${entryId}" data-date="${selectedDate}" placeholder="Примечание к занятию" />
          </div>
        </div>
        ${studentRows ? `
          <div class="journal-grades">
            <table class="data-table">
              <thead>
                <tr><th>Ученик</th><th>Оценка</th></tr>
              </thead>
              <tbody>${studentRows}</tbody>
            </table>
          </div>
        ` : ''}
        <div class="journal-slot-actions">
          <button type="button" class="btn btn-primary btn-sm" data-action="save-journal" data-schedule-id="${slot.id}" data-entry-id="${entryId}" data-date="${selectedDate}">Сохранить</button>
        </div>
      </div>
    </div>
  `;
}
