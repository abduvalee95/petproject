import { ATTENDANCE_STATUS, COURSE_THEME } from '../lib/constants.js';
import {
  formatDateLabel,
  getAttendanceByCourse,
  getAttendanceForDate,
  getAttendanceStats,
  getRecentDates,
} from '../lib/attendance.js';

export function renderAttendancePage(dom, students, selectedDate) {
  const stats = getAttendanceStats(students, selectedDate);
  const records = getAttendanceForDate(students, selectedDate);
  const byCourse = getAttendanceByCourse(students, selectedDate);
  const recentDates = getRecentDates(7);

  dom.attendanceStats.innerHTML = renderStatsCards(stats, selectedDate);
  dom.attendanceDateNav.innerHTML = renderDateNav(recentDates, selectedDate);
  dom.attendanceCourseSummary.innerHTML = renderCourseSummary(byCourse);
  dom.attendanceBody.innerHTML = records.length
    ? records.map((record, index) => renderRow(record, index)).join('')
    : `<tr><td colspan="4"><div class="empty-state"><h3>Нет учеников</h3><p>Добавьте учеников для отслеживания посещаемости.</p></div></td></tr>`;
}

function renderStatsCards(stats, date) {
  const rate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  return `
    <article class="stat-card stat-card--primary">
      <div class="stat-icon">📋</div>
      <p class="stat-label">Посещаемость</p>
      <p class="stat-value">${rate}%</p>
      <p class="stat-sub">${formatDateLabel(date)}</p>
    </article>
    <article class="stat-card stat-card--success">
      <div class="stat-icon">✅</div>
      <p class="stat-label">Присутствовали</p>
      <p class="stat-value">${stats.present}</p>
      <p class="stat-sub">из ${stats.total} учеников</p>
    </article>
    <article class="stat-card stat-card--danger">
      <div class="stat-icon">❌</div>
      <p class="stat-label">Отсутствовали</p>
      <p class="stat-value">${stats.absent}</p>
      <p class="stat-sub">Уваж. причина: ${stats.excused}</p>
    </article>
    <article class="stat-card stat-card--warning">
      <div class="stat-icon">❓</div>
      <p class="stat-label">Не отмечено</p>
      <p class="stat-value">${stats.unmarked}</p>
      <p class="stat-sub">Нажмите на кнопку в строке</p>
    </article>
  `;
}

function renderDateNav(dates, selectedDate) {
  return dates
    .map(
      (date) => `
      <button
        type="button"
        class="date-chip ${date === selectedDate ? 'date-chip--active' : ''}"
        data-attendance-date="${date}"
      >
        ${formatDateLabel(date)}
      </button>
    `,
    )
    .join('');
}

function renderCourseSummary(byCourse) {
  const entries = Object.entries(byCourse);
  if (!entries.length) return '';

  return entries
    .map(([course, data]) => {
      const rate = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
      const theme = COURSE_THEME[course] ?? 'gray';
      return `
        <div class="course-attendance-item">
          <span class="badge badge--${theme}">${course === 'En' ? 'En' : course}</span>
          <div class="course-attendance-bar">
            <div class="progress-bar">
              <div class="progress-fill progress-fill--${theme}" style="width: ${rate}%"></div>
            </div>
          </div>
          <span class="course-attendance-rate">${rate}% (${data.present}/${data.total})</span>
        </div>
      `;
    })
    .join('');
}

function renderRow(record, index) {
  const statusBadge = record.status
    ? `<span class="att-badge att-badge--${record.status}">${ATTENDANCE_STATUS[record.status]}</span>`
    : '<span class="att-badge att-badge--none">Не отмечено</span>';

  const courseBadges = record.courses
    .flatMap((c) => c.split(',').map((p) => p.trim()))
    .map((c) => {
      const theme = COURSE_THEME[c] ?? 'gray';
      return `<span class="badge badge--${theme}">${c === 'En' ? 'En' : c}</span>`;
    })
    .join('');

  return `
    <tr data-student-id="${record.id}">
      <td>${index + 1}</td>
      <td><strong>${record.name}</strong></td>
      <td>${courseBadges}</td>
      <td>
        <div class="att-actions">
          ${statusBadge}
          <div class="att-btn-group">
            <button type="button" class="att-btn att-btn--present ${record.status === 'present' ? 'is-selected' : ''}" data-attendance="present" data-student-id="${record.id}" title="Присутствовал">✓</button>
            <button type="button" class="att-btn att-btn--absent ${record.status === 'absent' ? 'is-selected' : ''}" data-attendance="absent" data-student-id="${record.id}" title="Отсутствовал">✗</button>
            <button type="button" class="att-btn att-btn--excused ${record.status === 'excused' ? 'is-selected' : ''}" data-attendance="excused" data-student-id="${record.id}" title="Уваж. причина">!</button>
          </div>
        </div>
      </td>
    </tr>
  `;
}
