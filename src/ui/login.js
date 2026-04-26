export function createLoginView() {
  return `
    <div class="app-shell" style="display: flex; align-items: center; justify-content: center; min-height: 100vh;">
      <div class="app-bg app-bg--one"></div>
      <div class="app-bg app-bg--two"></div>
      
      <div class="form-card" style="width: 100%; max-width: 400px; position: relative; z-index: 10; padding: 32px; margin: 20px;">
        <div style="text-align: center; margin-bottom: 28px;">
          <img src="/logo.png" alt="Билим Нуру Logo" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 24px;">Билим Нуру</h2>
          <p style="color: var(--text-muted); margin-top: 8px;">Вход в панель управления</p>
        </div>
        
        <form id="loginForm" style="display: flex; flex-direction: column; gap: 18px;">
          <div class="form-group">
            <label class="form-label">Логин</label>
            <input type="text" name="username" class="form-input" required autocomplete="username" />
          </div>
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <input type="password" name="password" class="form-input" required autocomplete="current-password" />
          </div>
          <div id="loginError" style="color: var(--danger); font-size: 14px; text-align: center; display: none;">
            Неверный логин или пароль
          </div>
          <button type="submit" class="btn btn-primary" style="margin-top: 8px;">Войти</button>
        </form>
      </div>
    </div>
  `;
}
