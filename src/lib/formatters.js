export function formatMoney(value, { emptyDash = false } = {}) {
  const amount = Number(value) || 0;

  if (emptyDash && amount === 0) {
    return '—';
  }

  return `${amount.toLocaleString('ru-RU')} сом`;
}

export function formatPhone(value) {
  const digits = String(value ?? '').replace(/\D/g, '');

  if (!digits) {
    return '—';
  }

  if (digits.length === 9) {
    return `+996 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }

  if (digits.length === 12 && digits.startsWith('996')) {
    return `+996 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }

  return digits;
}

export function normalizePhone(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 12);
}

export function getInitials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase();
}
