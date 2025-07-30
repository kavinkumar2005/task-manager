import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCqm_TdecTYsnHlALMrHXp_dEsc992L0KA",
  authDomain: "taskmanager-f0a67.firebaseapp.com",
  projectId: "taskmanager-f0a67",
  storageBucket: "taskmanager-f0a67.firebasestorage.app",
  messagingSenderId: "124454153622",
  appId: "1:124454153622:web:c06b2ffa917747e50381b7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;
