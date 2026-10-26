#!/usr/bin/env python3
"""Build static, crawlable paper metadata from _data/research.json.

Run after updating the catalog. Existing project content outside the marked
blocks stays hand-authored. No network requests or third-party packages needed.
"""

import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://txxnrd.github.io"
PAPERS = json.loads((ROOT / "_data/research.json").read_text())


def esc(value):
    return html.escape(str(value), quote=True)


def absolute(path):
    return BASE + path if path.startswith("/") else path


def block(name, content):
    return f"<!-- research:{name}:start -->\n{content}\n<!-- research:{name}:end -->"


def update_block(source, name, content, anchor, before=True):
    generated = block(name, content)
    pattern = rf"<!-- research:{name}:start -->.*?<!-- research:{name}:end -->"
    if re.search(pattern, source, flags=re.S):
        return re.sub(pattern, lambda _: generated, source, flags=re.S)
    assert source.count(anchor) == 1, (name, anchor)
    replacement = generated + "\n" + anchor if before else anchor + "\n" + generated
    return source.replace(anchor, replacement, 1)


def article(p):
    url = BASE + p["path"]
    result = {
        "@type": "ScholarlyArticle", "@id": url + "#article",
        "name": p["title"], "headline": p["title"], "url": url,
        "mainEntityOfPage": url, "description": p["summary"],
        "abstract": p["abstract"], "inLanguage": p["language"],
        "image": absolute(p["image"]), "keywords": p["keywords"],
        "author": [dict({"@type": "Person", "name": name}, **(
            {"@id": BASE + "/#person", "url": BASE + "/"}
            if name in ("Taeyun Roh", "노태윤") else {})) for name in p["authors"]],
        "sameAs": [p["source_url"]],
    }
    if len(p["date"]) == 10:
        result["datePublished"] = p["date"]
    if p.get("updated"):
        result["dateModified"] = p["updated"]
    if p.get("english_title"):
        result["alternateName"] = p["english_title"]
    if p.get("doi"):
        result["identifier"] = {"@type": "PropertyValue", "propertyID": "DOI", "value": p["doi"]}
        result["sameAs"].append("https://doi.org/" + p["doi"])
    if p.get("arxiv") and p["source_url"] != "https://arxiv.org/abs/" + p["arxiv"]:
        result["sameAs"].append("https://arxiv.org/abs/" + p["arxiv"])
    if p.get("license") and "creativecommons.org" in p["license"]:
        result["license"] = p["license"]
    if p.get("local_pdf"):
        result["encoding"] = {"@type": "MediaObject", "encodingFormat": "application/pdf", "contentUrl": BASE + p["local_pdf"]}
    if p.get("pages"):
        result.update(pageStart=p["pages"][0], pageEnd=p["pages"][1])
    return result


def jsonld(value):
    return '<script type="application/ld+json">\n' + json.dumps(value, ensure_ascii=False, indent=2).replace("<", "\\u003c") + "\n</script>"


def metadata(p):
    fields = [("citation_title", p["title"])]
    fields += [("citation_author", a) for a in p["citation_authors"]]
    fields += [("citation_publication_date", p["date"].replace("-", "/")),
               ("citation_language", p["language"]), ("citation_abstract_html_url", BASE + p["path"])]
    # Scholar requires the PDF to share a domain with its HTML abstract page.
    if p.get("local_pdf"):
        assert (ROOT / p["local_pdf"].lstrip("/")).is_file(), p["local_pdf"]
        fields.append(("citation_pdf_url", BASE + p["local_pdf"]))
    if p.get("arxiv"):
        fields.append(("citation_arxiv_id", p["arxiv"]))
    if p.get("doi"):
        fields.append(("citation_doi", p["doi"]))
    if p["status"] in ("Accepted", "Published"):
        fields.append(("citation_conference_title", p["venue"]))
    if p.get("pages"):
        fields += [("citation_firstpage", p["pages"][0]), ("citation_lastpage", p["pages"][1])]
    graph = {"@context": "https://schema.org", "@graph": [article(p), {
        "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": BASE + "/"},
            {"@type": "ListItem", "position": 2, "name": "Publications", "item": BASE + "/publications.html"},
            {"@type": "ListItem", "position": 3, "name": p["title"], "item": BASE + p["path"]}]}]}
    return "\n".join(f'<meta name="{k}" content="{esc(v)}" />' for k, v in fields) + "\n" + jsonld(graph)


def bibtex(p):
    fields = {"title": p["title"], "author": " and ".join(p["citation_authors"]), "year": p["date"][:4]}
    fields["booktitle" if p["status"] in ("Accepted", "Published") else "journal"] = p["venue"]
    if p.get("arxiv"):
        fields.update(eprint=p["arxiv"], archivePrefix="arXiv")
    if p.get("doi"):
        fields["doi"] = p["doi"]
    if p.get("pages"):
        fields["pages"] = "--".join(p["pages"])
    fields["url"] = p["source_url"]
    kind = "inproceedings" if "booktitle" in fields else "article"
    return f'@{kind}{{{p["id"].replace("-", "")}{p["date"][:4]},\n' + ",\n".join(f"  {key} = {{{value}}}" for key, value in fields.items()) + "\n}\n"


def abstract_section(p):
    label = "arXiv:" + p["arxiv"] if p["source_url"].startswith("https://arxiv.org/") else p["venue"]
    attribution = f'<p class="paper-source">Source: <a href="{esc(p["source_url"])}">{esc(label)}</a>.'
    if p.get("arxiv") and not p["source_url"].startswith("https://arxiv.org/"):
        attribution += f' Author manuscript: <a href="https://arxiv.org/abs/{p["arxiv"]}">arXiv:{p["arxiv"]}</a>.'
    if p.get("updated"):
        attribution += f' Version dated <time datetime="{p["updated"]}">{p["updated"]}</time>.'
    if p.get("local_pdf") and p.get("license"):
        attribution += f' Author manuscript reproduced unchanged under <a href="{esc(p["license"])}">CC BY 4.0</a>.'
    attribution += "</p>"
    return f'''<section class="project-section project-two-column" aria-labelledby="abstract-title" id="abstract">
  <div><p class="card-label">Paper</p><h2 id="abstract-title">Abstract</h2></div>
  <div class="project-text"><p lang="{p['language']}">{esc(p['abstract'])}</p>{attribution}</div>
</section>'''


def resources(p):
    links = [(p["source_url"], "Publication record"), (p.get("local_pdf", p["pdf_source"]), "Read PDF"), (f'/citations/{p["id"]}.bib', "Download BibTeX")]
    for field, label in (("project_url", "Project"), ("code_url", "Code")):
        if p.get(field):
            links.append((p[field], label))
    actions = " ".join(f'<a class="button button-secondary" href="{esc(url)}">{label} <span aria-hidden="true">↗</span></a>' for url, label in links)
    return f'''<section class="project-section" aria-labelledby="cite-title" id="citation">
  <div class="project-section-heading"><p class="card-label">Resources</p><h2 id="cite-title">Read and cite this paper</h2></div>
  <div class="hero-actions">{actions}</div>
  <pre class="citation-block"><code>{esc(bibtex(p).strip())}</code></pre>
</section>'''


def related(p):
    candidates = [q for q in PAPERS if q != p and q["language"] == p["language"]]
    candidates.sort(key=lambda q: -len(set(q["keywords"]) & set(p["keywords"])))
    links = "".join(f'<li><a href="{q["path"]}">{esc(q["title"])}</a></li>' for q in candidates[:3])
    return '<section class="project-section paper-related" aria-labelledby="related-title"><h2 id="related-title">Related research</h2><ul>' + links + '</ul><a class="text-link" href="/publications.html">All publications ↗</a></section>'


def new_page(p):
    home = (ROOT / "index.html").read_text()
    header = re.search(r'<header class="site-header">.*?</header>', home, re.S)[0]
    header = header.replace(' class="is-active" aria-current="page"', '')
    title = esc(p["title"])
    subtitle = f'<p class="page-intro" lang="en">{esc(p["english_title"])}</p>' if p.get("english_title") else ''
    authors = ", ".join(f'<a href="/" rel="author">{esc(a)}</a>' if a in ("Taeyun Roh", "노태윤") else esc(a) for a in p["authors"])
    return f'''<!doctype html>
<html lang="{p['language']}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} | Taeyun Roh</title>
    <meta name="description" content="{esc(p['summary'])}" />
    <link rel="canonical" href="{BASE}{p['path']}" />
    <link rel="icon" href="/img/taeyun.png" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{esc(p['summary'])}" />
    <meta property="og:url" content="{BASE}{p['path']}" />
    <meta property="og:image" content="{absolute(p['image'])}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{esc(p['summary'])}" />
    <meta name="twitter:image" content="{absolute(p['image'])}" />
    {block('metadata', metadata(p))}
    <script>try {{ document.documentElement.dataset.theme = localStorage.getItem('theme') === 'night' ? 'night' : 'day'; }} catch {{ document.documentElement.dataset.theme = 'day'; }}</script>
    <link rel="stylesheet" href="/style.css?v=20261025-research" />
    <script defer src="/theme.js"></script>
  </head>
  <body class="sub-page project-page paper-page">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="page-shell">
      {header}
      <main class="sub-main" id="main-content">
        <nav class="paper-breadcrumbs" aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/publications.html">Publications</a></nav>
        <section class="project-hero"><div class="project-hero-copy">
          <p class="eyebrow">{esc(p['venue'])} · {p['date'][:4]} · {p['status']}</p>
          <h1>{title}</h1>{subtitle}
          <p class="project-authors">{authors}</p>
          <p class="page-intro">{esc(p['summary'])}</p>
          <div class="hero-actions"><a class="button button-primary" href="{esc(p.get('local_pdf', p['pdf_source']))}">Read PDF ↗</a><a class="button button-secondary" href="#citation">Cite this paper ↓</a></div>
        </div></section>
        {abstract_section(p)}
        {resources(p)}
        {related(p)}
      </main>
      <footer class="site-footer"><a href="/">Taeyun Roh · 노태윤</a><a href="/publications.html">All publications ↗</a></footer>
    </div>
  </body>
</html>
'''


def build():
    (ROOT / "citations").mkdir(exist_ok=True)
    for p in PAPERS:
        target = ROOT / p["path"].lstrip("/") / "index.html"
        if p["path"].startswith("/research/"):
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(new_page(p))
        else:
            source = target.read_text()
            # Replace the older BUZZY schema instead of keeping conflicting copies.
            if p["id"] == "buzzy" and "research:metadata:start" not in source:
                source = re.sub(r'    <script type="application/ld\+json">.*?</script>\s*', '', source, flags=re.S)
            source = update_block(source, "metadata", metadata(p), "</head>")
            source = update_block(source, "abstract", abstract_section(p), '<section class="project-section', before=True) if "research:abstract:start" in source else source
            if "research:abstract:start" not in source:
                # Existing projects have one hero, followed by their narrative sections.
                pos = source.index('<section class="project-section')
                source = source[:pos] + block("abstract", abstract_section(p)) + "\n        " + source[pos:]
            source = update_block(source, "resources", resources(p) + "\n" + related(p), "</main>")
            target.write_text(source)
        (ROOT / "citations" / (p["id"] + ".bib")).write_text(bibtex(p))
    (ROOT / "publications.bib").write_text("\n".join(bibtex(p) for p in PAPERS))
    collection = {"@context": "https://schema.org", "@type": "CollectionPage", "@id": BASE + "/publications.html#collection", "url": BASE + "/publications.html", "name": "Publications by Taeyun Roh", "mainEntity": {"@type": "ItemList", "numberOfItems": len(PAPERS), "itemListElement": [{"@type": "ListItem", "position": i + 1, "item": article(p)} for i, p in enumerate(PAPERS)]}}
    target = ROOT / "publications.html"
    target.write_text(update_block(target.read_text(), "collection", jsonld(collection), "</head>"))


if __name__ == "__main__":
    build()
    print(f"Built metadata, abstracts and BibTeX for {len(PAPERS)} papers.")
