import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhfoO5KCXPyqNG7kj6fB0_9a_gpm4ULCE",
  authDomain: "l-habilleur.firebaseapp.com",
  projectId: "l-habilleur",
  storageBucket: "l-habilleur.appspot.com",
  messagingSenderId: "716225359007",
  appId: "1:716225359007:web:60ea327675a59e8d0e46aa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;