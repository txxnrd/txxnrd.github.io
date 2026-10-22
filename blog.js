(() => {
  const controls = document.querySelector("[data-blog-controls]");
  if (!controls) return;

  const input = document.getElementById("blog-search");
  const count = document.querySelector("[data-blog-count]");
  const empty = document.querySelector("[data-blog-empty]");
  const filters = document.querySelector("[data-blog-filters]");
  const buttons = [...document.querySelectorAll("[data-blog-tag]")];
  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase().trim();
  let selectedTag = "";

  const posts = [...document.querySelectorAll("[data-blog-entry]")].map((element) => {
    let tags = [];
    try {
      const value = JSON.parse(element.dataset.tags || "[]");
      if (Array.isArray(value)) tags = value.map(String);
    } catch {
      tags = [...element.querySelectorAll(".blog-tag")].map((tag) => tag.textContent);
    }
    const title = element.querySelector(".blog-entry-title")?.textContent || "";
    const excerpt = element.querySelector(".blog-entry-excerpt")?.textContent || "";
    return { element, tags, searchText: normalize([title, excerpt, ...tags].join(" ")) };
  });

  function updateResults() {
    const terms = normalize(input.value).split(/\s+/).filter(Boolean);
    let visibleCount = 0;
    for (const post of posts) {
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesSearch = terms.every((term) => post.searchText.includes(term));
      post.element.hidden = !(matchesTag && matchesSearch);
      if (!post.element.hidden) visibleCount += 1;
    }
    for (const button of buttons) {
      button.setAttribute("aria-pressed", String(button.dataset.blogTag === selectedTag));
    }
    count.textContent = visibleCount + (visibleCount === 1 ? " post" : " posts");
    empty.hidden = visibleCount > 0 || posts.length === 0;
  }

  input.addEventListener("input", updateResults);
  for (const button of buttons) {
    button.addEventListener("click", () => {
      selectedTag = button.dataset.blogTag || "";
      updateResults();
    });
  }
  document.querySelector("[data-blog-reset]")?.addEventListener("click", () => {
    input.value = "";
    selectedTag = "";
    updateResults();
    input.focus();
  });

  if (posts.length) {
    controls.hidden = false;
    if (filters) filters.hidden = false;
    updateResults();
  }
})();
