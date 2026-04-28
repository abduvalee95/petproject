import Chart from 'chart.js/auto';
import { getAttendanceRate, formatDate as formatAttDate } from '../lib/attendance.js';
import { getCourseCounts, getDashboardStats, getPaymentMethodCounts, getTotals } from '../lib/students.js';

let courseChart;
let methodChart;
let monthChart;

export function renderDashboard(dom, students) {
  const stats = getDashboardStats(students);
  const courseCounts = getCourseCounts(students);
  const methodCounts = getPaymentMethodCounts(students);
  const totals = getTotals(students);
  const todayStr = formatAttDate(new Date());
  const attendanceRate = getAttendanceRate(students, todayStr);

  stats.push({
    key: 'attendance',
    label: 'Посещаемость сегодня',
    value: `${attendanceRate}%`,
    sub: `Дата: ${todayStr}`,
    tone: 'info',
    icon: '📋',
  });

  dom.statsGrid.innerHTML = stats
    .map(
      (card) => `
        <article class="stat-card stat-card--${card.tone}">
          <div class="stat-icon">${card.icon}</div>
          <p class="stat-label">${card.label}</p>
          <p class="stat-value">${card.value}</p>
          <p class="stat-sub">${card.sub}</p>
        </article>
      `,
    )
    .join('');

  destroyChart(courseChart);
  destroyChart(methodChart);
  destroyChart(monthChart);

  courseChart = new Chart(dom.courseChart, {
    type: 'doughnut',
    data: {
      labels: ['IT', 'Kids', 'Английский'],
      datasets: [
        {
          data: [courseCounts.IT, courseCounts.Kids, courseCounts.En],
          backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4'],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { padding: 18, font: { size: 12 } },
        },
      },
    },
  });

  methodChart = new Chart(dom.methodChart, {
    type: 'bar',
    data: {
      labels: ['Наличные', 'M-Bank', 'Не указан'],
      datasets: [
        {
          data: [methodCounts.cash, methodCounts.bank, methodCounts.unknown],
          backgroundColor: ['#10B981', '#3B82F6', '#94A3B8'],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: 'rgba(15, 23, 42, 0.08)' } },
        x: { grid: { display: false } },
      },
    },
  });

  monthChart = new Chart(dom.monthChart, {
    type: 'bar',
    data: {
      labels: ['Март', 'Апрель'],
      datasets: [
        {
          data: [totals.march, totals.april],
          backgroundColor: ['#2563EB', '#F59E0B'],
          borderRadius: 10,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { callback: (value) => Number(value).toLocaleString('ru-RU') },
        },
        y: { grid: { display: false } },
      },
    },
  });
}

function destroyChart(instance) {
  if (instance) {
    instance.destroy();
  }
}
