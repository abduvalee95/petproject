export const STORAGE_KEY = 'edu-pay-crm:v1';
export const PER_PAGE = 10;
export const ROUTES = ['dashboard', 'students', 'report', 'add'];

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
