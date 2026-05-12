(() => {
  const root = document.documentElement;
  const toggle = document.querySelector("[data-theme-toggle]");

  if (!toggle) {
    return;
  }

  const icon = toggle.querySelector(".theme-toggle-icon");

  function applyTheme(theme) {
    const resolvedTheme = theme === "night" ? "night" : "day";
    const isNight = resolvedTheme === "night";

    root.dataset.theme = resolvedTheme;
    localStorage.setItem("theme", resolvedTheme);
    toggle.setAttribute("aria-pressed", String(isNight));
    toggle.setAttribute(
      "aria-label",
      isNight ? "낮 테마로 전환" : "밤 테마로 전환",
    );
    toggle.setAttribute("title", isNight ? "낮 모드" : "밤 모드");

    if (icon) {
      icon.textContent = isNight ? "☀️" : "🌙";
    }
  }

  applyTheme(root.dataset.theme);

  toggle.addEventListener("click", () => {
    applyTheme(root.dataset.theme === "night" ? "day" : "night");
  });
})();
