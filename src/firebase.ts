// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database'; // ✅ add this

const firebaseConfig = {
  apiKey: "AIzaSyAUiZvH9_Qcp2B9j1omtG58JQYwzA2u910",
  authDomain: "neu-social-networking.firebaseapp.com",
  projectId: "neu-social-networking",
  storageBucket: "neu-social-networking.firebasestorage.app",
  messagingSenderId: "70057418404",
  appId: "1:70057418404:web:0d15f003f5ab078fff5031",
  measurementId: "G-SWL2MZ5MGB"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app); // ✅ export Realtime DB

export default app;
