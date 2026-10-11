/* Language switch for the legal pages; shares the stored language with the main page. */
(function () {
  const LANGS = ["de", "en", "fr", "ar"];
  function initial() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    try { const s = localStorage.getItem("lang"); if (LANGS.includes(s)) return s; } catch (e) { /* storage unavailable */ }
    return "de";
  }
  function show(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-lang-block]").forEach((el) => el.classList.toggle("show", el.dataset.langBlock === lang));
    document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("active", b.dataset.lang === lang));
    try { localStorage.setItem("lang", lang); } catch (e) { /* storage unavailable */ }
  }
  document.querySelectorAll(".lang button").forEach((b) => b.addEventListener("click", () => show(b.dataset.lang)));
  show(initial());
})();
