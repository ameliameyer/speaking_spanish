import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import { getFirestore, doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';
import { firebaseConfig } from './firebase-config.js';
const bar=document.querySelector('#account-bar');
const configured=firebaseConfig.apiKey!=='REPLACE_ME' && firebaseConfig.projectId!=='REPLACE_ME';
const state=window.SpanishAuth={user:null,completed:[],saveProgress:async()=>{throw Error('Sign in first')}};
const refresh=()=>window.dispatchEvent(new Event('spanish-auth-change'));
const safe=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!configured){bar.innerHTML='<strong>Accounts not configured yet.</strong> Follow the Firebase setup instructions in README.md to enable individual progress.';}
else {
 const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app);
 const showForm=(message='')=>{bar.innerHTML=`<form id="account-form" class="account-form"><label>Display name <input id="display-name" type="text" autocomplete="nickname" maxlength="40" placeholder="For new accounts"></label><label>Email <input id="account-email" type="email" autocomplete="email" required></label><label>Password <input id="account-password" type="password" autocomplete="current-password" minlength="6" required></label><button type="submit" id="sign-in">Sign in</button><button type="button" id="sign-up" class="secondary">Create account</button><span class="muted" id="account-message" role="status">${safe(message)}</span></form>`;
 const email=()=>document.querySelector('#account-email').value.trim();const password=()=>document.querySelector('#account-password').value;
 const submit=async(register)=>{const msg=document.querySelector('#account-message');msg.textContent='Please wait…';try{if(register){const name=document.querySelector('#display-name').value.trim();if(!name)throw Error('Enter a display name to create an account.');const credential=await createUserWithEmailAndPassword(auth,email(),password());await updateProfile(credential.user,{displayName:name});await setDoc(doc(db,'users',credential.user.uid),{displayName:name,completed:[]});}else await signInWithEmailAndPassword(auth,email(),password());}catch(e){msg.textContent=e.message}};
 document.querySelector('#account-form').onsubmit=e=>{e.preventDefault();submit(false)};document.querySelector('#sign-up').onclick=()=>submit(true);
 };
 state.saveProgress=async(ids)=>{if(!state.user)throw Error('Sign in first');await setDoc(doc(db,'users',state.user.uid),{completed:ids},{merge:true});state.completed=ids;refresh()};
 onAuthStateChanged(auth,async user=>{state.user=user;state.completed=[];if(!user){showForm();refresh();return}try{const snap=await getDoc(doc(db,'users',user.uid));state.completed=Array.isArray(snap.data()?.completed)?snap.data().completed:[];bar.innerHTML=`<span>Signed in as <strong>${safe(user.displayName||user.email)}</strong></span> <button id="sign-out" class="secondary">Sign out</button>`;document.querySelector('#sign-out').onclick=()=>signOut(auth);}catch(e){bar.innerHTML=`<span>Signed in, but progress could not load: ${safe(e.message)}</span> <button id="sign-out" class="secondary">Sign out</button>`;document.querySelector('#sign-out').onclick=()=>signOut(auth);}refresh()});
}
