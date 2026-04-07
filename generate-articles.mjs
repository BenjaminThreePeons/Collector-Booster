import fs from "fs";
import path from "path";

const TEMPLATE = `<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <title>{{title}} | Collector Booster</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
  <link rel="icon" type="image/png" href="/favicon.png">
</head>
<body>

  <header class="top-nav">
    <div class="top-nav-inner">
      <div class="top-nav-left">
        <a href="index.html" class="site-title">COLLECTOR BOOSTER</a>
      </div>
      <div class="top-nav-right">
        <a href="#newsletter" class="btn-newsletter">Newsletter</a>
      </div>
    </div>
    <div class="topic-wrapper">
      <nav class="topic-bar">
        <a href="index.html" class="topic-pill">Hlavní strana</a>
        <a href="#novinky" class="topic-pill active">Novinky</a>
        <a href="#zacatecnici" class="topic-pill">Pro začátečníky</a>
      </nav>
    </div>
  </header>

  <main>

    <section class="article-hero-header">
      <div class="article-hero-header-inner">
        <p class="article-tag">{{tag}}</p>
        <h1>{{title}}</h1>
        <p class="hero-perex">{{perex}}</p>
      </div>
    </section>

    <figure class="article-hero">
      <img src="{{heroImage}}" alt="{{heroAlt}}">
    </figure>

    <section class="article-section">
      <article class="article">
        {{content}}
      </article>
    </section>

    <section class="related-articles">
      <h2>Další články</h2>
      <div class="related-grid">
        {{related}}
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col footer-about">
        <h3>Collector Booster</h3>
        <p>Collector Booster je český magazín o Magic: The Gathering. Přinášíme novinky ze setů, tipy pro hraní, investiční články i obsah pro sběratele.</p>
      </div>
      <div class="footer-col footer-links">
        <h4>Rubriky</h4>
        <ul>
          <li><a href="index.html">Hlavní strana</a></li>
          <li><a href="index.html#novinky">Novinky</a></li>
          <li><a href="index.html#zacatecnici">Pro začátečníky</a></li>
        </ul>
      </div>
      <div class="footer-col footer-social">
        <h4>Sledujte nás</h4>
        <ul>
          <li><a href="#" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="#" target="_blank" rel="noopener">YouTube</a></li>
          <li><a href="#" target="_blank" rel="noopener">TikTok</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Collector Booster – novinky z Magic: The Gathering.</p>
      <p>Projekt ve spolupráci s <a href="https://threepeons.com" target="_blank" rel="noopener">Three Peons</a>.</p>
    </div>
  </footer>

</body>
</html>`;

const articlesDir = "./content/articles";
const contentDir = "./content/content";

const files = fs.readdirSync(articlesDir).filter(f => f.endsWith(".json"));

for (const file of files) {
  const meta = JSON.parse(fs.readFileSync(path.join(articlesDir, file), "utf-8"));
  const contentFile = path.join(contentDir, file.replace(".json", ".html"));
  const content = fs.readFileSync(contentFile, "utf-8");

  const related = meta.related.map(r => `
    <article class="related-card">
      <a href="${r.href}" class="related-card-link">
        <img src="${r.img}" alt="${r.alt}" class="related-image">
      </a>
      <div class="related-body">
        <a href="${r.href}" class="related-title-link">
          <h3 class="related-title">${r.title}</h3>
        </a>
        <a href="${r.href}" class="related-link">Číst více</a>
      </div>
    </article>`).join("\n");

  const html = TEMPLATE
    .replace(/{{title}}/g, meta.title)
    .replace(/{{tag}}/g, meta.tag)
    .replace(/{{perex}}/g, meta.perex)
    .replace(/{{heroImage}}/g, meta.heroImage)
    .replace(/{{heroAlt}}/g, meta.heroAlt)
    .replace(/{{content}}/g, content)
    .replace(/{{related}}/g, related);

  fs.writeFileSync(meta.slug, html, "utf-8");
  console.log(`✅ Vygenerováno: ${meta.slug}`);
}