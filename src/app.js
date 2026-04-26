import { demoStudents } from './data/demoStudents.js';
import { downloadCsv } from './lib/csv.js';
import { ROUTES } from './lib/constants.js';
import {
  createStudentFromForm,
  filterStudents,
  sortStudents,
  upsertStudent,
  validateStudent,
} from './lib/students.js';
import { loadStudents, resetStudents, saveStudents } from './lib/storage.js';
import { renderDashboard } from './ui/dashboard.js';
import { renderStudentModal } from './ui/modal.js';
import { renderReports } from './ui/reports.js';
import { createShell } from './ui/shell.js';
import { clearStudentForm, fillStudentForm, readStudentForm, setFormMode } from './ui/studentForm.js';
import { renderStudentsTable } from './ui/studentsTable.js';
import { showToast } from './ui/toast.js';

export function createApp(root) {
  return new App(root);
}

class App {
  constructor(root) {
    this.root = root;
    this.students = loadStudents(demoStudents);
    this.filteredStudents = [...this.students];
    this.filters = { query: '', course: '', status: '', method: '' };
    this.sortState = { key: 'name', direction: 'asc' };
    this.currentPage = 1;
    this.activeRoute = 'dashboard';
    this.editingId = null;
    this.modalStudentId = null;
    this.lastFocusedElement = null;
  }

  init() {
    this.root.innerHTML = createShell();
    this.cacheDom();
    this.bindEvents();
    this.syncFromHash();
    this.render();
  }

  cacheDom() {
    this.dom = {
      sidebar: document.querySelector('#sidebar'),
      sidebarOverlay: document.querySelector('#sidebarOverlay'),
      navItems: Array.from(document.querySelectorAll('[data-route]')),
      pages: Array.from(document.querySelectorAll('[data-page]')),
      searchInput: document.querySelector('#searchInput'),
      courseFilter: document.querySelector('#courseFilter'),
      statusFilter: document.querySelector('#statusFilter'),
      methodFilter: document.querySelector('#methodFilter'),
      studentCount: document.querySelector('#studentCount'),
      studentsBody: document.querySelector('#studentsBody'),
      pagination: document.querySelector('#pagination'),
      sortButtons: Array.from(document.querySelectorAll('[data-sort]')),
      form: document.querySelector('#studentForm'),
      formTitle: document.querySelector('#formTitle'),
      formHint: document.querySelector('#formHint'),
      submitButton: document.querySelector('#submitButton'),
      statsGrid: document.querySelector('#statsGrid'),
      courseChart: document.querySelector('#courseChart'),
      methodChart: document.querySelector('#methodChart'),
      monthChart: document.querySelector('#monthChart'),
      reportGrid: document.querySelector('#reportGrid'),
      courseRevenueChart: document.querySelector('#courseRevenueChart'),
      comparisonChart: document.querySelector('#comparisonChart'),
      modal: document.querySelector('#studentModal'),
      modalBody: document.querySelector('#modalBody'),
      toastContainer: document.querySelector('#toastContainer'),
      sidebarToggle: document.querySelector('[data-action="toggle-sidebar"]'),
    };
  }

  bindEvents() {
    this.root.addEventListener('click', (event) => this.handleClick(event));
    this.root.addEventListener('keydown', (event) => this.handleRowKeyboard(event));
    this.dom.searchInput.addEventListener('input', () => this.updateFilters(true));
    this.dom.courseFilter.addEventListener('change', () => this.updateFilters(true));
    this.dom.statusFilter.addEventListener('change', () => this.updateFilters(true));
    this.dom.methodFilter.addEventListener('change', () => this.updateFilters(true));
    this.dom.form.addEventListener('submit', (event) => this.handleSubmit(event));
    window.addEventListener('hashchange', () => this.syncFromHash());
    window.addEventListener('keydown', (event) => this.handleGlobalKeydown(event));
  }

  handleClick(event) {
    if (event.target === this.dom.modal) {
      this.closeModal();
      return;
    }

    const routeTrigger = event.target.closest('[data-route]');
    const actionTrigger = event.target.closest('[data-action]');
    const sortTrigger = event.target.closest('[data-sort]');
    const pageTrigger = event.target.closest('[data-page]');
    const rowTrigger = event.target.closest('[data-student-id]');

    if (routeTrigger) {
      this.setRoute(routeTrigger.dataset.route);
      return;
    }

    if (actionTrigger) {
      this.handleAction(actionTrigger.dataset.action, actionTrigger);
      return;
    }

    if (sortTrigger) {
      this.toggleSort(sortTrigger.dataset.sort);
      return;
    }

    if (pageTrigger && pageTrigger.closest('.pagination')) {
      this.currentPage = Number(pageTrigger.dataset.page) || 1;
      this.renderStudents();
      return;
    }

    if (rowTrigger && rowTrigger.closest('#studentsBody')) {
      this.openModal(Number(rowTrigger.dataset.studentId), rowTrigger);
    }
  }

  handleAction(action, trigger) {
    if (action === 'toggle-sidebar') {
      this.toggleSidebar();
      return;
    }

    if (action === 'close-sidebar') {
      this.closeSidebar();
      return;
    }

    if (action === 'open-add') {
      this.startCreateFlow();
      return;
    }

    if (action === 'reset-data') {
      this.resetDemoData();
      return;
    }

    if (action === 'export-csv') {
      downloadCsv(this.students);
      this.toast('CSV файл готов.', 'success');
      return;
    }

    if (action === 'clear-form') {
      this.editingId = null;
      clearStudentForm(this.dom.form);
      setFormMode(this.dom, 'create');
      return;
    }

    if (action === 'close-modal') {
      this.closeModal();
      return;
    }

    if (action === 'edit-student') {
      if (this.modalStudentId) {
        this.startEditFlow(this.modalStudentId);
      }
      return;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const payload = readStudentForm(this.dom.form);
    const errors = validateStudent(payload);

    if (errors.length) {
      this.toast(errors[0], 'error');
      return;
    }

    const id = this.editingId ?? Date.now();
    const student = createStudentFromForm(payload, id);
    const isEdit = Boolean(this.editingId);

    this.students = upsertStudent(this.students, student);
    saveStudents(this.students);

    this.editingId = null;
    clearStudentForm(this.dom.form);
    setFormMode(this.dom, 'create');
    this.updateFilters(true);
    this.setRoute('students');
    this.toast(isEdit ? 'Запись обновлена.' : 'Ученик добавлен.', 'success');
  }

  handleGlobalKeydown(event) {
    if (event.key === 'Escape') {
      if (!this.dom.modal.classList.contains('hidden')) {
        this.closeModal();
        return;
      }

      this.closeSidebar();
    }
  }

  handleRowKeyboard(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    const row = event.target.closest('[data-student-id]');

    if (!row) {
      return;
    }

    event.preventDefault();
    this.openModal(Number(row.dataset.studentId), row);
  }

  syncFromHash() {
    const route = window.location.hash.replace('#', '');
    this.activeRoute = ROUTES.includes(route) ? route : 'dashboard';

    if (!ROUTES.includes(route)) {
      window.location.hash = '#dashboard';
      return;
    }

    this.render();
  }

  setRoute(route) {
    if (route === 'add' && this.editingId === null) {
      setFormMode(this.dom, 'create');
    }

    window.location.hash = `#${route}`;
  }

  updateFilters(resetPage = false) {
    this.filters = {
      query: this.dom.searchInput.value,
      course: this.dom.courseFilter.value,
      status: this.dom.statusFilter.value,
      method: this.dom.methodFilter.value,
    };

    if (resetPage) {
      this.currentPage = 1;
    }

    const filtered = filterStudents(this.students, this.filters);
    this.filteredStudents = sortStudents(filtered, this.sortState.key, this.sortState.direction);
    this.renderStudents();
  }

  toggleSort(sortKey) {
    if (this.sortState.key === sortKey) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState = { key: sortKey, direction: 'asc' };
    }

    this.filteredStudents = sortStudents(this.filteredStudents, this.sortState.key, this.sortState.direction);
    this.renderStudents();
  }

  startCreateFlow() {
    this.editingId = null;
    clearStudentForm(this.dom.form);
    setFormMode(this.dom, 'create');
    this.setRoute('add');
  }

  startEditFlow(studentId) {
    const student = this.students.find((entry) => entry.id === studentId);

    if (!student) {
      return;
    }

    this.editingId = student.id;
    fillStudentForm(this.dom.form, student);
    setFormMode(this.dom, 'edit');
    this.closeModal();
    this.setRoute('add');
  }

  resetDemoData() {
    resetStudents();
    this.students = loadStudents(demoStudents);
    this.filteredStudents = [...this.students];
    this.currentPage = 1;
    this.filters = { query: '', course: '', status: '', method: '' };
    this.dom.searchInput.value = '';
    this.dom.courseFilter.value = '';
    this.dom.statusFilter.value = '';
    this.dom.methodFilter.value = '';
    this.render();
    this.toast('Demo-данные восстановлены.', 'success');
  }

  openModal(studentId, trigger) {
    const student = this.students.find((entry) => entry.id === studentId);

    if (!student) {
      return;
    }

    this.modalStudentId = studentId;
    this.lastFocusedElement = trigger;
    renderStudentModal(this.dom.modalBody, student);
    this.dom.modal.classList.remove('hidden');
    this.dom.modal.setAttribute('aria-hidden', 'false');
    this.dom.modal.querySelector('[data-action="close-modal"]').focus();
  }

  closeModal() {
    this.dom.modal.classList.add('hidden');
    this.dom.modal.setAttribute('aria-hidden', 'true');
    this.modalStudentId = null;

    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  }

  toggleSidebar() {
    const open = this.dom.sidebar.classList.toggle('open');
    this.dom.sidebarOverlay.classList.toggle('hidden', !open);
    this.dom.sidebarToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  closeSidebar() {
    this.dom.sidebar.classList.remove('open');
    this.dom.sidebarOverlay.classList.add('hidden');
    this.dom.sidebarToggle.setAttribute('aria-expanded', 'false');
  }

  render() {
    this.dom.pages.forEach((page) => {
      page.classList.toggle('active', page.dataset.page === this.activeRoute);
    });

    this.dom.navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.route === this.activeRoute);
    });

    this.filteredStudents = sortStudents(
      filterStudents(this.students, this.filters),
      this.sortState.key,
      this.sortState.direction,
    );

    if (this.activeRoute === 'dashboard') {
      renderDashboard(this.dom, this.students);
    }

    if (this.activeRoute === 'students') {
      this.renderStudents();
    }

    if (this.activeRoute === 'report') {
      renderReports(this.dom, this.students);
    }

    if (this.activeRoute === 'add') {
      setFormMode(this.dom, this.editingId ? 'edit' : 'create');
    }

    this.closeSidebar();
  }

  renderStudents() {
    const { currentPage } = renderStudentsTable(
      {
        studentCount: this.dom.studentCount,
        studentsBody: this.dom.studentsBody,
        pagination: this.dom.pagination,
        sortButtons: this.dom.sortButtons,
      },
      this.filteredStudents,
      this.currentPage,
      this.sortState,
      this.students.length,
    );

    this.currentPage = currentPage;
  }

  toast(message, tone) {
    showToast(this.dom.toastContainer, message, tone);
  }
}
