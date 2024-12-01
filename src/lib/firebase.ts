import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAJXOnZtFqhFAPG_sOJBFGS_B8YUkCdM8A",
  authDomain: "solicitacao-rotulos.firebaseapp.com",
  projectId: "solicitacao-rotulos",
  storageBucket: "solicitacao-rotulos.firebasestorage.app",
  messagingSenderId: "697076805954",
  appId: "1:697076805954:web:0c56e8426fcf1ebf27d8db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore instance
export const db = getFirestore(app);

// Get Storage instance
export const storage = getStorage(app);

export default app;