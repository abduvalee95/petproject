import { COURSE_THEME, PER_PAGE } from '../lib/constants.js';
import { formatMoney, formatPhone } from '../lib/formatters.js';
import { getStatusLabel, getStudentStatus, paginateItems } from '../lib/students.js';

export function renderStudentsTable(dom, students, currentPage, sortState, totalStudents) {
  const { pageItems, totalPages, start, currentPage: safePage } = paginateItems(
    students,
    currentPage,
    PER_PAGE,
  );

  dom.studentCount.textContent = `Показано ${students.length} из ${totalStudents} учеников`;
  dom.studentsBody.innerHTML = pageItems.length
    ? pageItems
        .map(
          (student, index) => `
            <tr tabindex="0" data-student-id="${student.id}">
              <td>${start + index + 1}</td>
              <td>
                <div class="name-cell">
                  <strong>${student.name}</strong>
                  ${student.note ? '<span class="note-dot" aria-hidden="true">●</span>' : ''}
                </div>
              </td>
              <td class="mono">${formatPhone(student.phone)}</td>
              <td>${student.courses.flatMap((c) => c.split(',').map((p) => p.trim())).map(renderCourseBadge).join('')}</td>
              <td class="mono align-right">${formatMoney(student.payments.march, { emptyDash: true })}</td>
              <td>${renderMethodBadge(student.payments.marchMethod)}</td>
              <td class="mono align-right">${formatMoney(student.payments.april, { emptyDash: true })}</td>
              <td>${renderMethodBadge(student.payments.aprilMethod)}</td>
              <td>${renderStatusBadge(getStudentStatus(student))}</td>
            </tr>
          `,
        )
        .join('')
    : `
        <tr>
          <td colspan="9">
            <div class="empty-state">
              <h3>Ничего не найдено</h3>
              <p>Измените фильтры или добавьте нового ученика.</p>
            </div>
          </td>
        </tr>
      `;

  syncSortIndicators(dom.sortButtons, sortState);
  renderPagination(dom.pagination, safePage, totalPages);

  return { currentPage: safePage, totalPages };
}

function renderCourseBadge(course) {
  const theme = COURSE_THEME[course] ?? 'gray';
  const label = course === 'En' ? 'En' : course;
  return `<span class="badge badge--${theme}">${label}</span>`;
}

function renderMethodBadge(method) {
  if (method === 'cash') {
    return '<span class="badge badge--green">Наличные</span>';
  }

  if (method === 'bank') {
    return '<span class="badge badge--blue">M-Bank</span>';
  }

  return '<span class="badge badge--gray">—</span>';
}

function renderStatusBadge(status) {
  const tone = {
    paid: 'green',
    partial: 'yellow',
    unpaid: 'red',
  }[status];

  return `<span class="badge badge--${tone}">${getStatusLabel(status)}</span>`;
}

function syncSortIndicators(buttons, sortState) {
  buttons.forEach((button) => {
    const isActive = button.dataset.sort === sortState.key;
    button.classList.toggle('is-active', isActive);
    button.dataset.direction = isActive ? sortState.direction : '';
  });
}

function renderPagination(node, currentPage, totalPages) {
  if (totalPages <= 1) {
    node.innerHTML = '';
    return;
  }

  const pages = [];
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  for (let page = startPage; page <= endPage; page += 1) {
    pages.push(
      `<button type="button" class="page-btn ${
        page === currentPage ? 'active' : ''
      }" data-page="${page}">${page}</button>`,
    );
  }

  node.innerHTML = `
    <span class="page-info">Страница ${currentPage} из ${totalPages}</span>
    <div class="page-btns">
      <button type="button" class="page-btn" data-page="${
        currentPage - 1
      }" ${currentPage === 1 ? 'disabled' : ''}>‹</button>
      ${pages.join('')}
      <button type="button" class="page-btn" data-page="${
        currentPage + 1
      }" ${currentPage === totalPages ? 'disabled' : ''}>›</button>
    </div>
  `;
}
