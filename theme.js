(() => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;

  const icon = toggle.querySelector(".theme-toggle-icon");
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M20.2 15.5A8.7 8.7 0 0 1 8.5 3.8a8.8 8.8 0 1 0 11.7 11.7Z"/></svg>';
  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>';

  function applyTheme(theme) {
    const resolved = theme === "night" ? "night" : "day";
    const isNight = resolved === "night";
    root.dataset.theme = resolved;
    toggle.setAttribute("aria-pressed", String(isNight));
    const label = isNight ? "Switch to light theme" : "Switch to dark theme";
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("title", label);
    if (icon) icon.innerHTML = isNight ? sun : moon;
    try { localStorage.setItem("theme", resolved); } catch { /* Theme works even when storage is unavailable. */ }
  }

  applyTheme(root.dataset.theme);
  toggle.addEventListener("click", () => applyTheme(root.dataset.theme === "night" ? "day" : "night"));
  window.addEventListener("storage", (event) => {
    if (event.key === "theme") applyTheme(event.newValue);
  });
})();
