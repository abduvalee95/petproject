export function cloneJournal(journal) {
  return journal.map((entry) => ({
    ...entry,
    grades: { ...(entry.grades || {}) },
  }));
}

export function createJournalEntry(payload, id = Date.now()) {
  return {
    id,
    date: payload.date,
    scheduleId: Number(payload.scheduleId),
    topic: payload.topic?.trim() || '',
    homework: payload.homework?.trim() || '',
    grades: { ...(payload.grades || {}) },
    note: payload.note?.trim() || '',
  };
}

export function upsertJournalEntry(journal, entry) {
  const next = cloneJournal(journal);
  const index = next.findIndex((e) => e.id === entry.id);
  if (index >= 0) {
    next[index] = { ...entry, grades: { ...entry.grades } };
    return next;
  }
  next.push({ ...entry, grades: { ...entry.grades } });
  return next;
}

export function getJournalForDate(journal, date) {
  return journal
    .filter((e) => e.date === date)
    .sort((a, b) => String(a.scheduleId).localeCompare(String(b.scheduleId)));
}

export function getJournalForSchedule(journal, scheduleId) {
  return journal
    .filter((e) => e.scheduleId === scheduleId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function setGrade(journal, entryId, studentId, grade) {
  return journal.map((entry) => {
    if (entry.id !== entryId) return entry;
    const grades = { ...(entry.grades || {}) };
    if (grade === '' || grade === null || grade === undefined) {
      delete grades[studentId];
    } else {
      grades[studentId] = grade;
    }
    return { ...entry, grades };
  });
}

export function validateJournalEntry(payload) {
  const errors = [];
  if (!payload.date) errors.push('Выберите дату.');
  if (!payload.scheduleId) errors.push('Выберите занятие.');
  return errors;
}
