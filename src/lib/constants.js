export const STORAGE_KEY = 'edu-pay-crm:v1';
export const TEACHERS_KEY = 'edu-crm-teachers:v1';
export const SCHEDULE_KEY = 'edu-crm-schedule:v1';
export const JOURNAL_KEY = 'edu-crm-journal:v1';
export const PER_PAGE = 10;
export const ROUTES = ['dashboard', 'students', 'attendance', 'teachers', 'schedule', 'journal', 'report', 'add'];

export const ATTENDANCE_STATUS = {
  present: 'Присутствовал',
  absent: 'Отсутствовал',
  excused: 'Уваж. причина',
};

export const COURSE_OPTIONS = [
  { value: 'IT', label: 'IT' },
  { value: 'Kids', label: 'Kids' },
  { value: 'En', label: 'Английский' },
];

export const METHOD_OPTIONS = [
  { value: 'cash', label: 'Наличные' },
  { value: 'bank', label: 'M-Bank' },
];

export const STATUS_LABELS = {
  paid: 'Оплатил',
  partial: 'Частично',
  unpaid: 'Не оплатил',
};

export const COURSE_THEME = {
  IT: 'blue',
  Kids: 'purple',
  En: 'cyan',
};

export const DAY_OPTIONS = [
  { value: 'mon', label: 'Понедельник' },
  { value: 'tue', label: 'Вторник' },
  { value: 'wed', label: 'Среда' },
  { value: 'thu', label: 'Четверг' },
  { value: 'fri', label: 'Пятница' },
  { value: 'sat', label: 'Суббота' },
  { value: 'sun', label: 'Воскресенье' },
];

export const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

export const LESSON_TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00',
];
