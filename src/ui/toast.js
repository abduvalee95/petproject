export function showToast(container, message, tone = 'info') {
  const toast = document.createElement('div');

  toast.className = `toast toast--${tone}`;
  toast.textContent = message;
  container.append(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}
