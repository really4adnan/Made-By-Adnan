const initTelemetry = (): void => {
  const badge = document.querySelector<HTMLElement>('.badge');
  if (!badge) return;

  const hours = new Date().getHours();
  const status = hours >= 9 && hours <= 23 ? 'ONLINE' : 'AWAY';
  badge.textContent = `STATUS // ${status}`;
};

document.addEventListener('DOMContentLoaded', () => {
  initTelemetry();
});