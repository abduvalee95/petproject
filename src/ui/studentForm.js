import { METHOD_OPTIONS } from '../lib/constants.js';

export function readStudentForm(form) {
  const formData = new FormData(form);

  return {
    name: formData.get('name') ?? '',
    phone: formData.get('phone') ?? '',
    courses: formData.getAll('courses'),
    march: formData.get('march') ?? 0,
    april: formData.get('april') ?? 0,
    marchMethod: formData.get('marchMethod') ?? METHOD_OPTIONS[0].value,
    aprilMethod: formData.get('aprilMethod') ?? METHOD_OPTIONS[0].value,
    note: formData.get('note') ?? '',
  };
}

export function fillStudentForm(form, student) {
  form.elements.name.value = student.name;
  form.elements.phone.value = student.phone;
  form.elements.march.value = student.payments.march || '';
  form.elements.april.value = student.payments.april || '';
  form.elements.note.value = student.note;

  Array.from(form.elements.courses).forEach((input) => {
    input.checked = student.courses.includes(input.value);
  });

  checkRadio(form.elements.marchMethod, student.payments.marchMethod || 'cash');
  checkRadio(form.elements.aprilMethod, student.payments.aprilMethod || 'cash');
}

export function clearStudentForm(form) {
  form.reset();
  checkRadio(form.elements.marchMethod, 'cash');
  checkRadio(form.elements.aprilMethod, 'cash');
}

export function setFormMode(dom, mode = 'create') {
  const isEdit = mode === 'edit';
  dom.formTitle.textContent = isEdit ? 'Редактировать ученика' : 'Добавить ученика';
  dom.formHint.textContent = isEdit
    ? 'Изменения сохраняются локально и сразу попадают в таблицу.'
    : 'Запись сохраняется только в localStorage этого браузера.';
  dom.submitButton.textContent = isEdit ? 'Сохранить изменения' : 'Сохранить ученика';
}

function checkRadio(nodeList, value) {
  Array.from(nodeList).forEach((input) => {
    input.checked = input.value === value;
  });
}
