# Speaking Spanish — v1.2

GitHub Pages Mexican Spanish learning site with Firebase email/password accounts, private per-user progress, and local partner speaking activities. The theme retains the existing navy/slate-blue/Montserrat styling.

## Publish

Upload the **contents** of this folder to the root of the existing `speaking_spanish` GitHub repository (replace same-named files). Keep GitHub Pages set to `main` / `(root)`.

## Firebase setup (required for accounts)

1. Visit https://console.firebase.google.com/ and create a Firebase project.
2. In Project settings > General, register a **Web app**. Copy its Firebase configuration into `assets/js/firebase-config.js`, replacing the `REPLACE_ME` values. Do **not** paste a service-account key or admin secret here.
3. In Authentication > Sign-in method, enable **Email/Password**.
4. In Authentication > Settings > Authorized domains, add `ameliameyer.github.io` if it is not already listed.
5. In Firestore Database, create a database. Under **Rules**, paste the contents of `firestore.rules` and **Publish**. Never leave Firestore in test mode or with public read/write access.
6. Commit the updated config file and site files to GitHub. Wait for Pages to deploy. Both learners can then create accounts using separate emails.

The web Firebase config is designed to be public; Firestore rules restrict each user's document to their own signed-in UID. For production use, consider enabling Firebase App Check and password reset/email verification.

## How it works

- Each account stores completed lesson IDs in `users/{uid}` in Firestore. Progress syncs across devices after signing in.
- **Practice Together** provides three guided two-person scenarios, role switching, and optional English translations. It works in person or on a call, with no partner linking or shared database access required.
- Partner activity completion is not yet tracked, and the site does not currently offer live multiplayer sessions, partner invitations, or shared statistics.
- Only the first three A0 lessons currently have full study guides; the remaining lessons are planned.
- For local testing, use a local web server (for example `python -m http.server 8000`) rather than opening `index.html` directly.

## Security notes

Do not commit passwords, Firebase Admin SDK keys, or service account credentials. Use the included security rules. This is a client-only learning app, not a backend service.
