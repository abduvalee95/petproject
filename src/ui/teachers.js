import { COURSE_THEME } from '../lib/constants.js';
import { formatPhone, getInitials } from '../lib/formatters.js';

export function renderTeachersPage(dom, teachers, filters) {
  const filtered = filterTeacherList(teachers, filters);

  dom.teachersBody.innerHTML = filtered.length
    ? filtered.map((teacher, index) => renderRow(teacher, index)).join('')
    : `<tr><td colspan="5"><div class="empty-state"><h3>Не найдено</h3><p>Измените фильтры или добавьте преподавателя.</p></div></td></tr>`;

  dom.teacherCount.textContent = `${filtered.length} преподавателей`;
}

function filterTeacherList(teachers, { query = '', course = '' } = {}) {
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

function renderRow(teacher, index) {
  const courseBadges = teacher.courses
    .flatMap((c) => c.split(',').map((p) => p.trim()))
    .map((c) => {
      const theme = COURSE_THEME[c] ?? 'gray';
      return `<span class="badge badge--${theme}">${c === 'En' ? 'En' : c}</span>`;
    })
    .join('');

  return `
    <tr data-teacher-id="${teacher.id}">
      <td>
        <div class="name-cell">
          <span class="avatar-sm">${getInitials(teacher.name)}</span>
          <strong>${teacher.name}</strong>
        </div>
      </td>
      <td class="mono">${formatPhone(teacher.phone)}</td>
      <td>${courseBadges}</td>
      <td>${teacher.note || '—'}</td>
      <td>
        <div class="row-actions">
          <button type="button" class="att-btn" data-action="edit-teacher" data-teacher-id="${teacher.id}" title="Редактировать">✎</button>
          <button type="button" class="att-btn att-btn--absent" data-action="delete-teacher" data-teacher-id="${teacher.id}" title="Удалить">✗</button>
        </div>
      </td>
    </tr>
  `;
}
