import { siteData } from "./data/site-data.js";

const app = document.querySelector("#app");
const routes = new Map(siteData.pages.map((page) => [page.route, page]));
const researchChildren = [
  { route: "research", label: "Overview" },
  { route: "research/biomedical-ai", label: "Biomedical AI" },
  { route: "research/nlp", label: "NLP" },
  { route: "research/graph-ml", label: "Graph & ML" },
];
const primaryNav = [
  { route: "home", label: "Home" },
  { route: "jaewoo-kang-p-i", label: "Jaewoo Kang" },
  { route: "publications", label: "Publications" },
  { route: "research", label: "Research", children: researchChildren },
  { route: "people", label: "People" },
];

let menuOpen = false;
let peopleFilter = "All";
let researchMenuOpen = false;
const filters = {
  news: { query: "", year: "All" },
  publications: { query: "", year: "All" },
};
const arxivEntries = [
  {
    title: "ToxReason: A Benchmark for Mechanistic Chemical Toxicity Reasoning via Adverse Outcome Pathway",
    venue: "ACL 2026 Findings",
    year: "2026",
    arxivId: "2604.06264",
  },
  {
    title: "CLAG: Adaptive Memory Organization via Agent-Driven Clustering for Small Language Model Agents",
    venue: "ACL 2026 Findings",
    year: "2026",
    arxivId: "2603.15421",
  },
  {
    title: "An LLM-based Chain-of-Response Counter-Scam System",
    authors: "H Kim, M Gim, D Choi, H Lee, S Bae, MY Kim, Jaewoo Kang",
    venue: "Preprint",
    year: "2026",
    arxivId: "2606.01475",
    addToPreprints: true,
  },
  {
    title: "MolDeTox: Evaluating Language Model's Stepwise Fragment Editing for Molecular Detoxification",
    authors: "Jueon Park, Wonjune Jang, Jiwoo Lee, Yein Park, Jaewoo Kang",
    venue: "Preprint",
    year: "2026",
    arxivId: "2605.12181",
    addToPreprints: true,
  },
  {
    title: "Teaching Language Models to Think in Code",
    authors: "Hyeon Hwang, Jiwoo Lee, Jaewoo Kang",
    venue: "Preprint",
    year: "2026",
    arxivId: "2605.07237",
    addToPreprints: true,
  },
  {
    title: "BUZZY: Contrastive Scoring to Mitigate Text-Induced Bias in Multimodal Multiple-Choice QA",
    authors:
      "Taeyun Roh, Suhyeong Park, Dongyoung Lee, Eunyeong Jo, Wonjune Jang, Junha Jung, Jaewoo Kang",
    venue: "Preprint",
    year: "2026",
    arxivId: "2603.28026",
    addToPreprints: true,
  },
  {
    title: "The Curious Case of Analogies: Investigating Analogical Reasoning in Large Language Models",
    venue: "AAAI 2026",
    year: "2026",
    arxivId: "2511.20344",
  },
  {
    title: "ATTNSOM: Learning Cross-Isoform Attention for Cytochrome P450 Site-of-Metabolism",
    venue: "ISMB 2026",
    year: "2026",
    arxivId: "2601.20891",
  },
  {
    title: "Benchmarking Direct Preference Optimization for Medical Large Vision-Language Models",
    venue: "EACL 2026 Findings",
    year: "2026",
    arxivId: "2601.17918",
  },
  {
    title: "GraphCliff: Short-Long Range Gating for Subtle Differences but Critical Changes",
    aliases: ["GraphCliff"],
    venue: "KDD 2026",
    year: "2026",
    arxivId: "2511.03170",
  },
  {
    title: "ASGuard: Activation-Scaling Guard to Mitigate Targeted Jailbreaking Attack",
    venue: "ICLR 2026",
    year: "2026",
    arxivId: "2509.25843",
  },
  {
    title: "SCRIPTMIND: Crime Script Inference and Cognitive Evaluation for LLM-based Social Engineering Scam Detection System",
    aliases: ["SCRIPTMIND"],
    venue: "EACL 2026 Industry Track",
    year: "2026",
    arxivId: "2601.13581",
  },
].map((entry) => ({
  ...entry,
  href: `https://arxiv.org/abs/${entry.arxivId}`,
}));

function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function routeFromHash() {
  const route = window.location.hash.replace(/^#\/?/, "") || "home";
  return routes.has(route) ? route : "home";
}

function linkTarget(href) {
  return href.startsWith("#") ? "" : ' target="_blank" rel="noreferrer"';
}

function displayText(value = "") {
  return value
    .replace(/\s*\(https?:\/\/[^)\s]+\)/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\bF or\b/g, "For")
    .replace(/\bQu ick l inks\b/g, "Quick links")
    .replace(/\ba s of\b/g, "as of")
    .replace(/\bY ein Park\b/g, "Yein Park")
    .replace(/\bJ aewoo Kang\b/g, "Jaewoo Kang")
    .replace(/\bC hangsik Kim\b/g, "Changsik Kim")
    .replace(/\bD a nqi Chen\b/g, "Danqi Chen")
    .replace(/\bWon J in Yoon\b/g, "Wonjin Yoon")
    .replace(/\bS uyoung Oh\b/g, "Suyoung Oh")
    .replace(/\bJunseok Cho e\b/g, "Junseok Choe")
    .replace(/\bYonghwa Cho i\b/g, "Yonghwa Choi")
    .replace(/\bH omepage\b/g, "Homepage")
    .replace(/\bBioi nformatics\b/g, "Bioinformatics")
    .replace(/\bAd vances\b/g, "Advances")
    .replace(/\bChall enge\b/g, "Challenge")
    .replace(/\bS hort\b/g, "Short")
    .replace(/\bIJCA I\b/g, "IJCAI")
    .replace(/\bTB A\b/g, "TBA")
    .replace(/\bMechanis m\b/g, "Mechanism")
    .replace(/\bAugu st\b/g, "August")
    .replace(/\bSa n D iego\b/g, "San Diego")
    .replace(/\bT wo\b/g, "Two")
    .replace(/\bT hree\b/g, "Three")
    .replace(/\b(\d+)\s+(st|nd|rd|th)\b/g, "$1$2")
    .replace(/\b2\s+022\b/g, "2022")
    .replace(/\b2\s+01\s+8\b/g, "2018")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function linkLabel(link) {
  const label = displayText(link.label || "Link");
  if (label.toLowerCase() === "arxiv") return "arXiv";
  if (!/^https?:\/\//i.test(label)) return label;
  try {
    const url = new URL(link.href);
    const host = url.hostname.replace(/^www\./, "");
    if (host.includes("arxiv")) return "arXiv";
    if (host.includes("huggingface")) return "Model";
    return host;
  } catch {
    return "Link";
  }
}

function isArxivLink(link) {
  if ((link.label || "").toLowerCase() === "arxiv") return true;
  try {
    return new URL(link.href).hostname.includes("arxiv.org");
  } catch {
    return false;
  }
}

function iconArxiv() {
  return `<svg class="arxiv-icon" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" fill="currentColor"/>
    <path d="M8 15.7 11.4 8h1.3l3.3 7.7h-1.5l-.8-2H10.3l-.8 2H8Zm2.8-3.2h2.4L12 9.7l-1.2 2.8Z" fill="#fff"/>
    <path d="M7.6 8.5h2.1l1.2 1.6h-2L7.6 8.5Zm5.5 0h2.2l-2.7 3.4 2.9 3.8h-2.2l-1.8-2.4-1.8 2.4H7.6l2.9-3.8-1-1.3h2.1l-.1.1 1.6-2.2Z" fill="#fff" opacity=".9"/>
  </svg>`;
}

function renderLinkContent(link) {
  if (!isArxivLink(link)) return escapeHtml(linkLabel(link));
  return `${iconArxiv()}<span>arXiv</span>`;
}

function normalizePublicationText(value = "") {
  return displayText(value)
    .toLowerCase()
    .replaceAll("&amp;", "and")
    .replace(/[’']/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function findArxivEntry(text = "") {
  const normalized = normalizePublicationText(text);
  return arxivEntries.find((entry) => {
    const candidates = [entry.title, ...(entry.aliases || [])].map(normalizePublicationText);
    return candidates.some((candidate) => candidate && normalized.includes(candidate));
  });
}

function mergeLinks(primaryLinks = [], extraLinks = []) {
  const seen = new Set();
  return [...primaryLinks, ...extraLinks].filter((link) => {
    if (!link?.href || seen.has(link.href)) return false;
    seen.add(link.href);
    return true;
  });
}

function renderLinks(links = []) {
  if (!links.length) return "";
  return `<div class="link-row">${links
    .map(
      (link) => {
        const isArxiv = isArxivLink(link);
        return `<a class="link-chip ${isArxiv ? "arxiv-chip" : ""}" href="${escapeHtml(link.href)}"${linkTarget(
          link.href,
        )} aria-label="${escapeHtml(linkLabel(link))}">${renderLinkContent(link)}</a>`;
      },
    )
    .join("")}</div>`;
}

function iconHome() {
  return `<svg class="icon" aria-hidden="true" viewBox="0 0 24 24" fill="none">
    <path d="M3 10.8 12 3l9 7.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5.5 9.6V21h13V9.6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5 21v-6h5v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function renderBlock(block) {
  const text = escapeHtml(displayText(block.text));
  if (block.type === "heading-1") return `<h1>${text}</h1>${renderLinks(block.links)}`;
  if (block.type === "heading-2") return `<h2>${text}</h2>${renderLinks(block.links)}`;
  if (block.type === "heading-3") return `<h3>${text}</h3>${renderLinks(block.links)}`;
  if (block.type === "heading-4") return `<h4>${text}</h4>${renderLinks(block.links)}`;
  return `<p>${text}</p>${renderLinks(block.links)}`;
}

function pageTitle(page) {
  const first = page.sections?.[0]?.blocks?.[0]?.text;
  if (page.kind === "home") return siteData.name;
  if (page.kind === "people") return "People";
  if (page.kind === "profile") return "Prof. Jaewoo Kang, Ph.D";
  if (page.kind === "publications") return "Publications";
  return first || page.label;
}

function pageDescription(page) {
  if (page.kind === "home") {
    return "AI, machine learning, biomedical discovery, natural language processing, and graph learning at Korea University.";
  }
  if (page.kind === "people") {
    return "Current members, interns, and alumni of the Data Mining and Information Systems Lab.";
  }
  if (page.kind === "publications") {
    return "DMIS lab members, Corresponding author*, Co-first authors†";
  }
  return page.description || "";
}

function renderHeader(currentRoute) {
  const links = primaryNav.map((page) => renderNavItem(page, currentRoute)).join("");
  const mobileLinks = primaryNav.map((page) => renderMobileNavItem(page, currentRoute)).join("");

  return `<header class="topbar">
    <div class="nav-inner">
      <a class="brand" href="#home" aria-label="DMIS Lab home">
        <span class="brand-copy">
          <span class="brand-title">${escapeHtml(siteData.name)}</span>
          <span class="brand-subtitle">${escapeHtml(siteData.subtitle)}</span>
        </span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">${links}</nav>
      <button class="menu-toggle" type="button" aria-label="Toggle navigation" aria-expanded="${menuOpen}">
        <span></span><span></span><span></span>
      </button>
    </div>
    <nav class="mobile-menu ${menuOpen ? "open" : ""}" aria-label="Mobile navigation">${mobileLinks}</nav>
  </header>`;
}

function isRouteActive(page, currentRoute) {
  if (page.children) return currentRoute === page.route || currentRoute.startsWith(`${page.route}/`);
  return page.route === currentRoute;
}

function renderNavItem(page, currentRoute) {
  const active = isRouteActive(page, currentRoute) ? "active" : "";
  if (!page.children) {
    return `<a class="nav-link ${active}" href="#${page.route}">${escapeHtml(page.label)}</a>`;
  }
  return `<div class="nav-group">
    <button class="nav-link nav-button research-toggle ${active}" type="button" aria-haspopup="true" aria-expanded="${researchMenuOpen}">
      ${escapeHtml(page.label)}
    </button>
    <div class="submenu ${researchMenuOpen ? "open" : ""}" role="menu">
      ${page.children
        .map(
          (child) =>
            `<a class="submenu-link ${child.route === currentRoute ? "active" : ""}" href="#${child.route}" role="menuitem">${escapeHtml(
              child.label,
            )}</a>`,
        )
        .join("")}
    </div>
  </div>`;
}

function renderMobileNavItem(page, currentRoute) {
  const active = isRouteActive(page, currentRoute) ? "active" : "";
  if (!page.children) {
    return `<a class="menu-link ${active}" href="#${page.route}">${escapeHtml(page.label)}</a>`;
  }
  return `<div class="mobile-nav-group">
    <a class="menu-link ${active}" href="#${page.route}">${escapeHtml(page.label)}</a>
    <div class="mobile-submenu">
      ${page.children
        .map(
          (child) =>
            `<a class="mobile-submenu-link ${child.route === currentRoute ? "active" : ""}" href="#${child.route}">${escapeHtml(
              child.label,
            )}</a>`,
        )
        .join("")}
    </div>
  </div>`;
}

function renderFooter() {
  const home = routes.get("home");
  const footerSection = home.sections[home.sections.length - 1];
  const footerLines = footerSection.blocks.map((block) => block.text);
  return `<footer class="site-footer"><div class="footer-inner">${footerLines
    .map((line) => `<div>${escapeHtml(line)}</div>`)
    .join("")}</div></footer>`;
}

function renderHero(page) {
  const heroImage = page.heroImage || "";
  return `<section class="hero">
    <div class="hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">Korea University</p>
        <h1>DMIS Lab</h1>
        <p class="hero-lede">${escapeHtml(pageDescription(page))}</p>
        <div class="hero-actions">
          <a class="action primary" href="#research">Research</a>
          <a class="action" href="#publications">Publications</a>
          <a class="action" href="#people">People</a>
        </div>
      </div>
      <div class="hero-brand-panel" aria-label="Korea University DMIS Lab">
        <div class="ku-lockup">
          <img src="assets/brand/korea-university-shield.png" alt="Korea University logo" />
          <div>
            <strong>Korea University</strong>
            <span>Department of Computer Science and Engineering</span>
          </div>
        </div>
        ${heroImage ? `<div class="dmis-logo-panel"><img class="hero-logo" src="${escapeHtml(heroImage)}" alt="DMIS Lab logo" /></div>` : ""}
      </div>
    </div>
  </section>`;
}

function renderPageHead(page, kicker = "DMIS Lab", extraLinks = []) {
  return `<div class="page-head">
    <div>
      <p class="page-kicker">${escapeHtml(kicker)}</p>
      <h1 class="page-title">${escapeHtml(pageTitle(page))}</h1>
      ${pageDescription(page) ? `<p class="page-description">${escapeHtml(pageDescription(page))}</p>` : ""}
      ${renderLinks(extraLinks)}
    </div>
    <a class="source-link" href="${escapeHtml(page.url)}" target="_blank" rel="noreferrer">Source</a>
  </div>`;
}

function renderSection(section, options = {}) {
  const blocks = options.skipFirstHeading
    ? section.blocks.filter((block, index) => index !== 0 || !block.type.startsWith("heading"))
    : section.blocks;
  if (!blocks.length && !section.images?.length) return "";
  const body = blocks.map(renderBlock).join("");
  const media = section.images?.length
    ? `<div class="section-media">${section.images
        .map((image) => `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || section.title || "DMIS Lab image")}" loading="lazy" />`)
        .join("")}</div>`
    : "";
  return `<section class="content-section ${media ? "has-media" : ""}" id="${escapeHtml(section.id)}">
    <div class="section-body">${body}</div>${media}
  </section>`;
}

function renderGenericPage(page) {
  const introLinks = page.sections[0]?.blocks?.flatMap((block) => block.links || []) || [];
  const sections = page.sections.slice(1).map((section) => renderSection(section)).join("");
  return `<main class="page">${renderPageHead(page, "DMIS Lab", introLinks)}<div class="section-grid">${sections}</div></main>`;
}

function cleanResearchTitle(title = "") {
  if (/biomedical/i.test(title)) return "Biomedical AI";
  if (/natural language|nlp/i.test(title)) return "Natural Language Processing";
  if (/graph/i.test(title)) return "Graph & ML";
  return displayText(title);
}

function linkDomain(href = "") {
  if (href.startsWith("#")) return "DMIS";
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return "Link";
  }
}

function renderResearchOverview(page) {
  const introText = "Biomedical AI, NLP, and Graph & ML are the main research directions of DMIS Lab.";
  const areas = page.sections.slice(1).map((section) => {
    const keywordBlock = section.blocks.find((block) => block.type === "heading-3" && /keywords/i.test(block.text));
    const descriptionBlock = section.blocks.find((block) => block.type === "paragraph" && block.text.length > 140);
    const detailLink =
      section.blocks.flatMap((block) => block.links || []).find((link) => link.href.startsWith("#research/"))?.href || "#research";
    const highlights = section.blocks
      .filter((block) => block.type === "paragraph" && !(block.links || []).some((link) => !link.href.startsWith("#")))
      .map((block) => displayText(block.text))
      .filter((text) => text && text !== displayText(descriptionBlock?.text || "") && !/^More news/i.test(text) && !/^For prospective/i.test(text) && text !== "News & Research")
      .slice(0, 2);
    return {
      title: cleanResearchTitle(section.title),
      keywords: displayText((keywordBlock?.text || "").replace(/^Keywords:\s*/i, "")),
      description: displayText(descriptionBlock?.text || ""),
      detailLink,
      highlights,
    };
  });
  const resources = page.sections
    .slice(1)
    .flatMap((section) =>
      section.blocks.flatMap((block) =>
        (block.links || [])
          .filter((link) => !link.href.startsWith("#"))
          .map((link) => ({ label: link.label, href: link.href, area: cleanResearchTitle(section.title) })),
      ),
    )
    .filter((resource, index, list) => list.findIndex((item) => item.href === resource.href) === index)
    .slice(0, 8);

  return `<main class="page research-page">
    ${renderPageHead(page, "Research")}
    <section class="research-intro-panel">
      <div>
        <h2>Overview</h2>
        <p>${escapeHtml(introText)}</p>
      </div>
      <a class="research-primary-link" href="#publications">Publications</a>
    </section>
    <div class="research-area-grid">
      ${areas
        .map(
          (area) => `<article class="research-area-card">
            <div class="research-card-top">
              <span class="research-dot"></span>
              <h2>${escapeHtml(area.title)}</h2>
            </div>
            ${area.keywords ? `<p class="research-keywords">${escapeHtml(area.keywords)}</p>` : ""}
            <p>${escapeHtml(area.description)}</p>
            ${
              area.highlights.length
                ? `<ul class="research-highlights">${area.highlights.map((highlight) => `<li>${escapeHtml(highlight)}</li>`).join("")}</ul>`
                : ""
            }
            <a class="research-card-link" href="${escapeHtml(area.detailLink)}">Read more</a>
          </article>`,
        )
        .join("")}
    </div>
    ${
      resources.length
        ? `<section class="quick-links-panel">
            <div class="quick-links-head">
              <p class="page-kicker">Resources</p>
              <h2>Quick Links</h2>
            </div>
            <div class="resource-grid">
              ${resources
                .map(
                  (resource) => `<a class="resource-card" href="${escapeHtml(resource.href)}"${linkTarget(resource.href)}>
                    <strong>${escapeHtml(linkLabel(resource))}</strong>
                    <span>${escapeHtml(resource.area)} · ${escapeHtml(linkDomain(resource.href))}</span>
                  </a>`,
                )
                .join("")}
            </div>
          </section>`
        : ""
    }
  </main>`;
}

function renderHome(page) {
  const about = page.sections[1];
  const newsSections = page.sections.slice(3, -1);
  const newsYears = uniqueYears(newsSections.map((section) => section.blocks.map((block) => block.text).join(" ")));
  const newsFilter = filters.news;
  const filteredNews = newsSections.filter((section) => {
    const text = section.blocks.map((block) => block.text).join(" ");
    const date = parseDate(text);
    const matchesQuery = !newsFilter.query || text.toLowerCase().includes(newsFilter.query.toLowerCase());
    const matchesYear = newsFilter.year === "All" || date.year === newsFilter.year;
    return matchesQuery && matchesYear;
  });
  return `${renderHero(page)}<main class="page home-page">
    <div class="about-layout">
      <section class="about-panel">
        <h2>${escapeHtml(about.blocks[0]?.text || "About")}</h2>
        <p>${escapeHtml(about.blocks.slice(1).map((block) => block.text).join(" "))}</p>
        ${renderLinks(about.blocks.flatMap((block) => block.links || []))}
      </section>
      <aside class="focus-panel">
        <h2>Focus Areas</h2>
        <ul class="focus-list">
          <li>Biomedical AI <span></span></li>
          <li>Natural Language Processing <span></span></li>
          <li>Graph & Machine Learning <span></span></li>
        </ul>
      </aside>
    </div>
    <div class="timeline-head">
      <div>
        <p class="page-kicker">Archive</p>
        <h2>News</h2>
      </div>
      ${renderFilterControls("news", "Search news", newsYears)}
    </div>
    <div class="news-list">${filteredNews.map(renderNewsItem).join("") || `<div class="empty-state">No matching news.</div>`}</div>
  </main>`;
}

function uniqueYears(texts) {
  const years = new Set();
  texts.forEach((text) => {
    const matches = text.match(/\b(?:19|20)\d{2}\b/g) || [];
    matches.forEach((year) => years.add(year));
  });
  return Array.from(years).sort((a, b) => Number(b) - Number(a));
}

function renderFilterControls(type, placeholder, years) {
  const filter = filters[type];
  const hasActiveFilter = filter.query || filter.year !== "All";
  return `<form class="filter-controls" data-filter-form="${type}">
    <input class="search" name="query" type="search" placeholder="${escapeHtml(placeholder)}" value="${escapeHtml(filter.query)}" aria-label="${escapeHtml(placeholder)}" />
    <select class="year-select" name="year" aria-label="${type} year filter">
      <option value="All"${filter.year === "All" ? " selected" : ""}>All years</option>
      ${years.map((year) => `<option value="${year}"${filter.year === year ? " selected" : ""}>${year}</option>`).join("")}
    </select>
    <button class="filter-button" type="submit">Search</button>
    ${hasActiveFilter ? `<button class="filter-clear" type="button" data-clear-filter="${type}">Clear</button>` : ""}
  </form>`;
}

function parseDate(text) {
  const match = text.match(/^([A-Za-z]+)\.?\s*(\d{4})|^([A-Za-z]+)\s*(\d{4})/);
  if (!match) return { month: "DMIS", year: "News" };
  return { month: match[1] || match[3], year: match[2] || match[4] };
}

function renderNewsItem(section) {
  const textBlock = section.blocks.find((block) => block.type === "paragraph") || section.blocks[0];
  const date = parseDate(textBlock?.text || "");
  const links = section.blocks.flatMap((block) => block.links || []);
  const images = section.images || [];
  return `<article class="news-item ${images.length ? "has-media" : ""}">
    <div class="news-date"><strong>${escapeHtml(date.month)}</strong><span>${escapeHtml(date.year)}</span></div>
    <div class="news-copy"><p>${escapeHtml(displayText(textBlock?.text || ""))}</p>${renderLinks(links)}</div>
    ${
      images.length
        ? `<div class="news-media ${images.length > 1 ? "multi" : ""}">${images
            .map(
              (image) =>
                `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt || "DMIS Lab news image")}" loading="lazy" />`,
            )
            .join("")}</div>`
        : ""
    }
  </article>`;
}

function publicationItems(page) {
  if (!page) return [];
  const items = [];
  let currentSection = "";
  page.sections.forEach((section) => {
    section.blocks.forEach((block) => {
      if (block.text === "Publications" || block.text === pageDescription(page)) return;
      if (block.type.startsWith("heading")) {
        currentSection = block.text;
        items.push({ type: "heading", text: block.text, links: block.links || [] });
        return;
      }
      items.push({ type: "paper", block, section: currentSection || section.title || "Publications" });
    });
  });
  return items;
}

function publicationGroups(page) {
  const groups = [];
  let current = null;
  publicationItems(page).forEach((item) => {
    if (item.type === "heading") {
      current = { title: item.text, links: item.links || [], papers: [] };
      groups.push(current);
      return;
    }
    if (!current) {
      current = { title: item.section || "Publications", links: [], papers: [] };
      groups.push(current);
    }
    current.papers.push(item);
  });
  const preprintGroup = groups.find((group) => group.title === "Preprints");
  if (preprintGroup) {
    const existingText = groups.flatMap((group) => group.papers.map((paper) => paper.block.text)).join(" ");
    arxivEntries
      .filter((entry) => entry.addToPreprints && !normalizePublicationText(existingText).includes(normalizePublicationText(entry.title)))
      .forEach((entry) => {
        preprintGroup.papers.push({
          type: "paper",
          section: "Preprints",
          arxiv: entry,
          block: {
            type: "paragraph",
            text: `${entry.authors}. ${entry.title}. ${entry.venue} ${entry.year}`,
            links: [{ label: "arxiv", href: entry.href }],
          },
        });
      });
  }
  return groups;
}

function renderPublications(page) {
  const allGroups = publicationGroups(page);
  const groups = allGroups.map((group) => ({
    ...group,
    papers: group.papers.filter(publicationMatchesFilter),
  }));
  const publicationYears = uniqueYears(allGroups.flatMap((group) => group.papers.map((paper) => paper.block.text)));
  const topGroups = ["Preprints", "In Press"].map((title) => groups.find((group) => group.title === title)).filter(Boolean);
  const journalGroup = groups.find((group) => group.title === "Journal Articles");
  const conferenceGroup = groups.find((group) => group.title === "Conference Proceedings");
  const otherGroups = groups.filter(
    (group) => !["Preprints", "In Press", "Journal Articles", "Conference Proceedings"].includes(group.title),
  );
  return `<main class="page">
    ${renderPageHead(page)}
    <div class="publication-controls">
      ${renderFilterControls("publications", "Search publications", publicationYears)}
    </div>
    <div class="publication-parallel publication-parallel-top">
      ${topGroups.map((group) => renderPublicationGroup(group, "column")).join("")}
    </div>
    <div class="publication-parallel">
      ${renderPublicationGroup(journalGroup, "column")}
      ${renderPublicationGroup(conferenceGroup, "column")}
    </div>
    ${otherGroups.map((group) => renderPublicationGroup(group, "wide")).join("")}
  </main>`;
}

function publicationMatchesFilter(item) {
  const filter = filters.publications;
  const parsed = parsePublication(item.block.text);
  const searchableText = displayText(item.block.text).toLowerCase();
  const query = displayText(filter.query).toLowerCase();
  const matchesQuery = !query || searchableText.includes(query);
  const matchesYear = filter.year === "All" || parsed.year === filter.year;
  return matchesQuery && matchesYear;
}

function parsePublication(text) {
  const cleanText = displayText(text);
  const parts = cleanText.split(/(?<=\.)\s+/).filter(Boolean);
  const authors = parts.length > 1 ? parts[0].replace(/\.$/, "") : "";
  const rest = parts.length > 1 ? parts.slice(1).join(" ") : cleanText;
  const yearMatch = cleanText.match(/\b(19|20)\d{2}\b/g);
  const year = yearMatch ? yearMatch[yearMatch.length - 1] : "";
  const venuePattern =
    /\b(Preprint|ACL|EACL|EMNLP|ICML|ICLR|KDD|MICCAI|AAAI|NeurIPS|ISMB\/ECCB|ISMB|CIKM|BIBM|Bioinformatics|Bioinformatics Advances|npj|Journal|Nature|Scientific Reports|Scientific Data|Briefings|Database|IEEE|Frontiers|JAMIA|Information Sciences|Expert Systems|PLOS|PLoS|Neural Networks|Cell Systems|Nucleic Acids Research|Genes|BMC|Human Genomics|Proteins|Scientometrics|Soft Computing|Biology Direct|Computational Statistics|Communications of the ACM|Security and Communication Networks|Wireless Personal Communications|Technological Forecasting and Social Change|WWW|IJCAI|PAKDD)\b.*$/i;
  const venueMatch = rest.match(venuePattern);
  const title = venueMatch ? rest.slice(0, venueMatch.index).replace(/[.\s]+$/, "") : rest;
  const venue = venueMatch ? venueMatch[0] : "";
  return { authors, title: title || text, venue, year };
}

function cleanVenue(venue = "", fallback = "Publication") {
  const normalizedVenue = venue.replace(/\s+/g, " ").trim();
  if (/arxiv/i.test(normalizedVenue) && /preprint/i.test(normalizedVenue)) return "Preprint";
  return (normalizedVenue || fallback)
    .replace(/\s*\(IF:\s*[^)]+\)/gi, "")
    .replace(/\s*\(arxiv\)/gi, "")
    .replace(/\s*,?\s*(19|20)\d{2}\s*$/, "")
    .trim();
}

function impactFactorLabel(text = "") {
  const match = text.match(/\(IF:\s*([^)]+)\)/i);
  return match ? `IF ${match[1].replace(/\s+/g, "")}` : "IF";
}

function isJournalPublication(item, parsed) {
  return (
    item.section === "Journal Articles" ||
    /\b(journal|bioinformatics|database|nature|npj|scientific reports|briefings|information sciences|ieee access|frontiers|jamia|plos|neural networks|expert systems|cell systems|bmc|genes|nucleic acids research|scientific data|human genomics)\b/i.test(
      parsed.venue,
    )
  );
}

function renderPublicationItem(item) {
  if (item.type === "heading") {
    return `<section class="publication-section">
      <div>
        <p class="page-kicker">Publications</p>
        <h2>${escapeHtml(item.text)}</h2>
      </div>
      ${renderLinks(item.links)}
    </section>`;
  }
  const parsed = parsePublication(item.block.text);
  const arxivEntry = item.arxiv || findArxivEntry(item.block.text);
  const links = mergeLinks(
    item.block.links,
    arxivEntry ? [{ label: "arxiv", href: arxivEntry.href }] : [],
  );
  const venue = cleanVenue(parsed.venue || arxivEntry?.venue, item.section);
  const isJournal = isJournalPublication(item, parsed);
  const ifBadge = isJournal ? `<span class="if-badge">${escapeHtml(impactFactorLabel(item.block.text))}</span>` : "";
  return `<article class="publication-card">
    <div class="pub-aside">
      <span class="pub-year">${escapeHtml(parsed.year || "DMIS")}</span>
      <span class="pub-section">${escapeHtml(item.section)}</span>
    </div>
    <div class="pub-main">
      <h3>${escapeHtml(parsed.title)}</h3>
      ${parsed.authors ? `<p class="pub-authors">${escapeHtml(parsed.authors)}</p>` : ""}
      <p class="pub-venue"><span>${escapeHtml(venue)}</span>${ifBadge}</p>
      ${renderLinks(links)}
    </div>
  </article>`;
}

function renderPublicationGroup(group, variant) {
  if (!group) return "";
  const isColumn = variant === "column";
  return `<section class="publication-group ${isColumn ? "publication-group-column" : "publication-group-wide"}">
    <div class="publication-group-head">
      <div>
        <p class="page-kicker">${group.papers.length} ${group.papers.length === 1 ? "paper" : "papers"}</p>
        <h2>${escapeHtml(group.title)}</h2>
      </div>
      ${renderLinks(group.links)}
    </div>
    <div class="publication-list ${isColumn ? "compact" : ""}">
      ${
        group.papers.length
          ? group.papers.map(renderPublicationItem).join("")
          : `<div class="empty-state">No matching publications.</div>`
      }
    </div>
  </section>`;
}

function renderPeople(page) {
  const groups = ["All", ...Array.from(new Set(page.people.cards.map((card) => card.group)))];
  const cards = page.people.cards.filter((card) => peopleFilter === "All" || card.group === peopleFilter);
  return `<main class="page">
    ${renderPageHead(page)}
    <div class="people-toolbar">${groups
      .map((group) => `<button class="chip ${group === peopleFilter ? "active" : ""}" type="button" data-filter="${escapeHtml(group)}">${escapeHtml(group)}</button>`)
      .join("")}</div>
    <div class="people-grid">${cards.map(renderPersonCard).join("")}</div>
    ${renderAlumni(page.people.alumni)}
  </main>`;
}

function renderPersonCard(card) {
  const image = card.image?.src
    ? `<img src="${escapeHtml(card.image.src)}" alt="${escapeHtml(card.name)}" loading="lazy" />`
    : "";
  return `<article class="person-card">
    <div class="person-photo">${image}</div>
    <div class="person-info">
      <div class="person-heading">
        <h3>${escapeHtml(card.name)}</h3>
        ${
          card.link
            ? `<a class="person-home" href="${escapeHtml(card.link)}" target="_blank" rel="noreferrer" aria-label="${escapeHtml(
                card.name,
              )} homepage">${iconHome()}<span>Homepage</span></a>`
            : ""
        }
      </div>
      <p class="person-role">${escapeHtml(card.role)}</p>
      <div class="tags">${card.interests.map((interest) => `<span class="tag">${escapeHtml(interest)}</span>`).join("")}</div>
    </div>
  </article>`;
}

function renderAlumni(alumni = []) {
  if (!alumni.length || peopleFilter !== "All") return "";
  return `<section class="alumni">
    <h2>Alumni</h2>
    <div class="alumni-list">${alumni.map((line) => `<p>${escapeHtml(line)}</p>`).join("")}</div>
  </section>`;
}

function splitHeadingGroups(blocks = []) {
  const groups = [];
  let current = null;
  blocks.forEach((block) => {
    if (block.type.startsWith("heading")) {
      current = { title: displayText(block.text), blocks: [], links: block.links || [] };
      groups.push(current);
      return;
    }
    if (!current) {
      current = { title: "Overview", blocks: [], links: [] };
      groups.push(current);
    }
    current.blocks.push(block);
  });
  return groups;
}

function renderProfilePanel(group, className = "") {
  if (!group) return "";
  const items = group.blocks.filter((block) => block.type === "paragraph").map((block) => displayText(block.text)).filter(Boolean);
  return `<section class="profile-panel ${className}">
    <h2>${escapeHtml(group.title)}</h2>
    <ul class="profile-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
  </section>`;
}

function awardItems(blocks = []) {
  const items = [];
  let current = null;
  blocks.forEach((block) => {
    const text = displayText(block.text);
    if (!text) return;
    if (/^\[/.test(text)) {
      current = { title: text, details: [] };
      items.push(current);
      return;
    }
    if (current) current.details.push(text);
  });
  return items;
}

function renderAwards(group) {
  if (!group) return "";
  const awards = awardItems(group.blocks);
  return `<section class="profile-panel profile-awards">
    <div class="profile-panel-head">
      <p class="page-kicker">Selected Achievements</p>
      <h2>${escapeHtml(group.title)}</h2>
    </div>
    <div class="award-grid">
      ${awards
        .map(
          (award) => `<article class="award-card">
            <h3>${escapeHtml(award.title)}</h3>
            <ul>${award.details.map((detail) => `<li>${escapeHtml(detail)}</li>`).join("")}</ul>
          </article>`,
        )
        .join("")}
    </div>
  </section>`;
}

function renderProfileTextPanel(group, kicker) {
  if (!group) return "";
  return `<section class="profile-panel profile-text-panel">
    <p class="page-kicker">${escapeHtml(kicker)}</p>
    <h2>${escapeHtml(group.title)}</h2>
    ${group.blocks
      .filter((block) => block.type === "paragraph")
      .map((block) => `<p>${escapeHtml(displayText(block.text))}</p>`)
      .join("")}
  </section>`;
}

function renderProfile(page) {
  const portrait = page.sections.flatMap((section) => section.images)[0];
  const introBlocks = page.sections[0].blocks;
  const contactLinks = introBlocks.flatMap((block) => block.links || []);
  const introLines = introBlocks.filter((block) => block.type === "paragraph").map((block) => displayText(block.text));
  const phone = introLines.join(" ").match(/Phone:\s*([^,]+)/i)?.[1] || "+82-2-3290-4840";
  const detailGroups = splitHeadingGroups(page.sections[1].blocks);
  const narrativeGroups = splitHeadingGroups(page.sections[2].blocks);
  const education = detailGroups.find((group) => group.title === "Education");
  const experience = detailGroups.find((group) => group.title === "Work Experience");
  const affiliations = detailGroups.find((group) => group.title === "Other Affiliations");
  const awards = narrativeGroups.find((group) => group.title === "Awards");
  const biography = narrativeGroups.find((group) => group.title === "Biography");
  const interests = narrativeGroups.find((group) => group.title === "Research Interests");
  return `<main class="page">
    ${renderPageHead(page)}
    <div class="profile-layout">
      <aside class="profile-card">
        ${portrait ? `<img src="${escapeHtml(portrait.src)}" alt="Prof. Jaewoo Kang" />` : ""}
        <div class="profile-card-body">
          <h2>Prof. Jaewoo Kang</h2>
          <p>Department of Computer Science and Engineering, Korea University</p>
          ${renderLinks(contactLinks)}
        </div>
      </aside>
      <div class="profile-content">
        <section class="profile-summary">
          <p class="page-kicker">Principal Investigator</p>
          <h2>Jaewoo Kang, Ph.D</h2>
          <div class="profile-contact-grid">
            <div><span>Department</span><strong>Computer Science and Engineering</strong></div>
            <div><span>University</span><strong>Korea University</strong></div>
            <div><span>Email</span><strong>kangj@korea.ac.kr</strong></div>
            <div><span>Phone</span><strong>${escapeHtml(phone)}</strong></div>
          </div>
          <div class="profile-tags">
            <span>Biomedical AI</span>
            <span>Data Mining</span>
            <span>Large-scale Information Systems</span>
          </div>
        </section>
        <div class="profile-panel-grid">
          ${renderProfilePanel(education)}
          ${renderProfilePanel(experience)}
          ${renderProfilePanel(affiliations)}
        </div>
        ${renderProfileTextPanel(biography, "Biography")}
        ${renderProfileTextPanel(interests, "Research")}
        ${renderAwards(awards)}
      </div>
    </div>
  </main>`;
}

function renderRoute(options = {}) {
  const previousScroll = window.scrollY;
  const currentRoute = routeFromHash();
  const page = routes.get(currentRoute);
  let body = "";
  if (page.kind === "home") body = renderHome(page);
  else if (page.kind === "people") body = renderPeople(page);
  else if (page.kind === "publications") body = renderPublications(page);
  else if (page.kind === "research" && page.route === "research") body = renderResearchOverview(page);
  else if (page.kind === "profile") body = renderProfile(page);
  else body = renderGenericPage(page);

  app.innerHTML = `<div class="site-shell">${renderHeader(currentRoute)}${body}${renderFooter()}</div>`;
  bindEvents();
  if (options.preserveScroll) {
    requestAnimationFrame(() => {
      window.scrollTo({ top: previousScroll, behavior: "instant" });
    });
    return;
  }
  window.scrollTo({ top: 0, behavior: "instant" });
}

function bindEvents() {
  document.querySelector(".menu-toggle")?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    renderRoute({ preserveScroll: true });
  });

  document.querySelector(".research-toggle")?.addEventListener("click", () => {
    researchMenuOpen = !researchMenuOpen;
    renderRoute({ preserveScroll: true });
  });

  document.querySelectorAll(".menu-link, .nav-link, .submenu-link, .mobile-submenu-link, .brand").forEach((link) => {
    link.addEventListener("click", () => {
      if (link.classList.contains("research-toggle")) return;
      menuOpen = false;
      researchMenuOpen = false;
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      peopleFilter = button.dataset.filter || "All";
      renderRoute({ preserveScroll: true });
    });
  });

  document.querySelectorAll("[data-filter-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = form.dataset.filterForm;
      filters[type].query = form.elements.query.value.trim();
      filters[type].year = form.elements.year.value;
      renderRoute({ preserveScroll: true });
    });
  });

  document.querySelectorAll("[data-clear-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.dataset.clearFilter;
      filters[type].query = "";
      filters[type].year = "All";
      renderRoute({ preserveScroll: true });
    });
  });

  document.querySelectorAll(".year-select").forEach((select) => {
    select.addEventListener("change", () => {
      const form = select.closest("[data-filter-form]");
      const type = form.dataset.filterForm;
      filters[type].query = form.elements.query.value.trim();
      filters[type].year = form.elements.year.value;
      renderRoute({ preserveScroll: true });
    });
  });

  document.querySelectorAll(".search").forEach((input) => {
    input.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      input.value = "";
    });
  });

  document.querySelectorAll("[data-filter-form] input").forEach((input) => {
    input.addEventListener("change", () => {
      input.value = input.value.trimStart();
    });
  });

  document.querySelectorAll("[data-filter-form] input").forEach((input) => {
    input.addEventListener("search", () => {
      if (input.value) return;
      const form = input.closest("[data-filter-form]");
      const type = form.dataset.filterForm;
      filters[type].query = "";
      filters[type].year = form.elements.year.value;
      renderRoute({ preserveScroll: true });
    });
  });

  document.querySelectorAll("[data-filter-form] input").forEach((input) => {
    input.addEventListener("blur", () => {
      input.value = input.value.trim();
    });
  });

  document.querySelectorAll("[data-filter-form] input").forEach((input) => {
    input.addEventListener("focus", () => {
      input.select();
    });
  });

  document.querySelectorAll("[data-filter-form] select").forEach((select) => {
    select.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      select.closest("form").requestSubmit();
    });
  });

  document.querySelectorAll("[data-filter-form]").forEach((form) => {
    form.addEventListener("reset", () => {
      const type = form.dataset.filterForm;
      filters[type].query = "";
      filters[type].year = "All";
      renderRoute({ preserveScroll: true });
    });
  });
}

window.addEventListener("hashchange", () => {
  peopleFilter = "All";
  menuOpen = false;
  researchMenuOpen = false;
  renderRoute();
});

renderRoute();
