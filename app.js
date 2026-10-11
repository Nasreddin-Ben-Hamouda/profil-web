/* Renders the translated content and handles the language switch and project filter. */
(function () {
  const LANGS = ["de", "en", "fr", "ar"];
  const ICONS = {
    code: '<path d="M8.5 7 3.5 12l5 5M15.5 7l5 5-5 5M13.5 4l-3 16"/>',
    cloud: '<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 17.8 8.6 4.7 4.7 0 0 1 17.5 18H7z"/>',
    frontend: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3z"/>'
  };
  const LINK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/></svg>';

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pick = (o, l) => (typeof o === "string" ? o : o[l] || o.en);

  function storedLang() {
    try { return localStorage.getItem("lang"); } catch (e) { return null; }
  }
  function initialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    const s = storedLang();
    if (LANGS.includes(s)) return s;
    const nav = (navigator.language || "de").slice(0, 2);
    return LANGS.includes(nav) ? nav : "de";
  }

  function render(lang) {
    const t = I18N[lang];
    document.documentElement.lang = t.htmlLang;
    document.documentElement.dir = t.dir;
    document.title = t["meta.title"];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = t[el.dataset.i18n];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));

    document.getElementById("services-list").innerHTML = CONTENT.services.map((s) => `
      <article class="card">
        <svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[s.icon]}</svg>
        <h3>${esc(pick(s.title, lang))}</h3>
        <p>${esc(pick(s.text, lang))}</p>
      </article>`).join("");

    document.getElementById("projects-list").innerHTML = CONTENT.projects.map((p) => `
      <article class="project" data-cat="${p.cat}">
        <div class="p-head">
          <h3>${esc(p.name)}</h3><span class="year">${p.year}</span>
        </div>
        ${p.team ? `<span class="badge">${esc(t["projects.team"])}</span>` : ""}
        <p>${esc(pick(p.text, lang))}</p>
        <div class="tags">${p.tech.map((x) => `<span>${esc(x)}</span>`).join("")}</div>
        ${p.repo
          ? `<a class="repo" href="${p.repo}" target="_blank" rel="noopener">${LINK_ICON}<span>${esc(t["projects.code"])}</span></a>`
          : `<span class="repo muted">🔒 ${esc(t["projects.private"])}</span>`}
      </article>`).join("");
    document.getElementById("projectCount").textContent = CONTENT.projects.length;
    applyFilter(currentFilter);

    const tl = (items, withText) => items.map((e) => `
      <li>
        <span class="t-date">${esc(pick(e.date, lang))}</span>
        <h3>${esc(pick(e.role || e.title, lang))}</h3>
        <p class="t-org">${esc(pick(e.org, lang))}${e.place ? " · " + esc(pick(e.place, lang)) : ""}</p>
        ${withText && e.text ? `<p>${esc(pick(e.text, lang))}</p>` : ""}
      </li>`).join("");
    document.getElementById("experience-list").innerHTML = tl(CONTENT.experience, true);
    document.getElementById("education-list").innerHTML = tl(CONTENT.education, false);

    document.getElementById("languages-list").innerHTML = CONTENT.languages.map((l) => `
      <div class="lang-row">
        <div class="lang-top"><span>${esc(pick(l.name, lang))}</span><span class="lvl">${esc(l.level === "native" ? t["lvl.native"] : l.level)}</span></div>
        <div class="bar"><i style="width:${l.pct}%"></i></div>
      </div>`).join("");

    document.getElementById("hero-skills").innerHTML = CONTENT.heroSkills.map((x) => `<span>${esc(pick(x, lang))}</span>`).join("");

    document.getElementById("skills-list").innerHTML = CONTENT.skills.map((g) => `
      <div class="skill-group">
        <h3>${esc(pick(g.group, lang))}</h3>
        <div class="tags">${g.items.map((x) => `<span>${esc(pick(x, lang))}</span>`).join("")}</div>
      </div>`).join("");

    try { localStorage.setItem("lang", lang); } catch (e) { /* storage unavailable */ }
  }

  let currentFilter = "all";
  function applyFilter(f) {
    currentFilter = f;
    document.querySelectorAll(".filters button").forEach((b) => b.classList.toggle("active", b.dataset.filter === f));
    document.querySelectorAll(".project").forEach((el) => {
      el.hidden = !(f === "all" || el.dataset.cat.split(" ").includes(f));
    });
  }

  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => render(b.dataset.lang)));
  document.querySelectorAll(".filters button").forEach((b) => b.addEventListener("click", () => applyFilter(b.dataset.filter)));
  document.getElementById("year").textContent = new Date().getFullYear();
  render(initialLang());
})();
