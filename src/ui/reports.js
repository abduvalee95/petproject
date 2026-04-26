import Chart from 'chart.js/auto';
import { formatMoney } from '../lib/formatters.js';
import {
  getPaymentSplit,
  getRevenueByCourse,
  getStatusBreakdown,
  getTotals,
} from '../lib/students.js';

let courseRevenueChart;
let comparisonChart;

export function renderReports(dom, students) {
  const totals = getTotals(students);
  const split = getPaymentSplit(students);
  const status = getStatusBreakdown(students);
  const revenue = getRevenueByCourse(students);

  dom.reportGrid.innerHTML = `
    <article class="report-card">
      <p class="report-card-title">Март</p>
      ${renderReportRow('Итого', formatMoney(totals.march))}
      ${renderReportRow('Наличные', formatMoney(split.march.cash))}
      ${renderReportRow('M-Bank', formatMoney(split.march.bank))}
      ${renderReportRow('Доля банка', `${Math.round((split.march.bank / (totals.march || 1)) * 100)}%`)}
      <div class="progress-bar">
        <div class="progress-fill progress-fill--primary" style="width:${
          (split.march.bank / (totals.march || 1)) * 100
        }%"></div>
      </div>
    </article>

    <article class="report-card">
      <p class="report-card-title">Апрель</p>
      ${renderReportRow('Итого', formatMoney(totals.april))}
      ${renderReportRow('Наличные', formatMoney(split.april.cash))}
      ${renderReportRow('M-Bank', formatMoney(split.april.bank))}
      ${renderReportRow('Доля банка', `${Math.round((split.april.bank / (totals.april || 1)) * 100)}%`)}
      <div class="progress-bar">
        <div class="progress-fill progress-fill--warning" style="width:${
          (split.april.bank / (totals.april || 1)) * 100
        }%"></div>
      </div>
    </article>

    <article class="report-card">
      <p class="report-card-title">Статус оплат</p>
      ${renderReportRow('Полностью', String(status.paid))}
      ${renderReportRow('Частично', String(status.partial))}
      ${renderReportRow('Не оплатили', String(status.unpaid))}
      ${renderReportRow('Общий объём', formatMoney(totals.march + totals.april))}
    </article>
  `;

  destroyChart(courseRevenueChart);
  destroyChart(comparisonChart);

  courseRevenueChart = new Chart(dom.courseRevenueChart, {
    type: 'bar',
    data: {
      labels: ['IT', 'Kids', 'Английский'],
      datasets: [
        {
          data: [Math.round(revenue.IT), Math.round(revenue.Kids), Math.round(revenue.En)],
          backgroundColor: ['#3B82F6', '#8B5CF6', '#06B6D4'],
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
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => Number(value).toLocaleString('ru-RU') },
        },
        x: { grid: { display: false } },
      },
    },
  });

  comparisonChart = new Chart(dom.comparisonChart, {
    type: 'bar',
    data: {
      labels: ['Март', 'Апрель'],
      datasets: [
        {
          label: 'Наличные',
          data: [split.march.cash, split.april.cash],
          backgroundColor: '#10B981',
          borderRadius: 8,
        },
        {
          label: 'M-Bank',
          data: [split.march.bank, split.april.bank],
          backgroundColor: '#3B82F6',
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: {
        x: { stacked: true, grid: { display: false } },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { callback: (value) => Number(value).toLocaleString('ru-RU') },
        },
      },
    },
  });
}

function renderReportRow(label, value) {
  return `
    <div class="report-row">
      <span class="report-row-label">${label}</span>
      <span class="report-row-value">${value}</span>
    </div>
  `;
}

function destroyChart(instance) {
  if (instance) {
    instance.destroy();
  }
}
