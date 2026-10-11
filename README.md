# profil-web

Personal portfolio of **Nasreddine Ben Hamouda** – software developer (backend, cloud & web) and AI video production, based in Germany.

Live site: https://nasreddin-ben-hamouda.github.io/profil-web/

- Static site: `index.html`, `style.css`, `app.js`, no build step
- Four languages: German, English, French and Arabic (right-to-left); switch in the top bar or with `?lang=de|en|fr|ar`
- All text lives in `i18n.js` (`I18N` for interface text, `CONTENT` for services, experience, education, skills and projects)

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Edit content

- Add a project: append an entry to `CONTENT.projects` in `i18n.js` (`cat` is `web`, `mobile` and/or `other`; `repo` is a public GitHub URL or `null` for private repos)
- Change your photo: replace `assets/nasreddine.webp` (square) and `assets/nasreddine.jpg` (link preview)
