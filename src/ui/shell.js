export function createShell() {
  return `
    <div class="app-shell">
      <div class="app-bg app-bg--one"></div>
      <div class="app-bg app-bg--two"></div>

      <header class="mobile-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="/logo.svg" alt="Билим Нуру Logo" style="width: 40px; height: 40px; object-fit: contain;">
          <div>
            <p class="eyebrow">Окуу Борбору</p>
            <h1>Билим Нуру</h1>
          </div>
        </div>
        <button
          type="button"
          class="icon-button"
          data-action="toggle-sidebar"
          aria-label="Открыть навигацию"
          aria-controls="sidebar"
          aria-expanded="false"
        >
          <span></span><span></span><span></span>
        </button>
      </header>

      <div class="sidebar-overlay hidden" id="sidebarOverlay" data-action="close-sidebar"></div>

      <aside class="sidebar" id="sidebar" aria-label="Основная навигация">
        <div class="sidebar-logo" style="text-align: center;">
          <img src="/logo.svg" alt="Билим Нуру Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 12px;">
          <p class="eyebrow">Окуу Борбору</p>
          <h1>Билим Нуру</h1>
          <span>Управление оплатами и учениками</span>
        </div>

        <nav class="nav-group">
          <p class="nav-label">Навигация</p>
          <button type="button" class="nav-item" data-route="dashboard">Главная</button>
          <button type="button" class="nav-item" data-route="students">Ученики</button>
          <button type="button" class="nav-item" data-route="report">Отчёты</button>
          <button type="button" class="nav-item" data-action="open-add">Добавить ученика</button>
        </nav>

        <div class="sidebar-footer">
          <button type="button" class="btn btn-secondary" data-action="logout" style="width: 100%; margin-bottom: 12px; justify-content: center;">Выйти из системы</button>
          <button type="button" class="reset-btn" data-action="reset-data">
            Сбросить demo-данные
          </button>
          <p class="sidebar-note">Локальное состояние хранится только в браузере.</p>
        </div>
      </aside>

      <main class="main-content">
        <section class="page active" data-page="dashboard" aria-labelledby="dashboardTitle">
          <div class="topbar">
            <div class="page-title">
              <p class="eyebrow">Обзор</p>
              <h2 id="dashboardTitle">Финансовая панель</h2>
              <p>Сводка по оплатам, курсам и студентам за два месяца.</p>
            </div>
          </div>

          <div class="stats-grid" id="statsGrid"></div>

          <div class="charts-row">
            <section class="chart-card">
              <div class="card-heading">
                <h3>Распределение по курсам</h3>
                <p>Сколько активных студентов по каждому направлению.</p>
              </div>
              <div class="chart-wrap"><canvas id="courseChart"></canvas></div>
            </section>

            <section class="chart-card">
              <div class="card-heading">
                <h3>Способы оплаты</h3>
                <p>Какие каналы оплаты используются чаще всего.</p>
              </div>
              <div class="chart-wrap"><canvas id="methodChart"></canvas></div>
            </section>
          </div>

          <section class="chart-card chart-card--wide">
            <div class="card-heading">
              <h3>Март против апреля</h3>
              <p>Быстрое сравнение месячного объёма оплат.</p>
            </div>
            <div class="chart-wrap chart-wrap--short"><canvas id="monthChart"></canvas></div>
          </section>
        </section>

        <section class="page" data-page="students" aria-labelledby="studentsTitle">
          <div class="topbar">
            <div class="page-title">
              <p class="eyebrow">CRM</p>
              <h2 id="studentsTitle">Ученики</h2>
              <p id="studentCount"></p>
            </div>

            <div class="topbar-actions">
              <button type="button" class="btn btn-secondary" data-action="export-csv">
                Экспорт CSV
              </button>
              <button type="button" class="btn btn-primary" data-action="open-add">
                Добавить ученика
              </button>
            </div>
          </div>

          <section class="table-controls" aria-label="Фильтры по ученикам">
            <label class="search-box">
              <span class="visually-hidden">Поиск по имени или телефону</span>
              <input
                id="searchInput"
                name="search"
                type="search"
                placeholder="Поиск по имени или телефону..."
                autocomplete="off"
              />
            </label>

            <label>
              <span class="visually-hidden">Фильтр по курсу</span>
              <select class="filter-select" id="courseFilter" name="course">
                <option value="">Все курсы</option>
                <option value="IT">IT</option>
                <option value="Kids">Kids</option>
                <option value="En">Английский</option>
              </select>
            </label>

            <label>
              <span class="visually-hidden">Фильтр по статусу</span>
              <select class="filter-select" id="statusFilter" name="status">
                <option value="">Все статусы</option>
                <option value="paid">Оплатили</option>
                <option value="partial">Частично</option>
                <option value="unpaid">Не оплатили</option>
              </select>
            </label>

            <label>
              <span class="visually-hidden">Фильтр по способу оплаты</span>
              <select class="filter-select" id="methodFilter" name="method">
                <option value="">Все способы</option>
                <option value="cash">Наличные</option>
                <option value="bank">M-Bank</option>
              </select>
            </label>

            <label>
              <span class="visually-hidden">Месяц</span>
              <select class="filter-select" id="monthFilter" name="month">
                <option value="april">Апрель</option>
                <option value="march">Март</option>
              </select>
            </label>
          </section>

          <section class="table-card">
            <div class="table-wrap">
              <table class="data-table">
                <thead>
                  <tr>
                    <th><button type="button" class="th-button" data-sort="id">#</button></th>
                    <th><button type="button" class="th-button" data-sort="name">Имя</button></th>
                    <th><button type="button" class="th-button" data-sort="phone">Телефон</button></th>
                    <th>Курсы</th>
                    <th class="align-right">
                      <button type="button" class="th-button" id="sortPaymentBtn" data-sort="april">Оплата</button>
                    </th>
                    <th>Способ</th>
                    <th>Статус (Общий)</th>
                  </tr>
                </thead>
                <tbody id="studentsBody"></tbody>
              </table>
            </div>
            <div class="pagination" id="pagination"></div>
          </section>
        </section>

        <section class="page" data-page="report" aria-labelledby="reportTitle">
          <div class="topbar">
            <div class="page-title">
              <p class="eyebrow">Аналитика</p>
              <h2 id="reportTitle">Отчёты</h2>
              <p>Разрез по кассе, банку, месяцам и направлению обучения.</p>
            </div>
            <button type="button" class="btn btn-secondary" data-action="export-csv">
              Экспорт CSV
            </button>
          </div>

          <div class="report-grid" id="reportGrid"></div>

          <div class="charts-row">
            <section class="chart-card">
              <div class="card-heading">
                <h3>Доход по курсам</h3>
                <p>Доход делится между активными курсами ученика.</p>
              </div>
              <div class="chart-wrap"><canvas id="courseRevenueChart"></canvas></div>
            </section>

            <section class="chart-card">
              <div class="card-heading">
                <h3>Наличные против M-Bank</h3>
                <p>Помесячный split по способам оплаты.</p>
              </div>
              <div class="chart-wrap"><canvas id="comparisonChart"></canvas></div>
            </section>
          </div>
        </section>

        <section class="page" data-page="add" aria-labelledby="formTitle">
          <div class="topbar">
            <div class="page-title">
              <p class="eyebrow">Редактор</p>
              <h2 id="formTitle">Добавить ученика</h2>
              <p id="formHint">Все изменения сохраняются только в localStorage этого браузера.</p>
            </div>
          </div>

          <section class="form-card">
            <form id="studentForm" class="form-grid" novalidate>
              <div class="form-group form-group--full">
                <label class="form-label" for="studentName">Полное имя</label>
                <input class="form-input" id="studentName" name="name" type="text" maxlength="80" />
              </div>

              <div class="form-group">
                <label class="form-label" for="studentPhone">Телефон</label>
                <input class="form-input" id="studentPhone" name="phone" type="tel" maxlength="16" />
              </div>

              <fieldset class="form-group">
                <legend class="form-label">Курсы</legend>
                <div class="checkbox-group">
                  <label class="checkbox-item"><input type="checkbox" name="courses" value="IT" /> IT</label>
                  <label class="checkbox-item"><input type="checkbox" name="courses" value="Kids" /> Kids</label>
                  <label class="checkbox-item"><input type="checkbox" name="courses" value="En" /> Английский</label>
                </div>
              </fieldset>

              <div class="form-group">
                <label class="form-label" for="paymentMarch">Оплата за март</label>
                <input class="form-input" id="paymentMarch" name="march" type="number" min="0" step="50" />
              </div>

              <fieldset class="form-group">
                <legend class="form-label">Способ оплаты за март</legend>
                <div class="radio-group">
                  <label class="radio-item"><input type="radio" name="marchMethod" value="cash" checked /> Наличные</label>
                  <label class="radio-item"><input type="radio" name="marchMethod" value="bank" /> M-Bank</label>
                </div>
              </fieldset>

              <div class="form-group">
                <label class="form-label" for="paymentApril">Оплата за апрель</label>
                <input class="form-input" id="paymentApril" name="april" type="number" min="0" step="50" />
              </div>

              <fieldset class="form-group">
                <legend class="form-label">Способ оплаты за апрель</legend>
                <div class="radio-group">
                  <label class="radio-item"><input type="radio" name="aprilMethod" value="cash" checked /> Наличные</label>
                  <label class="radio-item"><input type="radio" name="aprilMethod" value="bank" /> M-Bank</label>
                </div>
              </fieldset>

              <div class="form-group form-group--full">
                <label class="form-label" for="studentNote">Примечание</label>
                <textarea class="form-input form-textarea" id="studentNote" name="note" maxlength="160"></textarea>
              </div>

              <div class="form-actions form-group--full">
                <button type="submit" class="btn btn-primary" id="submitButton">Сохранить</button>
                <button type="button" class="btn btn-secondary" data-action="clear-form">Очистить</button>
              </div>
            </form>
          </section>
        </section>
      </main>

      <div class="modal-overlay hidden" id="studentModal" aria-hidden="true">
        <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modal-header">
            <div>
              <p class="eyebrow">Карточка ученика</p>
              <h3 id="modalTitle">Детали</h3>
            </div>
            <button type="button" class="icon-close" data-action="close-modal" aria-label="Закрыть карточку">
              ×
            </button>
          </div>
          <div class="modal-body" id="modalBody"></div>
          <div class="modal-footer" style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn" style="background: rgba(239, 68, 68, 0.1); color: #ef4444;" data-action="delete-student">Удалить</button>
            <div style="flex-grow: 1;"></div>
            <button type="button" class="btn btn-secondary" data-action="close-modal">Закрыть</button>
            <button type="button" class="btn btn-primary" data-action="edit-student">Редактировать</button>
          </div>
        </div>
      </div>

      <div class="toast-container" id="toastContainer" aria-live="polite" aria-atomic="true"></div>
    </div>
  `;
}
