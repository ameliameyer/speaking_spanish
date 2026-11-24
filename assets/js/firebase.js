import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, browserLocalPersistence, sendPasswordResetEmail, linkWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const config = {
  apiKey: "AIzaSyBZVJS6ojaszBwfKNCpvC-9sxjUAk8T3Pg",
  authDomain: "speakingspanish-5c01d.firebaseapp.com",
  projectId: "speakingspanish-5c01d",
  storageBucket: "speakingspanish-5c01d.firebasestorage.app",
  messagingSenderId: "836466108795",
  appId: "1:836466108795:web:a3c302330b27cef25035de",
  measurementId: "G-WWTBP6JJLH"
};
const app = initializeApp(config);
const auth = getAuth(app);
const db = getFirestore(app);
const google = new GoogleAuthProvider();
google.setCustomParameters({ prompt: "select_account" });
let user = null, completed = [], profileListener = () => {};
let readyResolve;
export const authReady = new Promise(resolve => { readyResolve = resolve; });
const progressRef = uid => doc(db, "users", uid);
const migrationKey = uid => "ss-progress-migrated:" + uid;
const safeLocal = () => { try { const v = JSON.parse(localStorage.getItem("ss-completed") || "[]"); return Array.isArray(v) ? v.filter(x => typeof x === "string") : []; } catch { return []; } };
async function loadProgress(u) {
  const ref = progressRef(u.uid);
  const snapshot = await getDoc(ref);
  const stored = snapshot.exists() && Array.isArray(snapshot.data().completed) ? snapshot.data().completed.filter(x => typeof x === "string") : [];
  // Browser-only progress is not merged automatically: it may belong to another learner.
  // A one-time, opt-in migration is available in the account menu.
  completed = [...new Set(stored)];
  return completed;
}
export function getCurrentUser() { return user; }
export function getCompleted() { return [...completed]; }
export function onProfileChange(fn) { profileListener = fn; }
export async function completeLesson(id) {
  if (!user) throw new Error("Sign in to save progress across devices.");
  const next = [...new Set([...completed, id])];
  await setDoc(progressRef(user.uid), { completed: next, updatedAt: new Date().toISOString(), name: user.displayName || "" }, { merge: true });
  completed = next;
  profileListener();
}
export async function migrateLocal() {
  if (!user) throw new Error("Sign in first.");
  if (localStorage.getItem(migrationKey(user.uid))) return;
  const local = safeLocal();
  const next = [...new Set([...completed, ...local])];
  await setDoc(progressRef(user.uid), { completed: next, updatedAt: new Date().toISOString() }, { merge: true });
  completed = next;
  localStorage.setItem(migrationKey(user.uid), "1");
  profileListener();
}
export function hasLocalProgress() { return !!user && !localStorage.getItem(migrationKey(user.uid)) && safeLocal().some(x => !completed.includes(x)); }
export async function loginGoogle() {
  try { await signInWithPopup(auth, google); }
  catch (e) {
    if (e.code === "auth/popup-blocked") throw new Error("Allow pop-ups for this site and try again.");
    if (e.code === "auth/account-exists-with-different-credential") throw new Error("An account already uses that email with another sign-in method. Sign in with your existing method first.");
    throw e;
  }
}
export async function loginEmail(email, password) { await signInWithEmailAndPassword(auth, email.trim(), password); }
export async function registerEmail(email, password) { await createUserWithEmailAndPassword(auth, email.trim(), password); }
export async function logout() { await signOut(auth); }
export async function resetPassword(email) { await sendPasswordResetEmail(auth, email.trim()); }
onAuthStateChanged(auth, async u => {
  user = u;
  completed = [];
  if (u) {
    try { await loadProgress(u); }
    catch (e) { console.error("Firestore progress loading failed", e); window.dispatchEvent(new CustomEvent("ss-error",{detail: "Could not load your progress. Check your Firestore rules and connection."})); }
  }
  readyResolve();
  profileListener();
});

function personalRef(uid){return collection(db,"users",uid,"vocabulary")}
export async function listPersonalWords(){const u=user;if(!u)throw Error("Sign in first.");const snap=await getDocs(personalRef(u.uid));if(user?.uid!==u.uid)throw Error("Account changed.");return snap.docs.map(d=>({...d.data(),id:d.id}));}
export async function savePersonalWord(entry){const u=user;if(!u)throw Error("Sign in first.");const es=entry.es.trim(),en=entry.en.trim();if(!es||!en)throw Error("Enter both Spanish and English.");const id=entry.id||crypto.randomUUID();await setDoc(doc(personalRef(u.uid),id),{es,en,note:entry.note||"",mastery:entry.mastery||"New"},{merge:true});}
export async function removePersonalWord(id){if(!user)throw Error("Sign in first.");await deleteDoc(doc(personalRef(user.uid),id));}
