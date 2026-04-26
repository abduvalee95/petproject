import { COURSE_THEME } from '../lib/constants.js';
import { formatMoney, formatPhone, getInitials } from '../lib/formatters.js';
import { getStatusLabel, getStudentStatus } from '../lib/students.js';

export function renderStudentModal(node, student) {
  const status = getStudentStatus(student);
  const total = (Number(student.payments.march) || 0) + (Number(student.payments.april) || 0);

  node.innerHTML = `
    <div class="detail-avatar">${getInitials(student.name)}</div>
    <div class="detail-header">
      <h4>${student.name}</h4>
      <p class="mono">${formatPhone(student.phone)}</p>
    </div>

    <div class="detail-courses">
      ${student.courses.map(renderCourseBadge).join('')}
      <span class="badge badge--${statusTone(status)}">${getStatusLabel(status)}</span>
    </div>

    ${
      student.note
        ? `<div class="note-box"><strong>Примечание:</strong> ${student.note}</div>`
        : ''
    }

    <div class="pay-row">
      <span class="pay-month">Март</span>
      <div class="pay-meta">
        ${renderMethod(student.payments.marchMethod)}
        <strong class="mono">${formatMoney(student.payments.march, { emptyDash: true })}</strong>
      </div>
    </div>

    <div class="pay-row">
      <span class="pay-month">Апрель</span>
      <div class="pay-meta">
        ${renderMethod(student.payments.aprilMethod)}
        <strong class="mono">${formatMoney(student.payments.april, { emptyDash: true })}</strong>
      </div>
    </div>

    <div class="total-row">
      <span>Итого оплачено</span>
      <strong class="mono">${formatMoney(total)}</strong>
    </div>
  `;
}

function renderCourseBadge(course) {
  const tone = COURSE_THEME[course] ?? 'gray';
  return `<span class="badge badge--${tone}">${course === 'En' ? 'En' : course}</span>`;
}

function renderMethod(method) {
  if (method === 'cash') {
    return '<span class="badge badge--green">Наличные</span>';
  }

  if (method === 'bank') {
    return '<span class="badge badge--blue">M-Bank</span>';
  }

  return '<span class="badge badge--gray">—</span>';
}

function statusTone(status) {
  if (status === 'paid') {
    return 'green';
  }

  if (status === 'unpaid') {
    return 'red';
  }

  return 'yellow';
}
