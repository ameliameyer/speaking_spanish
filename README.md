# Speaking Spanish 🇲🇽
A self-paced Mexican Spanish learning website, starting at A0.

## Deploy to GitHub Pages
1. Create a public repository named `speaking_spanish`.
2. Upload **the contents** of this folder to the repository root (including `index.html`).
3. Open **Settings → Pages → Build and deployment**.
4. Choose **Deploy from a branch**, `main`, and `/(root)`; save.
5. Visit `https://ameliameyer.github.io/speaking_spanish/` once deployment finishes.

## Current scope
- Working home dashboard and browser-local completion tracking
- A0 course outline with 12 lessons; first 3 lessons have complete starter guides and interactive quizzes
- Searchable starter vocabulary, present tense ser/estar reference, introductory dialogue
- A1–C2 are curriculum placeholders, **not** complete lessons
- No audio, spaced repetition engine, or cross-device synchronization yet

## Notes
Progress is stored in browser `localStorage`, not a GitHub account. Clearing site data or switching devices can reset it. The site needs HTTP(S) to load JSON with `fetch`; for local preview use `python -m http.server 8000` in the repository directory.
