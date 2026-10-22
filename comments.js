(() => {
  const host = document.getElementById("post-comments");
  if (!host || host.dataset.commentsMounted === "true") return;

  const section = document.getElementById("comments-section") || host;
  const config = host.dataset;
  const repo = (config.repo || "").trim();
  const repoId = (config.repoId || "").trim();
  const category = (config.category || "Comments").trim();
  const categoryId = (config.categoryId || "").trim();
  const postId = (config.postId || "").trim();
  const validId = (value) => /^[A-Za-z0-9_+/=-]+$/.test(value);

  section.hidden = true;
  if (
    config.enabled !== "true" ||
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo) ||
    !validId(repoId) ||
    !validId(categoryId) ||
    !category ||
    !postId
  ) return;

  host.dataset.commentsMounted = "true";
  host.hidden = false;
  section.hidden = false;

  const origin = "https://giscus.app";
  const root = document.documentElement;
  const getTheme = () => root.dataset.theme === "night" ? "noborder_dark" : "noborder_light";
  const mount = document.createElement("div");
  mount.className = "giscus";

  const fallback = document.createElement("p");
  fallback.className = "comments-fallback";
  fallback.hidden = true;
  fallback.setAttribute("role", "status");
  const discussionLink = document.createElement("a");
  discussionLink.href = `https://github.com/${repo}/discussions`;
  discussionLink.textContent = "continue on GitHub";
  const emailLink = document.createElement("a");
  emailLink.href = "mailto:nrbsld@korea.ac.kr";
  emailLink.textContent = "email me";
  fallback.append("Having trouble loading comments? You can ", discussionLink, " or ", emailLink, ".");

  const script = document.createElement("script");
  script.src = `${origin}/client.js`;
  script.async = true;
  script.crossOrigin = "anonymous";
  Object.assign(script.dataset, {
    repo,
    repoId,
    category,
    categoryId,
    mapping: "specific",
    term: `blog:${postId}`,
    strict: "1",
    reactionsEnabled: "1",
    emitMetadata: "1",
    inputPosition: "top",
    theme: getTheme(),
    lang: "en",
    loading: "eager",
  });

  const getFrame = () => mount.querySelector("iframe.giscus-frame");
  function syncTheme() {
    const theme = getTheme();
    script.dataset.theme = theme;
    getFrame()?.contentWindow?.postMessage({ giscus: { setConfig: { theme } } }, origin);
  }

  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
  const frameObserver = new MutationObserver(() => {
    const frame = getFrame();
    if (!frame) return;
    frame.addEventListener("load", syncTheme);
    frameObserver.disconnect();
  });
  frameObserver.observe(mount, { childList: true, subtree: true });

  let ready = false;
  window.addEventListener("message", (event) => {
    const frame = getFrame();
    if (event.origin !== origin || !frame || event.source !== frame.contentWindow) return;
    const message = event.data?.giscus;
    if (!message || typeof message !== "object") return;
    if (!ready) {
      ready = true;
      syncTheme();
    }
    // A missing discussion is normal until the first reader comments.
    if (typeof message.error === "string") {
      fallback.hidden = /discussion not found/i.test(message.error);
    } else if (message.discussion) {
      fallback.hidden = true;
    }
  });

  script.addEventListener("error", () => {
    fallback.hidden = false;
    themeObserver.disconnect();
    frameObserver.disconnect();
  }, { once: true });

  host.append(mount, fallback);
  host.appendChild(script);
})();
