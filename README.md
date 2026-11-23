# Speaking Spanish 🇲🇽
GitHub Pages learning site for Mexican Spanish, with Firebase Authentication and Cloud Firestore.

## Version 1.4
- Preserves the original Montserrat, navy/slate-blue Ducks in Order-inspired theme and curriculum.
- Adds Google Sign-In (popup) and optional email/password accounts.
- Syncs lesson completion for each Firebase UID at `users/{uid}`.
- Adds three independent role-switching **Practice Together** conversations. In-person/call only; shared linked accounts/live sync are not yet implemented.
- Browser-only legacy progress is *not automatically merged across users*. Signed-in learners can opt to import it once.

## Firebase setup
1. Open Firebase Console for project `speakingspanish-5c01d`.
2. Under Authentication, enable **Google** and optionally **Email/Password**.
3. Under Authentication → Settings → Authorized domains, add `ameliameyer.github.io`.
4. Create default Cloud Firestore database (Standard edition) in your desired US location.
5. Publish the included `firestore.rules`. They permit each authenticated UID to access only its own `users/{uid}` document and subcollections.
6. No npm or Firebase Hosting required; the website imports the modular SDK directly over HTTPS.

## Deployment
This repository publishes GitHub Pages from `main`. Merge the v1.4 pull request after review to deploy it.

## Notes
- Firebase web config is a public client configuration, not a server secret. Protect user data with Firestore rules.
- A0 lesson outline has 12 lessons; three starter lessons are interactive.
- A1–C2 remain planned, not implemented.
- Shared partner accounts, live sessions, pronunciation audio and spaced repetition remain future work.
